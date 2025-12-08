import { NextResponse } from 'next/server';

interface TemaGenerationRequest {
  titulo: string;
  descripcion: string;
  nivelEducativo: string;
}

export async function POST(request: Request) {
  try {
    const { titulo, descripcion, nivelEducativo }: TemaGenerationRequest = await request.json();

    // Validaciones
    if (!titulo || !descripcion || !nivelEducativo) {
      return NextResponse.json(
        { success: false, error: 'Titulo, descripcion y nivel educativo son requeridos' },
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

    // Construir prompt educativo detallado
    const systemPrompt = `Eres un asistente educativo experto en crear contenido didactico para el curso de Ciencia, Tecnologia y Ambiente (CTA) en Peru.
Tu tarea es generar contenido educativo estructurado, claro y apropiado para el nivel de ${nivelEducativo}.

El contenido debe:
- Estar bien organizado con titulos y subtitulos
- Incluir explicaciones claras y ejemplos practicos
- Ser apropiado para el nivel educativo indicado
- Incluir conceptos clave y definiciones importantes
- Tener una estructura pedagogica efectiva`;

    const userPrompt = `Genera contenido educativo completo sobre el siguiente tema:

Titulo: ${titulo}
Nivel Educativo: ${nivelEducativo}
Descripcion/Instrucciones: ${descripcion}

Por favor genera un contenido educativo detallado, bien estructurado y pedagogicamente apropiado.`;

    // Llamar a GPT-4o
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error de GPT-4o: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const contenidoGenerado = data.choices[0].message.content;

    return NextResponse.json({
      success: true,
      id: `tema-${Date.now()}`,
      titulo: titulo,
      contenido: contenidoGenerado,
      nivelEducativo: nivelEducativo,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error en generacion de tema:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al generar el tema',
      },
      { status: 500 }
    );
  }
}
