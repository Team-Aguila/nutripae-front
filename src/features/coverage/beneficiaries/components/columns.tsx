"use client";

import type { BeneficiaryReadWithDetails, DocumentType, Gender, Grade } from "@team-aguila/pae-cobertura-client";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GetColumnsProps {
  handleEdit: (beneficiary: BeneficiaryReadWithDetails) => void;
  handleDelete: (id: string) => void;
  handleDetails: (id: string) => void;
  documentTypes: DocumentType[];
  genders: Gender[];
  grades: Grade[];
}

export const getColumns = ({
  handleEdit,
  handleDelete,
  handleDetails,
  documentTypes,
  genders,
  grades,
}: GetColumnsProps): Array<ColumnDef<BeneficiaryReadWithDetails>> => {
  const documentTypeMap = new Map(documentTypes.map((dt) => [dt.id, dt.name]));
  const genderMap = new Map(genders.map((g) => [g.id, g.name]));
  const gradeMap = new Map(grades.map((g) => [g.id, g.name]));

  return [
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre Completo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const beneficiary = row.original;
        const fullName =
          `${beneficiary.first_name} ${beneficiary.second_name || ""} ${beneficiary.first_surname} ${beneficiary.second_surname || ""}`.trim();
        return <div className="font-medium">{fullName}</div>;
      },
      filterFn: (row, _id, value: string) => {
        const beneficiary = row.original;
        const fullName =
          `${beneficiary.first_name} ${beneficiary.second_name || ""} ${beneficiary.first_surname} ${beneficiary.second_surname || ""}`
            .trim()
            .toLowerCase();
        return fullName.includes(value.toLowerCase());
      },
    },
    {
      accessorKey: "number_document",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Documento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "document_type",
      header: "Tipo de Documento",
      cell: ({ row }) => {
        const docTypeId = row.original.document_type_id;
        return docTypeId ? documentTypeMap.get(docTypeId) || "N/A" : "N/A";
      },
      filterFn: (row, _id, value) => {
        const docTypeId = row.original.document_type_id;
        if (!docTypeId) return false;
        const docTypeName = documentTypeMap.get(docTypeId);
        if (!docTypeName) return false;
        return docTypeName.toLowerCase().includes(String(value).toLowerCase());
      },
      enableSorting: false,
    },
    {
      accessorKey: "gender",
      header: "Género",
      cell: ({ row }) => {
        const genderId = row.original.gender_id;
        return genderId ? genderMap.get(genderId) || "N/A" : "N/A";
      },
      filterFn: (row, _id, value) => {
        const genderId = row.original.gender_id;
        if (!genderId) return false;
        const genderName = genderMap.get(genderId);
        if (!genderName) return false;
        return genderName.toLowerCase().includes(String(value).toLowerCase());
      },
      enableSorting: false,
    },
    {
      accessorKey: "grade",
      header: "Grado",
      cell: ({ row }) => {
        const gradeId = row.original.grade_id;
        return gradeId ? gradeMap.get(gradeId) || "N/A" : "N/A";
      },
      filterFn: (row, _id, value) => {
        const gradeId = row.original.grade_id;
        if (!gradeId) return false;
        const gradeName = gradeMap.get(gradeId);
        if (!gradeName) return false;
        return gradeName.toLowerCase().includes(String(value).toLowerCase());
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const beneficiary = row.original;

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
              <DropdownMenuItem onClick={() => handleDetails(beneficiary.id)}>Ver detalles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(beneficiary)}>Editar</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(beneficiary.id)}>
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableHiding: false,
      enableColumnFilter: false,
    },
  ];
};
