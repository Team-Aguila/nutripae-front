import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Users, MapPin, Phone, Mail, Edit, Trash2, Eye, Building2, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  getProviderById,
  type ProviderResponse,
  type ProviderCreate,
  type ProviderUpdate,
  type ProvidersFilters,
} from "@/features/purchases/providers/api/getProviders";
import { toast } from "sonner";

function RouteComponent() {
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<ProvidersFilters & { search: string }>({
    search: "",
    is_local_provider: undefined,
    skip: 0,
    limit: 100,
  });

  const [newProvider, setNewProvider] = useState<ProviderCreate>({
    name: "",
    nit: "",
    address: "",
    responsible_name: "",
    email: "",
    phone_number: "",
    is_local_provider: true,
  });

  const [editProvider, setEditProvider] = useState<ProviderUpdate>({});

  // Load providers
  const loadProviders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProviders(filters);
      setProviders(response.providers);
      setTotalCount(response.total_count);
    } catch (error) {
      console.error("Error loading providers:", error);
      toast.error("No se pudieron cargar los proveedores");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  // Create provider
  const handleCreateProvider = async () => {
    const requiredFields = [
      newProvider.name,
      newProvider.nit,
      newProvider.address,
      newProvider.responsible_name,
      newProvider.email,
      newProvider.phone_number,
    ];

    if (requiredFields.some((field) => !field)) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      await createProvider(newProvider);
      toast.success("Proveedor creado exitosamente");
      setIsCreateDialogOpen(false);
      setNewProvider({
        name: "",
        nit: "",
        address: "",
        responsible_name: "",
        email: "",
        phone_number: "",
        is_local_provider: true,
      });
      loadProviders();
    } catch (error) {
      console.error("Error creating provider:", error);
      toast.error("No se pudo crear el proveedor");
    }
  };

  // Update provider
  const handleUpdateProvider = async () => {
    if (!selectedProvider) return;

    try {
      await updateProvider(selectedProvider._id, editProvider);
      toast.success("Proveedor actualizado exitosamente");
      setIsEditDialogOpen(false);
      setEditProvider({});
      setSelectedProvider(null);
      loadProviders();
    } catch (error) {
      console.error("Error updating provider:", error);
      toast.error("No se pudo actualizar el proveedor");
    }
  };

  // Delete provider
  const handleDeleteProvider = async (providerId: string) => {
    try {
      await deleteProvider(providerId);
      toast.success("Proveedor eliminado exitosamente");
      loadProviders();
    } catch (error) {
      console.error("Error deleting provider:", error);
      toast.error("No se pudo eliminar el proveedor");
    }
  };

  // View provider details
  const handleViewProvider = async (providerId: string) => {
    try {
      const provider = await getProviderById(providerId);
      setSelectedProvider(provider);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error("Error fetching provider details:", error);
      toast.error("No se pudieron cargar los detalles del proveedor");
    }
  };

  // Edit provider
  const handleEditProvider = async (providerId: string) => {
    try {
      const provider = await getProviderById(providerId);
      setSelectedProvider(provider);
      setEditProvider({
        name: provider.name,
        address: provider.address,
        responsible_name: provider.responsible_name,
        email: provider.email,
        phone_number: provider.phone_number,
        is_local_provider: provider.is_local_provider,
      });
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching provider for edit:", error);
      toast.error("No se pudieron cargar los datos del proveedor");
    }
  };

  // Filter providers by search
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      provider.responsible_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      provider.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      provider.nit.toLowerCase().includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (isLocal: boolean) => {
    return isLocal
      ? { variant: "default" as const, text: "Local" }
      : { variant: "secondary" as const, text: "Nacional" };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Proveedores", href: "/purchases/providers", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Proveedores</h1>
            <p className="text-gray-600">Gestión de proveedores del PAE</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proveedor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
                <DialogDescription>Ingresa los datos del nuevo proveedor</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={newProvider.name}
                    onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                    placeholder="Nombre del proveedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nit">NIT *</Label>
                  <Input
                    id="nit"
                    value={newProvider.nit}
                    onChange={(e) => setNewProvider({ ...newProvider, nit: e.target.value })}
                    placeholder="NIT del proveedor"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Textarea
                    id="address"
                    value={newProvider.address}
                    onChange={(e) => setNewProvider({ ...newProvider, address: e.target.value })}
                    placeholder="Dirección del proveedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsible_name">Responsable *</Label>
                  <Input
                    id="responsible_name"
                    value={newProvider.responsible_name}
                    onChange={(e) => setNewProvider({ ...newProvider, responsible_name: e.target.value })}
                    placeholder="Nombre del responsable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newProvider.email}
                    onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                    placeholder="Email del proveedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Teléfono *</Label>
                  <Input
                    id="phone_number"
                    value={newProvider.phone_number}
                    onChange={(e) => setNewProvider({ ...newProvider, phone_number: e.target.value })}
                    placeholder="Teléfono del proveedor"
                  />
                </div>
                <div className="space-y-2 flex items-center">
                  <Checkbox
                    id="is_local_provider"
                    checked={newProvider.is_local_provider}
                    onCheckedChange={(checked) =>
                      setNewProvider({ ...newProvider, is_local_provider: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_local_provider" className="ml-2">
                    Es proveedor local
                  </Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProvider}>Crear Proveedor</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumen de proveedores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Locales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {providers.filter((p) => p.is_local_provider).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Nacionales</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {providers.filter((p) => !p.is_local_provider).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{providers.filter((p) => !p.deleted_at).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra los proveedores por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, NIT, responsable o email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="local">Tipo de Proveedor</Label>
              <Select
                value={filters.is_local_provider === undefined ? "all" : filters.is_local_provider.toString()}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    is_local_provider: value === "all" ? undefined : value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="true">Locales</SelectItem>
                  <SelectItem value="false">Nacionales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={loadProviders} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Mostrando {filteredProviders.length} de {totalCount} proveedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Cargando proveedores...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-gray-500">{provider.responsible_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{provider.nit}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center mb-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {provider.phone_number}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {provider.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge {...getStatusBadge(provider.is_local_provider)}>
                        {getStatusBadge(provider.is_local_provider).text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(provider.created_at)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewProvider(provider._id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditProvider(provider._id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El proveedor será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProvider(provider._id)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para ver detalles */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Proveedor</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Nombre</Label>
                <p className="text-sm">{selectedProvider.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">NIT</Label>
                <p className="text-sm font-mono">{selectedProvider.nit}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium">Dirección</Label>
                <p className="text-sm">{selectedProvider.address}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Responsable</Label>
                <p className="text-sm">{selectedProvider.responsible_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm">{selectedProvider.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Teléfono</Label>
                <p className="text-sm">{selectedProvider.phone_number}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <Badge {...getStatusBadge(selectedProvider.is_local_provider)}>
                  {getStatusBadge(selectedProvider.is_local_provider).text}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Fecha de Creación</Label>
                <p className="text-sm">{formatDate(selectedProvider.created_at)}</p>
              </div>
              {selectedProvider.updated_at && (
                <div>
                  <Label className="text-sm font-medium">Última Actualización</Label>
                  <p className="text-sm">{formatDate(selectedProvider.updated_at)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>Modifica los datos del proveedor</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editProvider.name || ""}
                onChange={(e) => setEditProvider({ ...editProvider, name: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">Dirección</Label>
              <Textarea
                id="edit-address"
                value={editProvider.address || ""}
                onChange={(e) => setEditProvider({ ...editProvider, address: e.target.value })}
                placeholder="Dirección del proveedor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-responsible_name">Responsable</Label>
              <Input
                id="edit-responsible_name"
                value={editProvider.responsible_name || ""}
                onChange={(e) => setEditProvider({ ...editProvider, responsible_name: e.target.value })}
                placeholder="Nombre del responsable"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editProvider.email || ""}
                onChange={(e) => setEditProvider({ ...editProvider, email: e.target.value })}
                placeholder="Email del proveedor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone_number">Teléfono</Label>
              <Input
                id="edit-phone_number"
                value={editProvider.phone_number || ""}
                onChange={(e) => setEditProvider({ ...editProvider, phone_number: e.target.value })}
                placeholder="Teléfono del proveedor"
              />
            </div>
            <div className="space-y-2 flex items-center">
              <Checkbox
                id="edit-is_local_provider"
                checked={editProvider.is_local_provider || false}
                onCheckedChange={(checked) =>
                  setEditProvider({ ...editProvider, is_local_provider: checked as boolean })
                }
              />
              <Label htmlFor="edit-is_local_provider" className="ml-2">
                Es proveedor local
              </Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProvider}>Actualizar Proveedor</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute("/purchases/providers/")({
  component: RouteComponent,
});
