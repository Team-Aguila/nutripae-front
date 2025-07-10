import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

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

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Si es 404, retornar estructura vacía en lugar de error
    if (response.status === 404) {
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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ProviderListResponse = await response.json();

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
};

// GET /api/v1/compras/providers/{provider_id} - Get provider by ID
export const getProviderById = async (providerId: string): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.getById, { provider_id: providerId });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ProviderResponse = await response.json();
  return data;
};

// POST /api/v1/compras/providers/ - Create a new provider
export const createProvider = async (providerData: ProviderCreate): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.create);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ProviderResponse = await response.json();
  return data;
};

// PUT /api/v1/compras/providers/{provider_id} - Update provider
export const updateProvider = async (providerId: string, providerData: ProviderUpdate): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.update, { provider_id: providerId });

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: ProviderResponse = await response.json();
  return data;
};

// DELETE /api/v1/compras/providers/{provider_id} - Delete provider (soft delete)
export const deleteProvider = async (providerId: string): Promise<void> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.delete, { provider_id: providerId });

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

// Legacy function for backwards compatibility
export const getProvider = getProviderById;
