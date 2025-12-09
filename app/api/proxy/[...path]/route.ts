import { NextRequest, NextResponse } from 'next/server';

// URL del backend (HTTP)
const BACKEND_URL = 'http://136.116.238.134/api';

const resolvePath = (request: NextRequest, params?: { path?: string[] }) => {
  const pathSegments = params?.path ?? [];
  const direct = pathSegments.join('/');
  if (direct) return direct;

  // Fallback por si Next no entrega params (caso Turbopack o dobles slash)
  const pathname = request.nextUrl?.pathname || '';
  const trimmed = pathname.replace(/^\/api\/proxy\/?/, '');
  return trimmed;
};

export async function GET(
  request: NextRequest,
  { params }: { params?: { path?: string[] } }
) {
  const path = resolvePath(request, params);
  const search = request.nextUrl.searchParams.toString();

  if (!path) {
    return NextResponse.json(
      { success: false, error: 'Ruta de proxy invalida' },
      { status: 400 }
    );
  }

  const url = `${BACKEND_URL}/${path}${search ? `?${search}` : ''}`.replace(/([^:]\/)\/+/g, '$1');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    console.error('Error en proxy GET:', error);
    return NextResponse.json(
      { success: false, error: 'Error en el proxy al conectar con el backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params?: { path?: string[] } }
) {
  const path = resolvePath(request, params);
  if (!path) {
    return NextResponse.json(
      { success: false, error: 'Ruta de proxy invalida' },
      { status: 400 }
    );
  }
  const url = `${BACKEND_URL}/${path}`.replace(/([^:]\/)\/+/g, '$1');

  try {
    const contentType = request.headers.get('content-type') || '';
    let body: BodyInit | null = null;
    const fetchHeaders: HeadersInit = {};

    if (contentType.includes('multipart/form-data') || request.body instanceof FormData) {
      body = await request.formData();
    } else {
      body = await request.text();
      fetchHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: fetchHeaders,
      body,
    });

    const responseContentType = response.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    console.error('Error en proxy POST:', error);
    return NextResponse.json(
      { success: false, error: 'Error en el proxy al conectar con el backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params?: { path?: string[] } }
) {
  const path = resolvePath(request, params);
  if (!path) {
    return NextResponse.json(
      { success: false, error: 'Ruta de proxy invalida' },
      { status: 400 }
    );
  }
  const url = `${BACKEND_URL}/${path}`.replace(/([^:]\/)\/+/g, '$1');

  try {
    const contentType = request.headers.get('content-type') || '';
    let body: BodyInit | null = null;

    if (contentType.includes('application/json')) {
      body = await request.text();
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const responseContentType = response.headers.get('content-type') || '';
    if (responseContentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    console.error('Error en proxy DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Error en el proxy al conectar con el backend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params?: { path?: string[] } }
) {
  const path = resolvePath(request, params);
  if (!path) {
    return NextResponse.json(
      { success: false, error: 'Ruta de proxy invalida' },
      { status: 400 }
    );
  }
  const url = `${BACKEND_URL}/${path}`.replace(/([^:]\/)\/+/g, '$1');

  try {
    const body = await request.text();

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    const text = await response.text();
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    console.error('Error en proxy PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Error en el proxy al conectar con el backend' },
      { status: 500 }
    );
  }
}
