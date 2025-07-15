// Types for HR module based on the backend schemas

export interface DocumentType {
  id: number;
  name: string;
}

export interface Gender {
  id: number;
  name: string;
}

export interface OperationalRole {
  id: number;
  name: string;
  description?: string | null;
}

export interface OperationalRoleWithCount {
  id: number;
  name: string;
  description?: string | null;
  employee_count: number;
}

export interface AvailabilityStatus {
  id: number;
  name: string;
}

export interface DailyAvailability {
  id: number;
  date: string;
  notes?: string | null;
  employee_id: number;
  status_id: number;
  status: AvailabilityStatus;
  created_at: string;
  updated_at: string;
}

export interface DailyAvailabilityCreate {
  date: string;
  notes?: string | null;
  employee_id: number;
  status_id: number;
}

export interface DailyAvailabilityUpdate {
  date?: string;
  notes?: string | null;
  employee_id?: number;
  status_id?: number;
}

export interface DailyAvailabilityDetails extends DailyAvailability {
  employee: {
    id: number;
    full_name: string;
    document_number: string;
    operational_role: {
      id: number;
      name: string;
    };
  };
}

export interface EmployeeBase {
  document_number: string;
  full_name: string;
  birth_date: string;
  hire_date: string;
  address?: string | null;
  phone_number?: string | null;
  personal_email?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relation?: string | null;
  document_type_id: number;
  gender_id: number;
  operational_role_id: number;
}

export interface EmployeeCreate extends EmployeeBase {
  identity_document_path?: string | null;
}

export interface EmployeeUpdate {
  document_number?: string | null;
  full_name?: string | null;
  birth_date?: string | null;
  hire_date?: string | null;
  address?: string | null;
  phone_number?: string | null;
  personal_email?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relation?: string | null;
  document_type_id?: number | null;
  gender_id?: number | null;
  operational_role_id?: number | null;
  identity_document_path?: string | null;
  is_active?: boolean | null;
  termination_date?: string | null;
  reason_for_termination?: string | null;
}

export interface Employee extends EmployeeBase {
  id: number;
  is_active: boolean;
  identity_document_path?: string | null;
  termination_date?: string | null;
  reason_for_termination?: string | null;
  created_at: string;
  updated_at: string;
  document_type: DocumentType;
  gender: Gender;
  operational_role: OperationalRole;
  availabilities: DailyAvailability[];
}
