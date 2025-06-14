import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";

export const validateIngredientNameUniqueness = async (name: string, excludeId?: string): Promise<boolean> => {
  const url = new URL(buildMenuUrl(MENU_CONFIG.endpoints.ingredients.validateNameUniqueness));

  url.searchParams.append("name", name);
  if (excludeId) {
    url.searchParams.append("exclude_id", excludeId);
  }

  const response = await fetch(url.toString(), {
    method: "HEAD" as const,
  });

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
