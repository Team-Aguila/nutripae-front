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
export const buildApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint}`;
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

export const MENU_CONFIG = {
  baseUrl: config.apiBaseUrl,
  prefix: "/api/v1",
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
  },
} as const;
