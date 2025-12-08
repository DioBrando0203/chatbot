import { NextResponse } from 'next/server';

interface ImageGenerationRequest {
  tema: string;
  descripcion: string;
}

export async function POST(request: Request) {
  try {
    const { tema, descripcion }: ImageGenerationRequest = await request.json();

    // Validaciones
    if (!tema || !descripcion) {
      return NextResponse.json(
        { success: false, error: 'Tema y descripcion son requeridos' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'OPENAI_API_KEY no configurada en variables de entorno' },
        { status: 500 }
      );
    }

    // Construir prompt combinando tema y descripcion
    const prompt = `Tema: ${tema}. ${descripcion}`;

    // Llamar a DALL-E 3
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard', // 'standard' o 'hd'
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error de DALL-E 3: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt || prompt;

    return NextResponse.json({
      success: true,
      id: `img-${Date.now()}`,
      imageUrl: imageUrl,
      descripcion: descripcion,
      tema: tema,
      revisedPrompt: revisedPrompt,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error en generacion de imagen:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al generar la imagen',
      },
      { status: 500 }
    );
  }
}
