import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Inicializar Gemini AI con la clave de API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    // Usar el modelo gratuito gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Convertir el historial al formato de Gemini
    const chatHistory = history?.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })) || [];

    // Crear chat con historial
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // Enviar mensaje y obtener respuesta
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      response: text,
    });
  } catch (error: any) {
    console.error('Error en Gemini API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al procesar la solicitud',
      },
      { status: 500 }
    );
  }
}
