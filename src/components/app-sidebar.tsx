"use client";

import * as React from "react";
import { Apple, Home, School, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";

// Configuración de navegación principal del sidebar
const data = {
  navMain: [
    {
      title: "Inicio",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Cobertura",
      url: "/coverage",
      icon: School,
      items: [
        {
          title: "Departamentos",
          url: "/coverage/departments",
        },
        {
          title: "Municipios",
          url: "/coverage/towns",
        },
        {
          title: "Instituciones Educativas",
          url: "/coverage/institutions",
        },
        {
          title: "Sedes Educativas",
          url: "/coverage/campuses",
        },
        {
          title: "Beneficiarios",
          url: "/coverage/beneficiaries",
        },
        {
          title: "Cobertura",
          url: "/coverage/coverages",
        },
      ],
    },
    {
      title: "Menús",
      url: "/menu",
      icon: Apple,
      items: [
        {
          title: "Ingredientes",
          url: "/menu/ingredients/",
        },
        {
          title: "Platos",
          url: "/menu/dishes/",
        },
        {
          title: "Ciclos de Menú",
          url: "/menu/cycles/",
        },
        {
          title: "Horarios de Menú",
          url: "/menu/schedules/",
        },
      ],
    },
    {
      title: "Recursos Humanos",
      url: "/hr",
      icon: Users,
      items: [
        {
          title: "Empleados",
          url: "/hr/employees/",
        },
        {
          title: "Disponibilidad Diaria",
          url: "/hr/daily-availability/",
        },
      ],
    },
  ],
};

/**
 * Componente del sidebar principal de la aplicación NUTRIPAE
 * 
 * Este componente renderiza la barra lateral de navegación que incluye:
 * - Inicio: Página principal
 * - Cobertura: Gestión de beneficiarios y cobertura educativa
 * - Menús: Gestión de ingredientes, platos y ciclos de menú
 * - Recursos Humanos: Gestión de empleados y disponibilidad diaria
 * 
 * @param props - Props del componente Sidebar
 * @returns Componente del sidebar con navegación completa
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
