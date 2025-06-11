import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "./ui/breadcrumb"

interface BreadcrumbItem {
    label: string;
    href?: string;
    isCurrentPage?: boolean;
}

interface SiteHeaderProps {
    items: BreadcrumbItem[];
}

export function SiteHeader({ items }: SiteHeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {items.map((item, index) => (
                            <>
                                <BreadcrumbItem key={`item-${index}`} className="hidden md:block">
                                    {item.isCurrentPage ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={item.href || "#"}>
                                            {item.label}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < items.length - 1 && (
                                    <BreadcrumbSeparator key={`separator-${index}`} className="hidden md:block" />
                                )}
                            </>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}