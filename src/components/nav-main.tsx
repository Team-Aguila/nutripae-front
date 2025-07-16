"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    id?: string;
    items?: {
      title: string;
      url: string;
      id?: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup id="sidebar-nav-main">
      <SidebarGroupLabel className="mt-6" id="sidebar-logo">
        <div className="flex items-center justify-center gap-2 h-20">
          <img src="/logoPAE.png" alt="Logo" className="w-36 h-21" id="app-logo" />
        </div>
      </SidebarGroupLabel>

      <SidebarMenu className="mt-8" id="sidebar-menu">
        {items.map((item) => {
          // Si el item NO tiene subitems, renderizar como botón simple
          if (!item.items || item.items.length === 0) {
            return (
              <SidebarMenuItem key={item.title} id={item.id}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          // Si el item SÍ tiene subitems, renderizar como collapsible
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem id={item.id}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} id={`${item.id}-trigger`}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub id={`${item.id}-submenu`}>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title} id={subItem.id}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
