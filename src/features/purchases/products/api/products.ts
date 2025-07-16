import { buildPurchasesUrl, PURCHASES_CONFIG } from "@/lib/config";
import { httpGet, httpPost, httpPut, httpDelete, httpPatch } from "@/lib/http-client";

export interface Product {
  _id: string;
  provider_id: string;
  name: string;
  weight: number;
  weekly_availability: string;
  life_time: {
    value: number;
    unit: string;
  };
  shrinkage_factor: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ProductListResponse {
  products: Product[];
  total_count: number;
  page_info: {
    offset: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ProductCreate {
  provider_id: string;
  name: string;
  weight: number;
  weekly_availability: string;
  life_time: {
    value: number;
    unit: string;
  };
  shrinkage_factor?: number;
}

export interface ProductUpdate {
  name?: string;
  weight?: number;
  weekly_availability?: string;
  life_time?: {
    value: number;
    unit: string;
  };
  shrinkage_factor?: number;
}

export interface GetProductsParams {
  provider_id?: string;
  limit?: number;
  offset?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.products.list);
  const searchParams = new URLSearchParams();

  if (params.provider_id !== undefined) {
    searchParams.append("provider_id", params.provider_id);
  }
  if (params.limit !== undefined) {
    searchParams.append("limit", params.limit.toString());
  }
  if (params.offset !== undefined) {
    searchParams.append("offset", params.offset.toString());
  }

  const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const data = await httpGet<ProductListResponse>(fullUrl);

    // Validar que la respuesta tenga la estructura esperada
    if (!data || !Array.isArray(data.products)) {
      return {
        products: [],
        total_count: 0,
        page_info: {
          offset: params.offset || 0,
          limit: params.limit || 100,
          has_next: false,
          has_previous: false,
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Si es un error, retornar estructura vacía
    return {
      products: [],
      total_count: 0,
      page_info: {
        offset: params.offset || 0,
        limit: params.limit || 100,
        has_next: false,
        has_previous: false,
      },
    };
  }
}

export async function getProduct(productId: string): Promise<Product> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.products.getById, { product_id: productId });

  try {
    return await httpGet<Product>(url);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createProduct(product: ProductCreate): Promise<Product> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.products.create);

  try {
    return await httpPost<Product>(url, product);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(productId: string, product: ProductUpdate): Promise<Product> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.products.update, { product_id: productId });

  try {
    return await httpPut<Product>(url, product);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.products.delete, { product_id: productId });

  try {
    await httpDelete<void>(url);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function updateProductShrinkageFactor(productId: string, shrinkageFactor: number): Promise<Product> {
  const url = buildPurchasesUrl(PURCHASES_CONFIG.endpoints.products.updateShrinkage, { product_id: productId });

  try {
    return await httpPatch<Product>(url, { shrinkage_factor: shrinkageFactor });
  } catch (error) {
    console.error("Error updating shrinkage factor:", error);
    throw error;
  }
}
