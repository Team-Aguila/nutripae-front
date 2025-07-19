import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EmployeeCreate, EmployeeUpdate, Employee } from "../../types";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useDocumentTypes } from "../hooks/useDocumentTypes";
import { useGenders } from "../hooks/useGenders";
import { useOperationalRoles } from "../hooks/useOperationalRoles";
import { ScrollArea } from "@/components/ui/scroll-area";

const employeeSchema = z.object({
  document_type_id: z.number({ required_error: "El tipo de documento es requerido" }),
  document_number: z.string().min(1, "El número de documento es requerido"),
  full_name: z.string().min(1, "El nombre completo es requerido"),
  birth_date: z.string().min(1, "La fecha de nacimiento es requerida"),
  hire_date: z.string().min(1, "La fecha de contratación es requerida"),
  gender_id: z.number({ required_error: "El género es requerido" }),
  operational_role_id: z.number({ required_error: "El rol operacional es requerido" }),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  personal_email: z.string().email("Email inválido").optional().or(z.literal("")),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  identity_document_path: z.string().optional(),
});

const employeeUpdateSchema = employeeSchema
  .extend({
    is_active: z.boolean().optional(),
    termination_date: z.string().optional(),
    reason_for_termination: z.string().optional(),
  })
  .partial();

type FormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeCreate | EmployeeUpdate) => void;
  initialData?: Employee;
}

export const EmployeeForm = ({ isOpen, onClose, onSubmit, initialData }: EmployeeFormProps) => {
  const isEditMode = !!initialData;

  const { data: documentTypes } = useDocumentTypes();
  const { data: genders } = useGenders();
  const { data: operationalRoles } = useOperationalRoles();

  // Estados locales para sincronizar los selects
  const [docType, setDocType] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData & { is_active?: boolean; termination_date?: string; reason_for_termination?: string }>({
    resolver: zodResolver(isEditMode ? (employeeUpdateSchema as any) : (employeeSchema as any)),
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDocType(initialData.document_type_id ? String(initialData.document_type_id) : "");
        setGender(initialData.gender_id ? String(initialData.gender_id) : "");
        setRole(initialData.operational_role_id ? String(initialData.operational_role_id) : "");
        reset({
          ...initialData,
          birth_date: initialData.birth_date ? new Date(initialData.birth_date).toISOString().split("T")[0] : undefined,
          hire_date: initialData.hire_date ? new Date(initialData.hire_date).toISOString().split("T")[0] : undefined,
          termination_date: initialData.termination_date
            ? new Date(initialData.termination_date).toISOString().split("T")[0]
            : undefined,
          personal_email: initialData.personal_email || undefined,
          address: initialData.address || undefined,
          phone_number: initialData.phone_number || undefined,
          emergency_contact_name: initialData.emergency_contact_name || undefined,
          emergency_contact_phone: initialData.emergency_contact_phone || undefined,
          emergency_contact_relation: initialData.emergency_contact_relation || undefined,
          identity_document_path: initialData.identity_document_path || undefined,
          reason_for_termination: initialData.reason_for_termination || undefined,
        });
      } else {
        setDocType("");
        setGender("");
        setRole("");
        reset({
          document_number: "",
          full_name: "",
          birth_date: "",
          hire_date: "",
          address: "",
          phone_number: "",
          personal_email: "",
          emergency_contact_name: "",
          emergency_contact_phone: "",
          emergency_contact_relation: "",
          identity_document_path: "",
        });
      }
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: any) => {
    const dataToSubmit = {
      ...data,
      birth_date: new Date(data.birth_date).toISOString(),
      hire_date: new Date(data.hire_date).toISOString(),
      termination_date: data.termination_date ? new Date(data.termination_date).toISOString() : undefined,
      // Remove empty strings
      personal_email: data.personal_email || undefined,
      address: data.address || undefined,
      phone_number: data.phone_number || undefined,
      emergency_contact_name: data.emergency_contact_name || undefined,
      emergency_contact_phone: data.emergency_contact_phone || undefined,
      emergency_contact_relation: data.emergency_contact_relation || undefined,
      identity_document_path: data.identity_document_path || undefined,
      reason_for_termination: data.reason_for_termination || undefined,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]" id="employee-form-dialog">
        <DialogHeader>
          <DialogTitle id="employee-form-title">{isEditMode ? "Editar Empleado" : "Agregar Empleado"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Edita la información del empleado." : "Llena la información para crear un nuevo empleado."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ScrollArea className="h-[60vh] pr-6">
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Información Básica</h4>
                {/* Tipo de Documento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-document-type-select" className="text-right">
                    Tipo de Documento
                  </Label>
                  {/* Select de ShadCN */}
                  <Controller
                    name="document_type_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value, 10));
                          setDocType(value);
                        }}
                        value={docType}
                      >
                        <SelectTrigger
                          id="employee-document-type-select"
                          data-testid="employee-document-type-select"
                          className="col-span-3"
                        >
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        <SelectContent id="employee-document-type-options">
                          {documentTypes
                            ?.filter((i) => i.id != null)
                            .map((i) => (
                              <SelectItem key={i.id} value={String(i.id!)} id={`employee-document-type-option-${i.id}`}>
                                {i.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {/* Select nativo oculto para Selenium */}
                  <select
                    id="employee-document-type-select"
                    data-testid="employee-document-type-select"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="">Seleccione un tipo</option>
                    {documentTypes
                      ?.filter((i) => i.id != null)
                      .map((i) => (
                        <option key={i.id} value={i.id!} id={`employee-document-type-option-${i.id}`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  {errors.document_type_id && (
                    <p className="col-span-4 text-red-500 text-xs">{(errors as any)["document_type_id"].message}</p>
                  )}
                </div>
                {/* Nº Documento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-document-number" className="text-right">
                    Nº Documento
                  </Label>
                  <Input
                    id="employee-document-number"
                    data-testid="employee-document-number"
                    {...register("document_number")}
                    className="col-span-3"
                    disabled={isEditMode}
                  />
                  {errors.document_number && (
                    <p className="col-span-4 text-red-500 text-xs">{errors.document_number.message}</p>
                  )}
                </div>
                {/* Nombre Completo */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-full-name" className="text-right">
                    Nombre Completo
                  </Label>
                  <Input
                    id="employee-full-name"
                    data-testid="employee-full-name"
                    {...register("full_name")}
                    className="col-span-3"
                  />
                  {errors.full_name && <p className="col-span-4 text-red-500 text-xs">{errors.full_name.message}</p>}
                </div>
                {/* Fecha Nacimiento */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-birth-date" className="text-right">
                    Fecha Nacimiento
                  </Label>
                  <Input
                    id="employee-birth-date"
                    type="date"
                    {...register("birth_date", {
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        return selectedDate <= today || "La fecha no puede ser futura";
                      },
                    })}
                    className="col-span-3"
                  />
                  {errors.birth_date && <p className="col-span-4 text-red-500 text-xs">{errors.birth_date.message}</p>}
                </div>
                {/* Género */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-gender-select" className="text-right">
                    Género
                  </Label>
                  <Controller
                    name="gender_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value, 10));
                          setGender(value);
                        }}
                        value={gender}
                      >
                        <SelectTrigger
                          id="employee-gender-select"
                          data-testid="employee-gender-select"
                          className="col-span-3"
                        >
                          <SelectValue placeholder="Seleccione un género" />
                        </SelectTrigger>
                        <SelectContent id="employee-gender-options">
                          {genders
                            ?.filter((i) => i.id != null)
                            .map((i) => (
                              <SelectItem key={i.id} value={String(i.id!)} id={`employee-gender-option-${i.id}`}>
                                {i.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <select
                    id="employee-gender-select"
                    data-testid="employee-gender-select"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Seleccione un género</option>
                    {genders
                      ?.filter((i) => i.id != null)
                      .map((i) => (
                        <option key={i.id} value={i.id!} id={`employee-gender-option-${i.id}`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  {errors.gender_id && (
                    <p className="col-span-4 text-red-500 text-xs">{(errors as any)["gender_id"].message}</p>
                  )}
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Información Laboral</h4>
                {/* Fecha Contratación */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-hire-date" className="text-right">
                    Fecha Contratación
                  </Label>
                  <Input
                    id="employee-hire-date"
                    type="date"
                    {...register("hire_date", {
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        return selectedDate <= today || "La fecha no puede ser futura";
                      },
                    })}
                    className="col-span-3"
                  />
                  {errors.hire_date && <p className="col-span-4 text-red-500 text-xs">{errors.hire_date.message}</p>}
                </div>
                {/* Rol Operacional */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-operational-role-select" className="text-right">
                    Rol Operacional
                  </Label>
                  <Controller
                    name="operational_role_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value, 10));
                          setRole(value);
                        }}
                        value={role}
                      >
                        <SelectTrigger
                          id="employee-operational-role-select"
                          data-testid="employee-operational-role-select"
                          className="col-span-3"
                        >
                          <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                        <SelectContent id="employee-operational-role-options">
                          {operationalRoles
                            ?.filter((i) => i.id != null)
                            .map((i) => (
                              <SelectItem
                                key={i.id}
                                value={String(i.id!)}
                                id={`employee-operational-role-option-${i.id}`}
                              >
                                {i.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <select
                    id="employee-operational-role-select"
                    data-testid="employee-operational-role-select"
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Seleccione un rol</option>
                    {operationalRoles
                      ?.filter((i) => i.id != null)
                      .map((i) => (
                        <option key={i.id} value={i.id!} id={`employee-operational-role-option-${i.id}`}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                  {errors.operational_role_id && (
                    <p className="col-span-4 text-red-500 text-xs">{(errors as any)["operational_role_id"].message}</p>
                  )}
                </div>
                {/* Empleado Activo, Fecha y Razón Terminación (solo edición) */}
                {isEditMode && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="employee-is-active" className="text-right">
                        Empleado Activo
                      </Label>
                      <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="employee-is-active"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="col-span-3"
                          />
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="employee-termination-date" className="text-right">
                        Fecha Terminación
                      </Label>
                      <Input
                        id="employee-termination-date"
                        type="date"
                        {...register("termination_date")}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="employee-reason-for-termination" className="text-right">
                        Razón Terminación
                      </Label>
                      <Textarea
                        id="employee-reason-for-termination"
                        {...register("reason_for_termination")}
                        className="col-span-3"
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Información de Contacto</h4>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-address" className="text-right">
                    Dirección
                  </Label>
                  <Input
                    id="employee-address"
                    data-testid="employee-address"
                    {...register("address")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-phone-number" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="employee-phone-number"
                    data-testid="employee-phone-number"
                    {...register("phone_number")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-personal-email" className="text-right">
                    Email Personal
                  </Label>
                  <Input
                    id="employee-personal-email"
                    data-testid="employee-personal-email"
                    type="email"
                    {...register("personal_email")}
                    className="col-span-3"
                  />
                  {errors.personal_email && (
                    <p className="col-span-4 text-red-500 text-xs">{errors.personal_email.message}</p>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Contacto de Emergencia</h4>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-emergency-contact-name" className="text-right">
                    Nombre Contacto
                  </Label>
                  <Input
                    id="employee-emergency-contact-name"
                    data-testid="employee-emergency-contact-name"
                    {...register("emergency_contact_name")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-emergency-contact-phone" className="text-right">
                    Teléfono Contacto
                  </Label>
                  <Input
                    id="employee-emergency-contact-phone"
                    data-testid="employee-emergency-contact-phone"
                    {...register("emergency_contact_phone")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-emergency-contact-relation" className="text-right">
                    Relación
                  </Label>
                  <Input
                    id="employee-emergency-contact-relation"
                    data-testid="employee-emergency-contact-relation"
                    {...register("emergency_contact_relation")}
                    className="col-span-3"
                  />
                </div>
              </div>

              {/* Document Path */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Documentos</h4>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee-identity-document-path" className="text-right">
                    Ruta Documento
                  </Label>
                  <Input
                    id="employee-identity-document-path"
                    data-testid="employee-identity-document-path"
                    {...register("identity_document_path")}
                    className="col-span-3"
                    placeholder="Ruta del archivo de documento de identidad"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pr-6 pt-4">
            <Button
              id="employee-form-cancel-btn"
              data-testid="close-employee-form-btn"
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button id="employee-form-submit-btn" data-testid="save-employee-btn" type="submit" variant="default">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
