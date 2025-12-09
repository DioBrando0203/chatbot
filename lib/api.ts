export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

export const getApiUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = getApiUrl(endpoint);
  const isFormData = options?.body instanceof FormData;

  const defaultHeaders: HeadersInit = isFormData
    ? { Accept: 'application/json' }
    : {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

  const mergedHeaders: HeadersInit = {
    ...defaultHeaders,
    ...options?.headers,
  };

  if (isFormData && 'Content-Type' in mergedHeaders) {
    delete (mergedHeaders as Record<string, string>)['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    if (contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || `Error HTTP ${response.status}`);
    }

    const text = await response.text();
    throw new Error(text || response.statusText || `Error HTTP ${response.status}`);
  }

  if (contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text();
};
