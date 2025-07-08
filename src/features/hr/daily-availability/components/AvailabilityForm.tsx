import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface AvailabilityFormProps {
  onSuccess: () => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    date: "",
    shift: "",
  });

  const createAvailabilityMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/availabilities/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error creating availability");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Disponibilidad creada exitosamente");
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating availability:", error);
      toast.error("Error al crear la disponibilidad");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAvailabilityMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="employee_id" className="block text-sm font-medium">
          ID del Empleado
        </label>
        <input
          type="text"
          id="employee_id"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label htmlFor="shift" className="block text-sm font-medium">
          Turno
        </label>
        <select
          id="shift"
          name="shift"
          value={formData.shift}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="">Seleccionar turno</option>
          <option value="morning">Mañana</option>
          <option value="afternoon">Tarde</option>
          <option value="night">Noche</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Crear Disponibilidad
      </button>
    </form>
  );
};

export default AvailabilityForm;
