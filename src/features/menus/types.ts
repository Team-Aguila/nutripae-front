import { IngredientStatus, DishStatus, MealType, MenuCycleStatus } from "@team-aguila/pae-menus-client";

// Tipos para filtros y búsquedas (estos no están en el paquete oficial)
export interface IngredientFilters {
  skip?: number;
  limit?: number;
  status?: IngredientStatus;
  category?: string;
  search?: string;
}

export interface DishFilters {
  name?: string;
  status?: DishStatus;
  meal_type?: MealType;
}

export interface MenuCycleFilters {
  skip?: number;
  limit?: number;
  status?: MenuCycleStatus;
  search?: string;
}

// Tipos para Menu Schedules
export interface MenuScheduleFilters {
  skip?: number;
  limit?: number;
  status?: "active" | "future" | "completed" | "cancelled";
  menu_cycle_id?: string;
  location_id?: string;
  location_type?: "campus" | "town";
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
}
