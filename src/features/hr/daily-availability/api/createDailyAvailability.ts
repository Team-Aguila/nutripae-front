import { httpPost } from "@/lib/http-client";

import type { DailyAvailability } from "../../types";

export interface CreateDailyAvailabilityData {
  date: string;
  status_id: number;
  notes?: string;
  employee_id: number;
}

export const createDailyAvailability = async (
  availability: CreateDailyAvailabilityData
): Promise<DailyAvailability> => {
  const base_hr_url = import.meta.env.VITE_PUBLIC_BASE_HR_URL;

  try {
    return await httpPost(`${base_hr_url}/daily-availabilities`, availability);
  } catch (error: any) {
    // Manejar específicamente el error 409 (Conflict)
    if (error.message && error.message.includes("409")) {
      throw new Error(
        "Ya existe una disponibilidad registrada para este empleado en la fecha seleccionada. Por favor, selecciona otra fecha o edita la disponibilidad existente."
      );
    }
    // Re-lanzar otros errores
    throw error;
  }
};
