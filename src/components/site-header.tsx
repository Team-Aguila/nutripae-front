import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "./ui/breadcrumb";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface SiteHeaderProps {
  items: BreadcrumbItem[];
}

// Hook personalizado que verifica si podemos usar el sidebar
function useSidebarSafe() {
  try {
    return useSidebar();
  } catch {
    return null;
  }
}

function SafeSidebarTrigger() {
  const sidebar = useSidebarSafe();

  if (!sidebar) {
    return null;
  }

  return <SidebarTrigger className="-ml-1" id="sidebar-toggle-btn" />;
}

export function SiteHeader({ items }: SiteHeaderProps) {
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      id="site-header"
    >
      <div className="flex items-center gap-2 px-4 w-full" id="header-content">
        <SafeSidebarTrigger />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" id="header-separator" />
        <Breadcrumb id="breadcrumb-nav">
          <BreadcrumbList id="breadcrumb-list">
            {items.map((item, index) => (
              <React.Fragment key={`breadcrumb-fragment-${index}`}>
                <BreadcrumbItem key={`item-${index}`} className="hidden md:block" id={`breadcrumb-item-${index}`}>
                  {item.isCurrentPage ? (
                    <BreadcrumbPage id={`breadcrumb-current-${index}`}>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href || "#"} id={`breadcrumb-link-${index}`}>
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < items.length - 1 ? (
                  <BreadcrumbSeparator
                    key={`separator-${item.label}-${index}`}
                    className="hidden md:block"
                    id={`breadcrumb-separator-${index}`}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
