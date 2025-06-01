// core-http.d.ts

/**
 * ============================================
 * 1. Tipos de Parámetros de Solicitud (Request)
 * ============================================
 */

/**
 * Definicion de los metodos HTTP soportados.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

/**
 * Definicion de los tipos de cuerpo de solicitud soportados.
 */
export type RequestBody =
  | BodyInit // FormData, URLSearchParams, Blob, BufferSource, string
  | object // Para JSON. Será stringificado internamente si el Content-Type es 'application/json'
  | null; // Para solicitudes sin cuerpo (e.g., GET, DELETE)

export interface HttpRequestParams extends RequestInit {
  /**
   * La URL base a la que se prependrá la 'url' de la solicitud.
   * Útil para manejar diferentes entornos (desarrollo, producción) o microservicios.
   * Ejemplo: 'https://api.example.com/v1'
   */
  baseUrl?: string;
  /**
   * El método HTTP para la solicitud (GET, POST, PUT, etc.).
   * Se hace obligatorio para asegurar que siempre se defina.
   */
  method: HttpMethod;
  /**
   * El cuerpo de la solicitud. Puede ser un objeto (para JSON), FormData, etc.
   * La utilidad de `core-http` debería manejar la serialización adecuada.
   */
  body?: RequestBody;
  /**
   * Encabezados de la solicitud. Puede ser un objeto simple o una instancia de Headers.
   */
  headers?: HeadersInit;
  /**
   * Parámetros de consulta para agregar a la URL.
   * Se convertirán automáticamente a una cadena de consulta (ej. '?key=value&foo=bar').
   */
  queryParams?: Record<string, string | number | boolean | undefined | null>;
  /**
   * Indica si la respuesta debe ser tratada como JSON automáticamente.
   * Por defecto, la utilidad podría intentar inferir esto del encabezado Content-Type.
   */
  isJson?: boolean;
  /**
   * Un abort controller signal para cancelar la solicitud.
   * Útil para evitar condiciones de carrera o solicitudes redundantes.
   */
  signal?: AbortSignal;
  /**
   * Número de milisegundos antes de que la solicitud se cancele automáticamente.
   * Se creará un AbortController interno si se proporciona.
   */
  timeout?: number;
}

/**
 * ============================================
 * 2. Tipos de Respuesta (Response)
 * ============================================
 */

/**
 * Representa una respuesta HTTP exitosa con datos de tipo T.
 * Hereda de la interfaz estándar `Response` de Fetch API.
 */
export interface HttpResponse<T = unknown> extends Response {
  /**
   * Los datos parseados de la respuesta.
   * El tipo T se infiere o se especifica al llamar a la función.
   */
  data: T;
  /**
   * Un flag para indicar si la respuesta fue exitosa (status 2xx).
   * Equivalente a `response.ok` de Fetch API.
   */
  success: boolean;
}

/**
 * ============================================
 * 3. Tipos de Errores
 * ============================================
 */

/**
 * Define una interfaz para errores personalizados que pueden ocurrir durante las solicitudes HTTP.
 */
export interface HttpError extends Error {
  /**
   * El código de estado HTTP si el error proviene de una respuesta del servidor.
   * Ejemplo: 404, 500.
   */
  statusCode?: number;
  /**
   * El objeto de respuesta HTTP original si está disponible.
   */
  response?: Response;
  /**
   * Un flag que indica si el error fue debido a una cancelación de la solicitud.
   */
  isAborted?: boolean;
  /**
   * Un flag que indica si el error fue debido a un timeout de la solicitud.
   */
  isTimeout?: boolean;
  /**
   * Un flag que indica si el error fue de red (ej. no hay conexión a internet).
   */
  isNetworkError?: boolean;
}

/**
 * ============================================
 * 4. Firmas de las Funciones de Utilidad HTTP
 * ============================================
 */

/**
 * Realiza una solicitud HTTP genérica.
 * Esta es la función base que otras funciones (como `get`, `post`) podrían usar internamente.
 *
 * @param url La URL del endpoint (puede ser relativa si se usa `baseUrl`).
 * @param params Los parámetros de la solicitud HTTP.
 * @returns Una Promesa que resuelve a un objeto HttpResponse.
 * @throws HttpError en caso de fallo de red, respuesta no exitosa o timeout.
 */
export declare function httpRequest(url: string, params: HttpRequestParams): Promise<HttpResponse>;

/**
 * Realiza una solicitud HTTP y espera una respuesta JSON.
 * Es una envoltura de `httpRequest` que automáticamente parsea la respuesta como JSON.
 *
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param params Los parámetros de la solicitud HTTP.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 * @throws HttpError en caso de fallo.
 */
export declare function httpGet<T = unknown>(
  url: string,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T>;

/**
 * Realiza una solicitud POST con cuerpo JSON.
 *
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param body El cuerpo de la solicitud que se enviará como JSON.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export declare function httpPost<T = unknown>(
  url: string,
  body: RequestBody,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T>;

/**
 * Realiza una solicitud PUT con cuerpo JSON.
 *
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param body El cuerpo de la solicitud que se enviará como JSON.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export declare function httpPut<T = unknown>(
  url: string,
  body: RequestBody,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T>;

/**
 * Realiza una solicitud DELETE.
 *
 * @template T El tipo esperado de los datos JSON de la respuesta (usualmente vacío para DELETE).
 * @param url La URL del endpoint.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export declare function httpDelete<T = unknown>(
  url: string,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T>;

/**
 * Realiza una solicitud PATCH con cuerpo JSON.
 *
 * @template T El tipo esperado de los datos JSON de la respuesta.
 * @param url La URL del endpoint.
 * @param body El cuerpo de la solicitud que se enviará como JSON.
 * @param params Parámetros adicionales de la solicitud.
 * @returns Una Promesa que resuelve a los datos parseados de tipo T.
 */
export declare function httpPatch<T = unknown>(
  url: string,
  body: RequestBody,
  params?: Omit<HttpRequestParams, "method" | "body">
): Promise<T>;

/**
 * ============================================
 * 5. Utilidades Adicionales (Opcional, pero útil)
 * ============================================
 */

/**
 * Crea una nueva instancia de `HttpError`.
 * Útil para lanzar errores con tipado consistente.
 * @param message El mensaje del error.
 * @param options Opciones adicionales para el error (statusCode, response, etc.).
 * @returns Una instancia de HttpError.
 */
export declare function createHttpError(message: string, options?: Omit<HttpError, "name" | "message">): HttpError;

/**
 * Exporta una constante que contiene un AbortController para manejar la cancelación
 * de solicitudes a nivel global o para propósitos específicos.
 * Se puede usar para cancelar solicitudes en progreso.
 */
export declare const httpAbortController: AbortController;
