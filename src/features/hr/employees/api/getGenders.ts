import type { Gender } from "../../types";
import { httpGet } from "@/lib/http-client";

export const getGenders = async (): Promise<Gender[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<Gender[]>(`${base_hr_url}/options/genders`);
};
