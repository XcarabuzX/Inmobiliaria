
import { useState, useEffect } from "react"
import { propertyService, PropertyWithImages } from "@/services/propertyService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function PropertyList() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    location: "",
    minPrice: "",
    maxPrice: ""
  })

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAllProperties()
      setProperties(data)
    } catch (error) {
      console.error("Error loading properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      await propertyService.updateProperty(propertyId, { status: newStatus })
      loadProperties()
    } catch (error) {
      console.error("Error updating property status:", error)
    }
  }

  if (loading) {
    return <div>Cargando propiedades...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="vendida">Vendida</SelectItem>
            <SelectItem value="en_arriendo">En arriendo</SelectItem>
            <SelectItem value="en_negociacion">En negociación</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de propiedad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="departamento">Departamento</SelectItem>
            <SelectItem value="parcela">Parcela</SelectItem>
            <SelectItem value="oficina">Oficina</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Ubicación"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Precio mínimo"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Precio máximo"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {properties.map((property) => (
          <div key={property.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <p className="text-gray-600">{property.location}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{property.category}</Badge>
                  <Badge variant="outline">{property.type}</Badge>
                  <Badge variant="outline">
                    {property.price.toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP"
                    })}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Select
                  value={property.status || "disponible"}
                  onValueChange={(value) => handleStatusChange(property.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="vendida">Vendida</SelectItem>
                    <SelectItem value="en_arriendo">En arriendo</SelectItem>
                    <SelectItem value="en_negociacion">En negociación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
