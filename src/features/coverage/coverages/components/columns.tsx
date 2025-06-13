"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type {
  CoverageReadWithDetails,
  BeneficiaryReadWithDetails,
  CampusResponseWithDetails,
  BenefitType,
} from "@team-aguila/pae-cobertura-client";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (
  onEdit: (coverage: CoverageReadWithDetails) => void,
  onDelete: (coverage: CoverageReadWithDetails) => void,
  beneficiaries: BeneficiaryReadWithDetails[] = [],
  campuses: CampusResponseWithDetails[] = [],
  benefitTypes: BenefitType[] = []
): ColumnDef<CoverageReadWithDetails>[] => [
  {
    accessorKey: "beneficiary_id",
    header: "Beneficiario",
    cell: ({ row }) => {
      const beneficiaryId = row.original.beneficiary_id;
      const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId);
      return beneficiary ? `${beneficiary.first_name} ${beneficiary.first_surname}` : "N/A";
    },
  },
  {
    accessorKey: "campus_id",
    header: "Sede",
    cell: ({ row }) => {
      const campusId = row.original.campus_id;
      const campus = campuses.find((c) => c.id === campusId);
      return campus ? campus.name : "N/A";
    },
  },
  {
    accessorKey: "benefit_type_id",
    header: "Tipo de Beneficio",
    cell: ({ row }) => {
      const benefitTypeId = row.original.benefit_type_id;
      const benefitType = benefitTypes.find((bt) => bt.id === benefitTypeId);
      return benefitType ? benefitType.name : "N/A";
    },
  },
  {
    accessorKey: "assignment_date",
    header: "Fecha de Asignación",
    cell: ({ row }) => {
      const date = row.getValue("assignment_date");
      return date ? new Date(date as string).toLocaleDateString() : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const coverage = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(coverage.id)}>Copiar ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(coverage)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(coverage)} className="text-red-600">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
