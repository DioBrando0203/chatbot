import { NextResponse } from 'next/server';
import { DEFAULT_MODEL_ID, getModelById } from '@/lib/models';
import type { ContextMaterial } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_CONTEXT_PER_FILE = 8000;
const MAX_TOTAL_CONTEXT = 24000;

const ensureTxtExtension = (name: string) =>
  name.toLowerCase().endsWith('.txt') ? name : `${name}.txt`;

const normalizeContext = (context?: ContextMaterial[]): ContextMaterial[] => {
  if (!Array.isArray(context)) return [];

  let total = 0;
  const sanitized: ContextMaterial[] = [];

  for (const item of context) {
    if (!item?.name || !item?.content) continue;
    const safeName = ensureTxtExtension(String(item.name));
    const trimmedContent = String(item.content).slice(0, MAX_CONTEXT_PER_FILE);

    if (total + trimmedContent.length > MAX_TOTAL_CONTEXT) break;

    sanitized.push({ name: safeName, content: trimmedContent });
    total += trimmedContent.length;
  }

  return sanitized;
};

const buildContextMessage = (context?: ContextMaterial[]): string => {
  const sanitized = normalizeContext(context);
  if (!sanitized.length) return '';

  const details = sanitized
    .map((item) => `Archivo: ${item.name}\n${item.content}`)
    .join('\n\n');

  return `Contexto proveniente del bucket (texto plano). Si alguna parte no es relevante, indícalo claramente antes de responder.\n${details}`;
};

// Manejo generico para APIs compatibles con el formato de OpenAI
async function handleOpenAICompatible(
  endpoint: string,
  apiKey: string,
  modelId: string,
  message: string,
  history: Message[],
  contextMessage?: string
) {
  const messages = [
    ...(contextMessage ? [{ role: 'system', content: contextMessage }] : []),
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      messages,
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

// Handler especifico para Hugging Face
async function handleHuggingFace(
  modelId: string,
  message: string,
  history: Message[],
  contextMessage?: string
) {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY no configurada');
  }

  const conversationHistory = history
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const promptSections = [
    contextMessage ? `Contexto:\n${contextMessage}` : '',
    conversationHistory,
    `User: ${message}\nAssistant:`,
  ].filter(Boolean);

  const fullPrompt = promptSections.join('\n\n');

  const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
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

  const cleanedText = generatedText.replace(fullPrompt, '').trim();
  return cleanedText || generatedText;
}

export async function POST(request: Request) {
  try {
    const {
      message,
      history = [],
      modelId = DEFAULT_MODEL_ID,
      context = [],
    } = await request.json();

    const modelConfig = getModelById(modelId);

    if (!modelConfig) {
      return NextResponse.json(
        { success: false, error: 'Modelo no encontrado' },
        { status: 400 }
      );
    }

    const contextMessage = buildContextMessage(context);

    const normalizedHistory: Message[] = Array.isArray(history)
      ? history
          .filter((msg: any) => msg?.role && msg?.content)
          .map((msg: any) => ({ role: msg.role, content: msg.content }))
      : [];

    let responseText: string;

    if (modelConfig.provider === 'Hugging Face') {
      responseText = await handleHuggingFace(modelId, message, normalizedHistory, contextMessage);
    } else {
      const apiKey = process.env[modelConfig.apiKeyEnv as keyof NodeJS.ProcessEnv];
      if (!apiKey) {
        return NextResponse.json(
          { success: false, error: `${modelConfig.apiKeyEnv} no configurada en variables de entorno` },
          { status: 500 }
        );
      }

      const endpoint = modelConfig.endpoint || 'https://api.openai.com/v1/chat/completions';

      responseText = await handleOpenAICompatible(
        endpoint,
        apiKey,
        modelId,
        message,
        normalizedHistory,
        contextMessage
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
