import type { RequestBody, HttpRequestParams, HttpResponse, HttpError } from "./core-http.d";

/**
 * ============================================
 * 1. Utilidades Internas
 * ============================================
 */

/**
 * Construye una URL completa combinando la URL base y el endpoint,
 * además de añadir los parámetros de consulta.
 * @param url El endpoint o URL completa.
 * @param baseUrl La URL base opcional.
 * @param queryParams Parámetros de consulta opcionales.
 * @returns La URL completa con los parámetros de consulta.
 */
function buildFullUrl(
  url: string,
  baseUrl?: string,
  queryParams?: Record<string, string | number | boolean | undefined | null>
): string {
  let fullUrl = baseUrl ? `${baseUrl}${url}` : url;

  if (queryParams) {
    const params = new URLSearchParams();
    for (const key in queryParams) {
      const value = queryParams[key];
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      fullUrl = `${fullUrl}${fullUrl.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  return fullUrl;
}

/**
 * Procesa el cuerpo de la solicitud (body) de acuerdo a su tipo
 * y al encabezado Content-Type.
 * @param body El cuerpo de la solicitud.
 * @param headers Los encabezados actuales de la solicitud.
 * @returns El cuerpo de la solicitud procesado para `fetch` y los encabezados actualizados.
 */
function processRequestBody(
  body: RequestBody | undefined,
  headers: Headers
): { processedBody?: BodyInit | null; updatedHeaders: Headers } {
  if (body === undefined || body === null) {
    return { processedBody: null, updatedHeaders: headers };
  }

  // Si el cuerpo es un objeto simple y no es FormData, ni Blob, ni ArrayBuffer, etc.
  // asumimos que es JSON y lo stringificamos, añadiendo el Content-Type.
  if (
    typeof body === "object" &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !(body instanceof URLSearchParams)
  ) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return { processedBody: JSON.stringify(body), updatedHeaders: headers };
  }

  return { processedBody: body as BodyInit, updatedHeaders: headers };
}

/**
 * Parsea la respuesta de la red.
 * @param response La respuesta original de la Fetch API.
 * @param isJson Un indicador si la respuesta debe ser parseada como JSON.
 * @returns Los datos parseados.
 */
async function parseResponseData<T>(response: Response, isJson: boolean): Promise<T | null> {
  const contentType = response.headers.get("Content-Type");

  // Si se fuerza JSON o el Content-Type indica JSON
  if (isJson || (contentType && contentType.includes("application/json"))) {
    try {
      // Intentar parsear como JSON, incluso si la respuesta está vacía (ej. 204 No Content)
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (e) {
      // Si falla el parseo JSON, puede ser que la respuesta no sea JSON válido
      // o esté vacía, pero la esperamos como JSON.
      // Aquí podrías decidir si relanzar el error o retornar null/undefined.
      console.warn("Advertencia: La respuesta no es un JSON válido o está vacía, pero se esperaba JSON.", e);
      return null;
    }
  }

  // Para otros tipos de respuesta (texto, blob, arrayBuffer), se puede extender
  // Por ahora, solo devolver un Promise.resolve(null) si no es JSON.
  return Promise.resolve(null);
}

/**
 * ============================================
 * 2. Implementación de HttpError
 * ============================================
 */

export class HttpErrorImpl extends Error implements HttpError {
  statusCode?: number;
  response?: Response;
  isAborted?: boolean;
  isTimeout?: boolean;
  isNetworkError?: boolean;

  constructor(message: string, options?: Omit<HttpError, "name" | "message">) {
    super(message);
    this.name = "HttpError"; // Asegura que el nombre del error sea consistente
    Object.assign(this, options); // Copia las propiedades adicionales

    // Captura el stack trace en navegadores modernos
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpErrorImpl);
    }
  }
}

export function createHttpError(message: string, options?: Omit<HttpError, "name" | "message">): HttpError {
  return new HttpErrorImpl(message, options);
}

/**
 * ============================================
 * 3. Implementación de Funciones HTTP Principales
 * ============================================
 */

/**
 * Controlador de aborto global que puede ser usado para cancelar solicitudes
 * en progreso si se desea una cancelación centralizada.
 * Opcional, pero útil para casos como navegación entre páginas.
 */
export const httpAbortController = new AbortController();

/**
 * Realiza una solicitud HTTP genérica.
 * Esta es la función base que otras funciones (como `httpGet`, `httpPost`) utilizan.
 *
 * @param url El endpoint o URL completa.
 * @param params Los parámetros de la solicitud HTTP.
 * @returns Una Promesa que resuelve a un objeto HttpResponse.
 * @throws HttpError en caso de fallo de red, respuesta no exitosa o timeout.
 */
export async function httpRequest(url: string, params: HttpRequestParams): Promise<HttpResponse> {
  // Prepara los headers
  const headers = new Headers(params.headers);

  // Procesa el cuerpo de la solicitud
  const { processedBody, updatedHeaders } = processRequestBody(params.body, headers);

  // Construye la URL completa con queryParams
  const fullUrl = buildFullUrl(url, params.baseUrl, params.queryParams);

  // Configura el AbortController y el timeout
  let abortSignal = params.signal || httpAbortController.signal;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (params.timeout && !params.signal) {
    // Si hay timeout y no hay señal externa
    const timeoutController = new AbortController();
    abortSignal = timeoutController.signal;
    timeoutId = setTimeout(() => timeoutController.abort(), params.timeout);
  } else if (params.timeout && params.signal) {
    // Si hay timeout y señal externa, combinar
    // Aquí necesitaríamos una forma de combinar señales, o simplemente priorizar una
    // Por simplicidad, si ya hay una señal, no creamos un nuevo timeoutController
    // La implementación real podría usar una librería como 'abort-controller-promise' o 'signal-combine'
    console.warn("Advertencia: Se proporcionó un 'signal' y un 'timeout'.");
  }

  try {
    const fetchOptions: RequestInit = {
      method: params.method,
      headers: updatedHeaders,
      body: processedBody,
      mode: params.mode,
      credentials: params.credentials,
      cache: params.cache,
      redirect: params.redirect,
      referrer: params.referrer,
      referrerPolicy: params.referrerPolicy,
      integrity: params.integrity,
      keepalive: params.keepalive,
      signal: abortSignal, // Asignar la señal al fetch
    };

    const response = await fetch(fullUrl, fetchOptions);

    // Limpia el timeout si la solicitud se completa antes
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Parsear los datos de la respuesta
    const data = await parseResponseData(response, params.isJson || false); // Se asume isJson=false por defecto

    // Crear un objeto HttpResponse
    const httpResponse: HttpResponse = {
      ...response, // Copia todas las propiedades de la respuesta original
      data: data, // Asigna los datos parseados
      success: response.ok, // response.ok es true para status 2xx
    };

    // Lanzar un error si la respuesta no es exitosa (ej. 4xx, 5xx)
    if (!response.ok) {
      throw createHttpError(`Request failed with status ${response.status}`, {
        statusCode: response.status,
        response: response,
      });
    }

    return httpResponse;
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId); // Asegurarse de limpiar el timeout incluso en error
    }

    // Determinar el tipo de error y relanzar una HttpError
    if (error instanceof DOMException && error.name === "AbortError") {
      // Este es un error de aborto o timeout
      throw createHttpError("Request was cancelled or timed out.", {
        isAborted: true,
        isTimeout: abortSignal?.aborted && params.timeout !== undefined, // Si se abortó por timeout
      });
    } else if (error instanceof TypeError && error.message === "Failed to fetch") {
      // Esto suele ser un error de red (DNS, CORS, offline)
      throw createHttpError("Network error. Failed to fetch resource.", {
        isNetworkError: true,
      });
    } else if (error instanceof HttpErrorImpl) {
      // Ya es un HttpError, simplemente relanzarlo
      throw error;
    } else {
      // Otros errores inesperados
      throw createHttpError(`An unexpected error occurred: ${(error as Error).message}`, {
        // Podrías añadir el error original aquí si es útil para el debug
        // originalError: error,
      });
    }
  }
}

/**
 * ============================================
 * 4. Implementación de Funciones HTTP
 * ============================================
 */

/**
 * Realiza una solicitud HTTP GET y espera una respuesta JSON.
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export async function httpGet<T = unknown>(
  url: string,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T> {
  const response = await httpRequest(url, {
    ...params,
    method: "GET",
    isJson: true,
  });
  return response.data as T;
}

/**
 * Realiza una solicitud POST con cuerpo JSON.
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param body El cuerpo de la solicitud que se enviará como JSON.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export async function httpPost<T = unknown>(
  url: string,
  body: RequestBody,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T> {
  const response = await httpRequest(url, {
    ...params,
    method: "POST",
    body: body,
    isJson: true, // Asumimos JSON para POST si no se especifica lo contrario
  });
  return response.data as T;
}

/**
 * Realiza una solicitud PUT con cuerpo JSON.
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param body El cuerpo de la solicitud que se enviará como JSON.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export async function httpPut<T = unknown>(
  url: string,
  body: RequestBody,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T> {
  const response = await httpRequest(url, {
    ...params,
    method: "PUT",
    body: body,
    isJson: true,
  });
  return response.data as T;
}

/**
 * Realiza una solicitud DELETE.
 * @template T El tipo esperado de los datos JSON de la respuesta (usualmente vacío para DELETE).
 * @param url La URL del endpoint.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export async function httpDelete<T = unknown>(
  url: string,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T> {
  const response = await httpRequest(url, {
    ...params,
    method: "DELETE",
    isJson: true,
  });
  return response.data as T;
}

/**
 * Realiza una solicitud PATCH con cuerpo JSON.
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param body El cuerpo de la solicitud que se enviará como JSON.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export async function httpPatch<T = unknown>(
  url: string,
  body: RequestBody,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T> {
  const response = await httpRequest(url, {
    ...params,
    method: "PATCH",
    body: body,
    isJson: true,
  });
  return response.data as T;
}
