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

