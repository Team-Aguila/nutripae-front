import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const RootComponent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // Si es la página de login, no mostrar el layout con sidebar
  if (isLoginPage) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  // Para todas las demás rutas, usar el layout protegido
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>La página no fue encontrada.</div>,
});