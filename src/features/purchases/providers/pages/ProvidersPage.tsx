import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

const ProvidersPage = () => {
  const [providers] = useState([
    {
      id: "1",
      name: "Proveedor ABC",
      nit: "123456789-1",
      address: "Calle 123 #45-67",
      responsible_name: "Juan Pérez",
      email: "juan.perez@proveedor.com",
      phone_number: "300-123-4567",
      is_local_provider: true,
    },
    {
      id: "2",
      name: "Distribuidora XYZ",
      nit: "987654321-2",
      address: "Carrera 89 #12-34",
      responsible_name: "María González",
      email: "maria.gonzalez@distribuidora.com",
      phone_number: "310-987-6543",
      is_local_provider: false,
    },
  ]);

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Proveedores", href: "/purchases/providers", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Proveedores</h1>
        <p className="text-gray-600 mb-6">Gestión de proveedores para el sistema de compras</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Listado de Proveedores</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    provider.is_local_provider ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {provider.is_local_provider ? "Local" : "Nacional"}
                </span>
              </div>
              <CardDescription>NIT: {provider.nit}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>{provider.responsible_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{provider.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{provider.phone_number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{provider.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProvidersPage;
