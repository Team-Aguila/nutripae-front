import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpGet, httpPost, httpPut, httpDelete } from "@/lib/http-client";

export interface ProvidersFilters {
  is_local_provider?: boolean;
  skip?: number;
  limit?: number;
}

// Types based on OpenAPI spec for providers
export interface ProviderCreate {
  name: string;
  nit: string;
  address: string;
  responsible_name: string;
  email: string;
  phone_number: string;
  is_local_provider?: boolean;
}

export interface ProviderUpdate {
  name?: string;
  address?: string;
  responsible_name?: string;
  email?: string;
  phone_number?: string;
  is_local_provider?: boolean;
}

export interface ProviderResponse {
  _id: string;
  name: string;
  nit: string;
  address: string;
  responsible_name: string;
  email: string;
  phone_number: string;
  is_local_provider: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ProviderListResponse {
  providers: ProviderResponse[];
  total_count: number;
  page_info: Record<string, unknown>;
}

// GET /api/v1/compras/providers/ - Get all providers
export const getProviders = async (filters: ProvidersFilters = {}): Promise<ProviderListResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.list);
  const searchParams = new URLSearchParams();

  if (filters.is_local_provider !== undefined) {
    searchParams.append("is_local_provider", String(filters.is_local_provider));
  }
  if (filters.skip !== undefined) {
    searchParams.append("skip", String(filters.skip));
  }
  if (filters.limit !== undefined) {
    searchParams.append("limit", String(filters.limit));
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const data = await httpGet<ProviderListResponse>(fullUrl);

    // Si la respuesta es válida pero no tiene la estructura esperada, retornar vacío
    if (!data || !Array.isArray(data.providers)) {
      return {
        providers: [],
        total_count: 0,
        page_info: {
          skip: filters.skip || 0,
          limit: filters.limit || 100,
          has_next: false,
          has_previous: false,
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching providers:", error);
    // Si es un error, retornar estructura vacía en lugar de error
    return {
      providers: [],
      total_count: 0,
      page_info: {
        skip: filters.skip || 0,
        limit: filters.limit || 100,
        has_next: false,
        has_previous: false,
      },
    };
  }
};

// GET /api/v1/compras/providers/{provider_id} - Get provider by ID
export const getProviderById = async (providerId: string): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.getById, { provider_id: providerId });

  try {
    return await httpGet<ProviderResponse>(url);
  } catch (error) {
    console.error(`Error fetching provider ${providerId}:`, error);
    throw error;
  }
};

// POST /api/v1/compras/providers/ - Create a new provider
export const createProvider = async (providerData: ProviderCreate): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.create);

  try {
    return await httpPost<ProviderResponse>(url, providerData);
  } catch (error) {
    console.error("Error creating provider:", error);
    throw error;
  }
};

// PUT /api/v1/compras/providers/{provider_id} - Update provider
export const updateProvider = async (providerId: string, providerData: ProviderUpdate): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.update, { provider_id: providerId });

  try {
    return await httpPut<ProviderResponse>(url, providerData);
  } catch (error) {
    console.error(`Error updating provider ${providerId}:`, error);
    throw error;
  }
};

// DELETE /api/v1/compras/providers/{provider_id} - Delete provider (soft delete)
export const deleteProvider = async (providerId: string): Promise<void> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.delete, { provider_id: providerId });

  try {
    await httpDelete<void>(url);
  } catch (error) {
    console.error(`Error deleting provider ${providerId}:`, error);
    throw error;
  }
};

// Legacy function for backwards compatibility
export const getProvider = getProviderById;
