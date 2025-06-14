"use client";

import * as React from "react";
import { Apple, Home, School } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
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
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
