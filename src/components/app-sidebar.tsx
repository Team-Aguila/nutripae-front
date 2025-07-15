"use client";

import * as React from "react";
import { Apple, Home, School, Users, ShoppingCart } from "lucide-react";

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
      id: "nav-home",
    },
    {
      title: "Cobertura",
      url: "/coverage",
      icon: School,
      id: "nav-coverage-section",
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
      id: "nav-menus-section",
      items: [
        {
          title: "Ingredientes",
          url: "/menu/ingredients/",
          id: "nav-ingredients",
        },
        {
          title: "Platos",
          url: "/menu/dishes/",
          id: "nav-dishes",
        },
        {
          title: "Ciclos de Menú",
          url: "/menu/cycles/",
          id: "nav-menu-cycles",
        },
        {
          title: "Horarios de Menú",
          url: "/menu/schedules/",
          id: "nav-menu-schedules",
        },
      ],
    },
    {
      title: "Compras",
      url: "/purchases",
      icon: ShoppingCart,
      id: "nav-purchases-section",
      items: [
        {
          title: "Órdenes de Compra",
          url: "/purchases/orders/",
        },
        {
          title: "Recepciones de Ingredientes",
          url: "/purchases/ingredient-receipts/",
        },
        {
          title: "Inventario",
          url: "/purchases/inventory/",
        },
        {
          title: "Movimientos de Inventario",
          url: "/purchases/inventory-movements/",
        },
        {
          title: "Productos",
          url: "/purchases/products/",
        },
        {
          title: "Proveedores",
          url: "/purchases/providers/",
        },
        {
          title: "Cálculo de Compras",
          url: "/purchases/purchase-calculation/",
        },
      ],
    },
    {
      title: "Recursos Humanos",
      url: "/hr",
      icon: Users,
      id: "nav-hr-section",
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
 * - Compras: Gestión de órdenes de compra, inventario y proveedores
 * - Recursos Humanos: Gestión de empleados y disponibilidad diaria
 *
 * @param props - Props del componente Sidebar
 * @returns Componente del sidebar con navegación completa
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} id="main-sidebar">
      <SidebarContent id="sidebar-content">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter id="sidebar-footer">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
