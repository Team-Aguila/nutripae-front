// Cliente HTTP personalizado que incluye el token JWT automáticamente

const AUTH_TOKEN_KEY = "nutripae_auth_token";

// Función para obtener el token del localStorage
function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Wrapper para fetch que incluye el token automáticamente
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const token = getAuthToken();
  
  // Preparar headers por defecto
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Si hay token, agregarlo a los headers
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Combinar headers por defecto con los proporcionados
  const headers = {
    ...defaultHeaders,
    ...(init?.headers || {}),
  };

  // Realizar la petición con los headers modificados
  const response = await fetch(input, {
    ...init,
    headers,
  });

  // Si la respuesta es 401 (Unauthorized), limpiar el token y recargar la página
  if (response.status === 401) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("nutripae_auth_user");
    // Redirigir al login
    window.location.href = "/login";
  }

  return response;
}

// Función helper para peticiones GET
export async function httpGet<T>(url: string): Promise<T> {
  const response = await authenticatedFetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.status}`);
  }
  return response.json();
}

// Función helper para peticiones POST
export async function httpPost<T>(url: string, data?: any): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`POST ${url} failed: ${response.status}`);
  }
  return response.json();
}

// Función helper para peticiones PATCH
export async function httpPatch<T>(url: string, data?: any): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`PATCH ${url} failed: ${response.status}`);
  }
  return response.json();
}

// Función helper para peticiones PUT
export async function httpPut<T>(url: string, data?: any): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!response.ok) {
    throw new Error(`PUT ${url} failed: ${response.status}`);
  }
  return response.json();
}

// Función helper para peticiones DELETE
export async function httpDelete<T>(url: string): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`DELETE ${url} failed: ${response.status}`);
  }
  return response.json();
} 