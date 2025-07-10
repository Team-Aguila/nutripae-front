import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";

// Tipos para proveedores (no disponibles en el cliente actual)
interface ProviderCreate {
  name: string;
  nit: string;
  address: string;
  responsible_name: string;
  email: string;
  phone_number: string;
  is_local_provider?: boolean;
}

interface ProviderResponse {
  _id: string;
  name: string;
  nit: string;
  address: string;
  responsible_name: string;
  email: string;
  phone_number: string;
  is_local_provider: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export const createProvider = async (data: ProviderCreate): Promise<ProviderResponse> => {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.providers.create);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear el proveedor");
  }

  return response.json();
};
