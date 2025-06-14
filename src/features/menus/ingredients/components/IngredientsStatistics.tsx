import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useIngredientsStatistics } from "../hooks/useIngredientsStatistics";

export const IngredientsStatistics = () => {
  const { data: statistics, isLoading, error } = useIngredientsStatistics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-gray-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            Error al cargar las estadísticas
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ingredientes</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total_ingredients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.active_ingredients}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.total_ingredients > 0
                ? `${Math.round((statistics.active_ingredients / statistics.total_ingredients) * 100)}% del total`
                : "0% del total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.inactive_ingredients}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.total_ingredients > 0
                ? `${Math.round((statistics.inactive_ingredients / statistics.total_ingredients) * 100)}% del total`
                : "0% del total"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <BarChart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statistics.total_categories}</div>
            <p className="text-xs text-muted-foreground">Categorías registradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Categorías */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías Disponibles</CardTitle>
          <CardDescription>Lista de categorías de ingredientes registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statistics.categories?.map((categoryName, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{categoryName.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">Categoría</p>
                </div>
                <Badge variant="secondary">✓</Badge>
              </div>
            )) || []}
          </div>
        </CardContent>
      </Card>

      {/* Ingredientes más usados - Solo mostrar si existe en la respuesta */}
      {statistics.most_used_ingredients && (statistics.most_used_ingredients?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ingredientes Más Utilizados</CardTitle>
            <CardDescription>Top ingredientes por frecuencia de uso en recetas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Uso en Recetas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.most_used_ingredients?.slice(0, 10).map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="default">{ingredient.usage_count}</Badge>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Ingredientes menos usados - Solo mostrar si existe en la respuesta */}
      {statistics.least_used_ingredients && (statistics.least_used_ingredients?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ingredientes Menos Utilizados</CardTitle>
            <CardDescription>Ingredientes con menor frecuencia de uso</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Uso en Recetas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.least_used_ingredients?.slice(0, 10).map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{ingredient.usage_count}</Badge>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Ingredientes sin uso - Solo mostrar si existe en la respuesta */}
      {statistics.unused_ingredients && (statistics.unused_ingredients?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ingredientes Sin Uso</CardTitle>
            <CardDescription>Ingredientes que no están siendo utilizados en ninguna receta</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statistics.unused_ingredients?.slice(0, 20).map((ingredient) => (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Sin uso
                      </Badge>
                    </TableCell>
                  </TableRow>
                )) || []}
              </TableBody>
            </Table>
            {(statistics.unused_ingredients?.length || 0) > 20 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Y {(statistics.unused_ingredients?.length || 0) - 20} ingredientes más...
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
