import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getModelById } from '@/lib/models';

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Función para manejar Gemini
async function handleGemini(modelId: string, message: string, history: Message[]) {
  const model = genAI.getGenerativeModel({ model: modelId });

  const chatHistory = history?.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  })) || [];

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 2000,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

// Función para manejar Groq, Together AI, OpenAI (formato compatible con OpenAI)
async function handleOpenAICompatible(
  endpoint: string,
  apiKey: string,
  modelId: string,
  message: string,
  history: Message[]
) {
  const messages = [
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Función para manejar Hugging Face
async function handleHuggingFace(modelId: string, message: string, history: Message[]) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY no configurada');
  }

  // Construir prompt con el historial completo
  const conversationHistory = history.map((msg) =>
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n');

  const fullPrompt = conversationHistory
    ? `${conversationHistory}\nUser: ${message}\nAssistant:`
    : `User: ${message}\nAssistant:`;

  const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face Error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Manejar diferentes formatos de respuesta
  let generatedText = '';

  if (Array.isArray(data) && data[0]?.generated_text) {
    generatedText = data[0].generated_text;
  } else if (data.generated_text) {
    generatedText = data.generated_text;
  } else if (typeof data === 'string') {
    generatedText = data;
  } else {
    throw new Error('Formato de respuesta inesperado de Hugging Face');
  }

  // Limpiar el prompt de la respuesta si está incluido
  const cleanedText = generatedText.replace(fullPrompt, '').trim();
  return cleanedText || generatedText;
}

export async function POST(request: Request) {
  try {
    const { message, history, modelId = 'gemini-2.5-flash' } = await request.json();

    const modelConfig = getModelById(modelId);

    if (!modelConfig) {
      return NextResponse.json(
        { success: false, error: 'Modelo no encontrado' },
        { status: 400 }
      );
    }

    let responseText: string;

    // Manejar según el proveedor
    if (modelConfig.provider === 'Google') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'GEMINI_API_KEY no configurada en variables de entorno' },
          { status: 500 }
        );
      }
      responseText = await handleGemini(modelId, message, history);
    }
    else if (modelConfig.provider === 'Groq') {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'GROQ_API_KEY no configurada. Obtén tu clave en https://console.groq.com/' },
          { status: 500 }
        );
      }
      responseText = await handleOpenAICompatible(
        modelConfig.endpoint!,
        apiKey,
        modelId,
        message,
        history
      );
    }
    else if (modelConfig.provider === 'Together AI') {
      const apiKey = process.env.TOGETHER_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'TOGETHER_API_KEY no configurada. Obtén tu clave en https://api.together.xyz/' },
          { status: 500 }
        );
      }
      responseText = await handleOpenAICompatible(
        modelConfig.endpoint!,
        apiKey,
        modelId,
        message,
        history
      );
    }
    else if (modelConfig.provider === 'DeepSeek') {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'DEEPSEEK_API_KEY no configurada. Obtén tu clave en https://platform.deepseek.com/' },
          { status: 500 }
        );
      }
      responseText = await handleOpenAICompatible(
        modelConfig.endpoint!,
        apiKey,
        modelId,
        message,
        history
      );
    }
    else if (modelConfig.provider === 'OpenAI') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: 'OPENAI_API_KEY no configurada. Obtén tu clave en https://platform.openai.com/' },
          { status: 500 }
        );
      }
      responseText = await handleOpenAICompatible(
        modelConfig.endpoint!,
        apiKey,
        modelId,
        message,
        history
      );
    }
    else if (modelConfig.provider === 'Hugging Face') {
      responseText = await handleHuggingFace(modelId, message, history);
    }
    else {
      return NextResponse.json(
        { success: false, error: `Proveedor ${modelConfig.provider} no soportado` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      response: responseText,
    });
  } catch (error: any) {
    console.error('Error en API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar la solicitud',
      },
      { status: 500 }
    );
  }
}