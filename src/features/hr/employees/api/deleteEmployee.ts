import { httpDelete } from "@/lib/http-client";

export const deleteEmployee = async (id: number): Promise<void> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpDelete(`${base_hr_url}/employees/${id}`);
};
