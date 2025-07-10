import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Package,
  Weight,
  Clock,
  AlertTriangle,
  Loader2,
  Check,
  ChevronsUpDown,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
  type ProductCreate,
  type ProductUpdate,
} from "@/features/purchases/products/api/products";
import { getProviders, type ProviderResponse } from "@/features/purchases/providers/api/getProviders";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [providerSearchOpen, setProviderSearchOpen] = useState(false);
  const [providerSearchValue, setProviderSearchValue] = useState("");
  const [formData, setFormData] = useState<ProductCreate>({
    provider_id: "",
    name: "",
    weight: 0,
    weekly_availability: "",
    life_time: {
      value: 0,
      unit: "days",
    },
    shrinkage_factor: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ limit: 100 });
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cargar proveedores
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true);
        const response = await getProviders({ limit: 100 });
        setProviders(response.providers);
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (providerSearchOpen && !(event.target as Element).closest(".provider-combobox")) {
        setProviderSearchOpen(false);
        setProviderSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [providerSearchOpen]);

  const resetForm = () => {
    setFormData({
      provider_id: "",
      name: "",
      weight: 0,
      weekly_availability: "",
      life_time: {
        value: 0,
        unit: "days",
      },
      shrinkage_factor: 0,
    });
  };

  const handleCreateDialogOpen = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditDialogCancel = () => {
    resetForm();
    setSelectedProduct(null);
    setEditDialogOpen(false);
  };

  const handleCreateProduct = async () => {
    // Validar que todos los campos requeridos estén completos
    if (
      !formData.provider_id ||
      !formData.name ||
      formData.weight <= 0 ||
      !formData.weekly_availability ||
      formData.life_time.value <= 0 ||
      !formData.life_time.unit ||
      (formData.shrinkage_factor || 0) < 0
    ) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }

    try {
      setCreating(true);
      const newProduct = await createProduct(formData);
      setProducts([...products, newProduct]);
      setDialogOpen(false);
      // Resetear el formulario
      resetForm();
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error al crear el producto. Por favor, intenta nuevamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (
    field: keyof ProductCreate,
    value: string | number | { value?: number; unit?: string }
  ) => {
    if (field === "life_time" && typeof value === "object") {
      setFormData((prev) => ({
        ...prev,
        life_time: { ...prev.life_time, ...value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const getWeeklyAvailabilityDisplay = (availability: string) => {
    const dayNames = {
      MONDAY: "Lunes",
      TUESDAY: "Martes",
      WEDNESDAY: "Miércoles",
      THURSDAY: "Jueves",
      FRIDAY: "Viernes",
      SATURDAY: "Sábado",
      SUNDAY: "Domingo",
    };

    return dayNames[availability as keyof typeof dayNames] || availability;
  };

  // Filtrar proveedores por búsqueda
  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(providerSearchValue.toLowerCase())
  );

  // Obtener el nombre del proveedor seleccionado
  const getSelectedProviderName = () => {
    const selectedProvider = providers.find((p) => p._id === formData.provider_id);
    return selectedProvider ? selectedProvider.name : "Seleccionar proveedor *";
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      provider_id: product.provider_id,
      name: product.name,
      weight: product.weight,
      weekly_availability: product.weekly_availability,
      life_time: product.life_time,
      shrinkage_factor: product.shrinkage_factor,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    // Validar que todos los campos requeridos estén completos
    if (
      !formData.provider_id ||
      !formData.name ||
      formData.weight <= 0 ||
      !formData.weekly_availability ||
      formData.life_time.value <= 0 ||
      !formData.life_time.unit ||
      (formData.shrinkage_factor || 0) < 0
    ) {
      alert("Por favor, completa todos los campos requeridos");
      return;
    }

    try {
      setUpdating(true);
      const updateData: ProductUpdate = {
        name: formData.name,
        weight: formData.weight,
        weekly_availability: formData.weekly_availability,
        life_time: formData.life_time,
        shrinkage_factor: formData.shrinkage_factor,
      };

      const updatedProduct = await updateProduct(selectedProduct._id, updateData);

      // Actualizar la lista de productos
      setProducts((prevProducts) => prevProducts.map((p) => (p._id === selectedProduct._id ? updatedProduct : p)));

      setEditDialogOpen(false);
      setSelectedProduct(null);

      // Resetear el formulario
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error al actualizar el producto. Por favor, intenta nuevamente.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      setDeleting(true);
      await deleteProduct(selectedProduct._id);

      // Eliminar el producto de la lista
      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== selectedProduct._id));

      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto. Por favor, intenta nuevamente.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SiteHeader
        items={[
          { label: "Compras", href: "/purchases" },
          { label: "Productos", href: "/purchases/products", isCurrentPage: true },
        ]}
      />

      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Productos</h1>
        <p className="text-gray-600 mb-6">Gestión de productos para el sistema de compras</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Catálogo de Productos</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateDialogOpen}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>Completa la información del producto para agregarlo al catálogo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider_id">Proveedor *</Label>
                  <div className="relative provider-combobox">
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={providerSearchOpen}
                      className="w-full justify-between"
                      onClick={() => setProviderSearchOpen(!providerSearchOpen)}
                    >
                      {getSelectedProviderName()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    {providerSearchOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        <div className="p-2">
                          <Input
                            placeholder="Buscar proveedor..."
                            value={providerSearchValue}
                            onChange={(e) => setProviderSearchValue(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                          {loadingProviders ? (
                            <div className="p-4 text-center text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                              Cargando proveedores...
                            </div>
                          ) : filteredProviders.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No se encontraron proveedores</div>
                          ) : (
                            filteredProviders.map((provider) => (
                              <div
                                key={provider._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                onClick={() => {
                                  handleInputChange("provider_id", provider._id);
                                  setProviderSearchOpen(false);
                                  setProviderSearchValue("");
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    formData.provider_id === provider._id ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{provider.name}</div>
                                  <div className="text-sm text-gray-600">{provider.nit}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ingresa el nombre del producto"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="weekly_availability">Disponibilidad Semanal *</Label>
                  <Select
                    value={formData.weekly_availability}
                    onValueChange={(value) => handleInputChange("weekly_availability", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONDAY">Lunes</SelectItem>
                      <SelectItem value="TUESDAY">Martes</SelectItem>
                      <SelectItem value="WEDNESDAY">Miércoles</SelectItem>
                      <SelectItem value="THURSDAY">Jueves</SelectItem>
                      <SelectItem value="FRIDAY">Viernes</SelectItem>
                      <SelectItem value="SATURDAY">Sábado</SelectItem>
                      <SelectItem value="SUNDAY">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="life_time_value">Vida Útil (Valor) *</Label>
                  <Input
                    id="life_time_value"
                    type="number"
                    value={formData.life_time.value}
                    onChange={(e) => handleInputChange("life_time", { value: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="life_time_unit">Unidad *</Label>
                  <Select
                    value={formData.life_time.unit}
                    onValueChange={(value) => handleInputChange("life_time", { unit: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar unidad *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Días</SelectItem>
                      <SelectItem value="weeks">Semanas</SelectItem>
                      <SelectItem value="months">Meses</SelectItem>
                      <SelectItem value="years">Años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shrinkage_factor">Factor de Merma (%) *</Label>
                  <Input
                    id="shrinkage_factor"
                    type="number"
                    step="0.01"
                    value={(formData.shrinkage_factor || 0) * 100}
                    onChange={(e) => handleInputChange("shrinkage_factor", (parseFloat(e.target.value) || 0) / 100)}
                    placeholder="0"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleCreateProduct}
                disabled={
                  creating ||
                  !formData.provider_id ||
                  !formData.name ||
                  formData.weight <= 0 ||
                  !formData.weekly_availability ||
                  formData.life_time.value <= 0 ||
                  !formData.life_time.unit
                }
              >
                {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {creating ? "Creando..." : "Crear Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>Modifica la información del producto y guarda los cambios.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider_id">Proveedor (No editable)</Label>
                  <div className="relative provider-combobox">
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={false}
                      className="w-full justify-between opacity-50 cursor-not-allowed"
                      disabled={true}
                    >
                      {getSelectedProviderName()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    El proveedor no se puede cambiar después de crear el producto.
                  </p>
                </div>
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ingresa el nombre del producto"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="weekly_availability">Disponibilidad Semanal *</Label>
                  <Select
                    value={formData.weekly_availability}
                    onValueChange={(value) => handleInputChange("weekly_availability", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONDAY">Lunes</SelectItem>
                      <SelectItem value="TUESDAY">Martes</SelectItem>
                      <SelectItem value="WEDNESDAY">Miércoles</SelectItem>
                      <SelectItem value="THURSDAY">Jueves</SelectItem>
                      <SelectItem value="FRIDAY">Viernes</SelectItem>
                      <SelectItem value="SATURDAY">Sábado</SelectItem>
                      <SelectItem value="SUNDAY">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="life_time_value">Vida Útil (Valor) *</Label>
                  <Input
                    id="life_time_value"
                    type="number"
                    value={formData.life_time.value}
                    onChange={(e) => handleInputChange("life_time", { value: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="life_time_unit">Unidad *</Label>
                  <Select
                    value={formData.life_time.unit}
                    onValueChange={(value) => handleInputChange("life_time", { unit: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar unidad *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Días</SelectItem>
                      <SelectItem value="weeks">Semanas</SelectItem>
                      <SelectItem value="months">Meses</SelectItem>
                      <SelectItem value="years">Años</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shrinkage_factor">Factor de Merma (%) *</Label>
                  <Input
                    id="shrinkage_factor"
                    type="number"
                    step="0.01"
                    value={(formData.shrinkage_factor || 0) * 100}
                    onChange={(e) => handleInputChange("shrinkage_factor", (parseFloat(e.target.value) || 0) / 100)}
                    placeholder="0"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleEditDialogCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                onClick={handleUpdateProduct}
                disabled={
                  updating ||
                  !formData.provider_id ||
                  !formData.name ||
                  formData.weight <= 0 ||
                  !formData.weekly_availability ||
                  formData.life_time.value <= 0 ||
                  !formData.life_time.unit
                }
              >
                {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {updating ? "Actualizando..." : "Actualizar Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Eliminar Producto</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-500">
                Producto: <span className="font-medium">{selectedProduct?.name}</span>
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteProduct} disabled={deleting}>
                {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {deleting ? "Eliminando..." : "Eliminar Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="outline">Producto</Badge>
              </div>
              <CardDescription>ID: {product.provider_id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span>Proveedor ID</span>
                </div>
                <span className="font-medium">{product.provider_id.slice(0, 8)}...</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span>Peso</span>
                </div>
                <span className="font-medium">{product.weight} kg</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Vida útil</span>
                </div>
                <span className="font-medium">
                  {product.life_time.value} {product.life_time.unit}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <span>Merma</span>
                </div>
                <span className="font-medium">{(product.shrinkage_factor * 100).toFixed(1)}%</span>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 mb-2">Disponibilidad:</p>
                <div className="flex flex-wrap gap-1">
                  {product.weekly_availability.includes(",") ? (
                    product.weekly_availability.split(",").map((day, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {getWeeklyAvailabilityDisplay(day.trim())}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {getWeeklyAvailabilityDisplay(product.weekly_availability)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(product)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
