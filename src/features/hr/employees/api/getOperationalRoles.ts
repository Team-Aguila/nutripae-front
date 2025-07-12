import { httpGet } from "@/lib/http-client";
import type { OperationalRole } from "../../types";

export const getOperationalRoles = async (): Promise<OperationalRole[]> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;
  return httpGet<OperationalRole[]>(`${base_hr_url}/options/operational-roles`);
};
