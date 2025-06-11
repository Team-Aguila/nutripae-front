"use client";

import * as React from "react";
import { Home, School } from "lucide-react";

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
          url: "/coverage/sites",
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
