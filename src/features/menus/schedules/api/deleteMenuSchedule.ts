import { buildMenuUrl, MENU_CONFIG } from "@/lib/config";

export const deleteMenuSchedule = async (id: string): Promise<void> => {
  const url = buildMenuUrl(MENU_CONFIG.endpoints.schedules.delete, { id });

  const response = await fetch(url, {
    method: "DELETE" as const,
  });

  if (!response.ok) {
    throw new Error("Failed to delete menu schedule");
  }
};
