import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageUrl, filename } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'URL de imagen requerida' },
        { status: 400 }
      );
    }

    // Descargar la imagen desde la URL de DALL-E
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Error al descargar imagen: ${imageResponse.status}`);
    }

    // Obtener el blob de la imagen
    const imageBlob = await imageResponse.blob();

    // Crear headers para la descarga
    const headers = new Headers();
    headers.set('Content-Type', imageBlob.type || 'image/png');
    headers.set('Content-Disposition', `attachment; filename="${filename || 'imagen-generada.png'}"`);

    return new NextResponse(imageBlob, {
      status: 200,
      headers,
    });
  } catch (error) {
    const err = error as Error;
    console.error('Error en descarga de imagen:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Error al descargar la imagen',
      },
      { status: 500 }
    );
  }
}
