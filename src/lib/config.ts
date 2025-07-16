const API_URLS = {
  development: "http://localhost:8000",
} as const;

const getEnvironment = (): keyof typeof API_URLS => {
  //if (import.meta.env.PROD) return "production";
  if (import.meta.env.DEV) return "development";
  return "development";
};

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || API_URLS[getEnvironment()],
  menuApiBaseUrl:
    import.meta.env.VITE_PUBLIC_BASE_MENU_URL || import.meta.env.VITE_API_BASE_URL || API_URLS[getEnvironment()],
  healthApiBaseUrl:
    import.meta.env.VITE_HEALTH_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || API_URLS[getEnvironment()],
  hrApiBaseUrl:
    import.meta.env.VITE_PUBLIC_BASE_HR_URL || import.meta.env.VITE_API_BASE_URL || API_URLS[getEnvironment()],

  // Endpoints específicos
  endpoints: {
    // Cobertura
    departments: "/coverage/departments",
    towns: "/coverage/towns",
    institutions: "/coverage/institutions",
    sites: "/coverage/sites",

    // Menús
    ingredients: "/api/v1/ingredients",
    dishes: "/api/v1/dishes",
    menuCycles: "/api/v1/menu-cycles",

    // Salud
    health: "/health",
    healthDatabase: "/health/database",
  },

  // Configuración HTTP
  http: {
    timeout: 10000, // 10 segundos
    retries: 3,
  },
} as const;

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string, baseUrl: string = config.apiBaseUrl): string => {
  return `${baseUrl}${endpoint}`;
};

// Helper para construir URLs con la nueva configuración de MENU_CONFIG
export const buildMenuUrl = (
  endpointConfig: { endpoint: string; method: string },
  params?: Record<string, string | number>
): string => {
  let url = `${MENU_CONFIG.baseUrl}${MENU_CONFIG.prefix}${endpointConfig.endpoint}`;

  // Reemplazar parámetros en la URL
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
  }

  return url;
};

// Helper para obtener URL completa de un endpoint de menu
export const getMenuUrl = (
  endpointConfig: { endpoint: string; method: string },
  params?: Record<string, string | number>
): string => {
  let url = `${MENU_CONFIG.baseUrl}${MENU_CONFIG.prefix}${endpointConfig.endpoint}`;

  // Reemplazar parámetros en la URL
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
  }

  return url;
};

// Helper para construir URLs de APIs específicas
export const buildMenuApiUrl = (endpoint: string): string => {
  return `${config.menuApiBaseUrl}${endpoint}`;
};

export const buildHealthApiUrl = (endpoint: string): string => {
  return `${config.healthApiBaseUrl}${endpoint}`;
};

export const MENU_CONFIG = {
  baseUrl: config.menuApiBaseUrl,
  prefix: "",
  endpoints: {
    health: {
      endpoint: "/health",
      method: "GET",
    },
    healthDatabase: {
      endpoint: "/health/database",
      method: "GET",
    },
    ingredients: {
      list: {
        endpoint: "/ingredients",
        method: "GET",
      },
      getById: {
        endpoint: "/ingredients/{id}",
        method: "GET",
      },
      create: {
        endpoint: "/ingredients",
        method: "POST",
      },
      update: {
        endpoint: "/ingredients/{id}",
        method: "PUT",
      },
      delete: {
        endpoint: "/ingredients/{id}",
        method: "DELETE",
      },
      activate: {
        endpoint: "/ingredients/{id}/activate",
        method: "PATCH",
      },
      inactivate: {
        endpoint: "/ingredients/{id}/inactivate",
        method: "PATCH",
      },
      categories: {
        endpoint: "/ingredients/categories",
        method: "GET",
      },
      active: {
        endpoint: "/ingredients/active",
        method: "GET",
      },
      detailed: {
        endpoint: "/ingredients/detailed",
        method: "GET",
      },
      statistics: {
        endpoint: "/ingredients/statistics",
        method: "GET",
      },
      validateNameUniqueness: {
        endpoint: "/ingredients/validate/name-uniqueness",
        method: "HEAD",
      },
      getDetailedById: {
        endpoint: "/ingredients/{id}/detailed",
        method: "GET",
      },
    },
    dishes: {
      list: {
        endpoint: "/dishes",
        method: "GET",
      },
      getById: {
        endpoint: "/dishes/{id}",
        method: "GET",
      },
      create: {
        endpoint: "/dishes",
        method: "POST",
      },
      update: {
        endpoint: "/dishes/{id}",
        method: "PUT",
      },
      delete: {
        endpoint: "/dishes/{id}",
        method: "DELETE",
      },
    },
    cycles: {
      list: {
        endpoint: "/menu-cycles",
        method: "GET",
      },
      getById: {
        endpoint: "/menu-cycles/{id}",
        method: "GET",
      },
      create: {
        endpoint: "/menu-cycles",
        method: "POST",
      },
      update: {
        endpoint: "/menu-cycles/{id}",
        method: "PUT",
      },
      delete: {
        endpoint: "/menu-cycles/{id}",
        method: "DELETE",
      },
      deactivate: {
        endpoint: "/menu-cycles/{id}/deactivate",
        method: "PATCH",
      },
    },
    schedules: {
      list: {
        endpoint: "/menu-schedules",
        method: "GET",
      },
      getById: {
        endpoint: "/menu-schedules/{id}",
        method: "GET",
      },
      update: {
        endpoint: "/menu-schedules/{id}",
        method: "PATCH",
      },
      delete: {
        endpoint: "/menu-schedules/{id}",
        method: "DELETE",
      },
      detailed: {
        endpoint: "/menu-schedules/{id}/detailed",
        method: "GET",
      },
      cancel: {
        endpoint: "/menu-schedules/{id}/cancel",
        method: "PATCH",
      },
      uncancel: {
        endpoint: "/menu-schedules/{id}/uncancel",
        method: "PATCH",
      },
      assign: {
        endpoint: "/menu-schedules/assign",
        method: "POST",
      },
      citizenMenu: {
        endpoint: "/menu-schedules/citizen/menu",
        method: "GET",
      },
    },
  },
} as const;

export const HR_CONFIG = {
  baseUrl: config.hrApiBaseUrl,
  prefix: "",
  endpoints: {
    employees: {
      list: { endpoint: "/employees", method: "GET" },
      create: { endpoint: "/employees", method: "POST" },
      update: { endpoint: "/employees/{employee_id}", method: "PUT" },
      delete: { endpoint: "/employees/{employee_id}", method: "DELETE" },
      getById: { endpoint: "/employees/{employee_id}", method: "GET" },
    },
    availabilities: {
      create: { endpoint: "/availabilities", method: "POST" },
      listByDateRange: { endpoint: "/availabilities", method: "GET" },
      listByEmployee: { endpoint: "/availabilities/employee/{employee_id}", method: "GET" },
    },
    options: {
      documentTypes: { endpoint: "/options/document-types", method: "GET" },
      genders: { endpoint: "/options/genders", method: "GET" },
      operationalRoles: { endpoint: "/options/operational-roles", method: "GET" },
      availabilityStatuses: { endpoint: "/options/availability-statuses", method: "GET" },
    },
  },
} as const;

// Configuración para el módulo de compras
export const PURCHASES_CONFIG = {
  baseUrl: import.meta.env.VITE_PUBLIC_BASE_PURCHASE_URL || config.apiBaseUrl,
  prefix: "",
  endpoints: {
    purchaseOrders: {
      list: { endpoint: "/purchase-orders/", method: "GET" },
      create: { endpoint: "/purchase-orders/", method: "POST" },
      getById: { endpoint: "/purchase-orders/{order_id}", method: "GET" },
      markShipped: { endpoint: "/purchase-orders/{order_id}/mark-shipped", method: "PATCH" },
      cancel: { endpoint: "/purchase-orders/{order_id}/cancel", method: "PATCH" },
    },
    ingredientReceipts: {
      create: { endpoint: "/ingredient-receipts/", method: "POST" },
      getById: { endpoint: "/ingredient-receipts/{receipt_id}", method: "GET" },
      getByInstitution: { endpoint: "/ingredient-receipts/institution/{institution_id}", method: "GET" },
    },
    inventory: {
      consult: { endpoint: "/inventory/", method: "GET" },
      updateThreshold: { endpoint: "/inventory/{inventory_id}/threshold", method: "PUT" },
    },
    inventoryMovements: {
      receiveInventory: { endpoint: "/inventory-movements/receive-inventory", method: "POST" },
      getByProduct: { endpoint: "/inventory-movements/product/{product_id}", method: "GET" },
      getCurrentStock: { endpoint: "/inventory-movements/stock/{product_id}/{institution_id}", method: "GET" },
      manualAdjustment: { endpoint: "/inventory-movements/manual-adjustment", method: "POST" },
      consumeInventory: { endpoint: "/inventory-movements/consume-inventory", method: "POST" },
      getStockSummary: { endpoint: "/inventory-movements/stock-summary/{product_id}/{institution_id}", method: "GET" },
      getConsumptionHistory: { endpoint: "/inventory-movements/consumption-history/{product_id}", method: "GET" },
    },
    products: {
      list: { endpoint: "/products/", method: "GET" },
      create: { endpoint: "/products/", method: "POST" },
      getById: { endpoint: "/products/{product_id}", method: "GET" },
      update: { endpoint: "/products/{product_id}", method: "PUT" },
      delete: { endpoint: "/products/{product_id}", method: "DELETE" },
      updateShrinkage: { endpoint: "/products/{product_id}/shrinkage", method: "PATCH" },
    },
    providers: {
      list: { endpoint: "/providers/", method: "GET" },
      create: { endpoint: "/providers/", method: "POST" },
      getById: { endpoint: "/providers/{provider_id}", method: "GET" },
      update: { endpoint: "/providers/{provider_id}", method: "PUT" },
      delete: { endpoint: "/providers/{provider_id}", method: "DELETE" },
    },
    purchaseCalculation: {
      calculate: { endpoint: "/purchase-calculation/calculate", method: "POST" },
      healthCheck: { endpoint: "/purchase-calculation/health", method: "GET" },
      getCoverageInfo: { endpoint: "/purchase-calculation/coverage-info/{coverage_type}", method: "GET" },
    },
  },
} as const;

// Helper para construir URLs de compras
export const buildPurchasesUrl = (
  endpointConfig: { endpoint: string; method: string },
  params?: Record<string, string | number>
): string => {
  let url = `${PURCHASES_CONFIG.baseUrl}${PURCHASES_CONFIG.prefix}${endpointConfig.endpoint}`;

  // Reemplazar parámetros en la URL
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, String(value));
    });
  }

  return url;
};
