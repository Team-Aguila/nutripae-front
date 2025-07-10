// Tipos base para órdenes de compra
export interface PurchaseOrderItem {
  product_id: string;
  quantity: number;
  price: number | string;
}

export interface PurchaseOrderCreate {
  provider_id: string;
  items: PurchaseOrderItem[];
  required_delivery_date?: string;
  purchase_order_date?: string;
}

export interface LineItem {
  product_id: string;
  quantity: number;
  price: string;
}

export interface PurchaseOrderResponse {
  _id: string;
  purchase_order_date: string;
  status: OrderStatus;
  provider_id: string;
  line_items: LineItem[];
  order_number?: string;
  subtotal?: string;
  taxes?: string;
  total?: string;
  required_delivery_date?: string;
  shipped_at?: string;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface PurchaseOrderSummary {
  _id: string;
  order_number?: string;
  provider_id: string;
  purchase_order_date: string;
  required_delivery_date?: string;
  total?: string;
  status: OrderStatus;
  created_at: string;
}

export interface PaginatedPurchaseOrderResponse {
  items: PurchaseOrderSummary[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface CancelOrderResponse {
  _id: string;
  order_number?: string;
  status: OrderStatus;
  cancelled_at: string;
  cancelled_by: string;
  cancellation_reason: string;
  message: string;
}

export interface MarkShippedResponse {
  _id: string;
  order_number?: string;
  status: OrderStatus;
  shipped_at: string;
  message: string;
}

// Tipos para recepciones de ingredientes
export interface ReceivedItem {
  product_id: string;
  quantity: number;
  unit?: string;
  storage_location?: string;
  lot: string;
  expiration_date: string;
}

export interface IngredientReceiptCreate {
  institution_id: number;
  purchase_order_id?: string;
  receipt_date: string;
  delivery_person_name: string;
  items: ReceivedItem[];
}

export interface IngredientReceiptResponse {
  _id: string;
  institution_id: number;
  purchase_order_id?: string;
  receipt_date: string;
  delivery_person_name: string;
  items: ReceivedItem[];
  created_at: string;
  created_by: string;
}

// Tipos para inventario
export interface InventoryItemResponse {
  _id: string;
  product_id: string;
  product_name: string;
  institution_id: number;
  institution_name: string;
  provider_name: string;
  category: string;
  quantity: number;
  base_unit: string;
  storage_location?: string;
  lot: string;
  batch_number: string;
  last_entry_date: string;
  expiration_date: string;
  minimum_threshold: number;
  is_below_threshold: boolean;
  initial_weight: number;
  created_at: string;
}

export interface InventoryConsultationResponse {
  items: InventoryItemResponse[];
  total_count: number;
  page_info: Record<string, unknown>;
  summary: Record<string, unknown>;
}

// Tipos para movimientos de inventario
export interface InventoryReceiptRequest {
  product_id: string;
  institution_id: number;
  storage_location: string;
  quantity_received: number;
  unit_of_measure?: string;
  expiration_date: string;
  batch_number: string;
  purchase_order_id?: string;
  received_by: string;
  reception_date?: string;
  notes?: string;
}

export interface InventoryReceiptResponse {
  transaction_id: string;
  inventory_id: string;
  product_id: string;
  institution_id: number;
  storage_location: string;
  quantity_received: number;
  unit_of_measure: string;
  expiration_date: string;
  batch_number: string;
  purchase_order_id?: string;
  received_by: string;
  reception_date: string;
  movement_id: string;
  notes?: string;
  created_at: string;
}

export interface InventoryMovementResponse {
  _id: string;
  movement_type: MovementType;
  product_id: string;
  institution_id: number;
  storage_location?: string;
  quantity: number;
  unit: string;
  lot?: string;
  expiration_date?: string;
  reference_id?: string;
  reference_type?: string;
  movement_date: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface InventoryConsumptionRequest {
  product_id: string;
  institution_id: number;
  storage_location?: string;
  quantity: number;
  unit?: string;
  consumption_date?: string;
  reason: string;
  notes?: string;
  consumed_by: string;
}

export interface BatchConsumptionDetail {
  inventory_id: string;
  lot: string;
  consumed_quantity: number;
  remaining_quantity: number;
  expiration_date?: string;
  date_of_admission: string;
}

export interface InventoryConsumptionResponse {
  transaction_id: string;
  product_id: string;
  institution_id: number;
  storage_location?: string;
  total_quantity_consumed: number;
  unit: string;
  consumption_date: string;
  reason: string;
  notes?: string;
  consumed_by: string;
  batch_details: BatchConsumptionDetail[];
  movement_ids: string[];
  created_at: string;
}

export interface ManualInventoryAdjustmentRequest {
  product_id: string;
  inventory_id: string;
  quantity: number;
  unit?: string;
  reason: string;
  notes?: string;
  adjusted_by?: string;
}

export interface ManualInventoryAdjustmentResponse {
  transaction_id: string;
  inventory_id: string;
  product_id: string;
  institution_id: number;
  storage_location?: string;
  adjustment_quantity: number;
  unit: string;
  reason: string;
  notes?: string;
  adjusted_by: string;
  previous_stock: number;
  new_stock: number;
  movement_id: string;
  adjustment_date: string;
  created_at: string;
}

export interface BatchDetail {
  inventory_id: string;
  lot: string;
  remaining_weight: number;
  date_of_admission: string;
  expiration_date?: string;
}

export interface StockSummaryResponse {
  product_id: string;
  institution_id: number;
  storage_location?: string;
  total_available_stock: number;
  number_of_batches: number;
  oldest_batch_date?: string;
  newest_batch_date?: string;
  batches: BatchDetail[];
  unit?: string;
}

// Tipos para productos
export interface WeeklyAvailability {
  [key: string]: boolean;
}

export interface LifeTime {
  value: number;
  unit: string;
}

export interface ProductCreate {
  provider_id: string;
  name: string;
  weight: number;
  weekly_availability: WeeklyAvailability;
  life_time: LifeTime;
  shrinkage_factor?: number;
}

export interface ProductUpdate {
  name?: string;
  weight?: number;
  weekly_availability?: WeeklyAvailability;
  life_time?: LifeTime;
  shrinkage_factor?: number;
}

export interface ProductResponse {
  _id: string;
  provider_id: string;
  name: string;
  weight: number;
  weekly_availability: WeeklyAvailability;
  life_time: LifeTime;
  shrinkage_factor: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ProductListResponse {
  products: ProductResponse[];
  total_count: number;
  page_info: Record<string, any>;
}

export interface ShrinkageFactorUpdate {
  shrinkage_factor: number;
}

// Tipos para proveedores
export interface ProviderCreate {
  name: string;
  nit: string;
  address: string;
  responsible_name: string;
  email: string;
  phone_number: string;
  is_local_provider?: boolean;
}

export interface ProviderUpdate {
  name?: string;
  address?: string;
  responsible_name?: string;
  email?: string;
  phone_number?: string;
  is_local_provider?: boolean;
}

export interface ProviderResponse {
  _id: string;
  name: string;
  nit: string;
  address: string;
  responsible_name: string;
  email: string;
  phone_number: string;
  is_local_provider: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ProviderListResponse {
  providers: ProviderResponse[];
  total_count: number;
  page_info: Record<string, any>;
}

// Tipos para cálculo de compras
export interface Coverage {
  type: string;
  ids: (number | string)[];
}

export interface PurchaseCalculationRequest {
  start_date: string;
  end_date: string;
  coverage: Coverage;
}

export interface PurchaseListItem {
  ingredient_name: string;
  ingredient_id: string;
  unit: string;
  total_gross_quantity: number;
  current_inventory?: number;
  safety_stock?: number;
  net_quantity_to_purchase: number;
}

export interface CalculationPeriod {
  start_date: string;
  end_date: string;
}

export interface PurchaseCalculationResponse {
  calculation_period: CalculationPeriod;
  purchase_list: PurchaseListItem[];
  total_ingredients: number;
  calculation_summary?: Record<string, any>;
}

// Enums
export enum OrderStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum MovementType {
  RECEIPT = "receipt",
  USAGE = "usage",
  ADJUSTMENT = "adjustment",
  EXPIRED = "expired",
  LOSS = "loss",
}

export enum WeeklyAvailabilityDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Tipos para respuestas de error
export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}
