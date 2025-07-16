const AUTH_TOKEN_KEY = "nutripae_auth_token";

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

async function httpHead(url: string): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { method: "HEAD", headers });
}

export const validateIngredientNameUniqueness = async (name: string, excludeId?: string): Promise<boolean> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = new URL(`${base_menu_url}/ingredients/validate/name-uniqueness`);

  url.searchParams.append("name", name);
  if (excludeId) {
    url.searchParams.append("exclude_id", excludeId);
  }

  const response = await httpHead(url.toString());

  // HEAD request returns:
  // - 200 if name is unique (available)
  // - 409 if name already exists (conflict)
  if (response.status === 200) {
    return true; // Name is unique
  } else if (response.status === 409) {
    return false; // Name already exists
  } else {
    throw new Error("Failed to validate ingredient name uniqueness");
  }
};
