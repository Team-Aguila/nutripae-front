import { httpDelete } from "@/lib/http-client";

export const deleteMenuSchedule = async (id: string): Promise<void> => {
  const base_menu_url = import.meta.env.VITE_PUBLIC_BASE_MENU_URL;
  const url = `${base_menu_url}/schedules/${id}`;
  return httpDelete(url);
};
