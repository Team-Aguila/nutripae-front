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
  
  return <SidebarTrigger className="-ml-1" />;
}

export function SiteHeader({ items }: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full">
        <SafeSidebarTrigger />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <BreadcrumbItem key={`item-${index}`} className="hidden md:block">
                {item.isCurrentPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href || "#"}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
            {items.map((item, index) =>
              index < items.length - 1 ? (
                <BreadcrumbSeparator key={`separator-${item.label}-${index}`} className="hidden md:block" />
              ) : null
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
