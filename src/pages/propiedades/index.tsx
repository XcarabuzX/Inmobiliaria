import Head from "next/head"
import { useState, useEffect, ChangeEvent } from "react"
import { Layout } from "@/components/layout/Layout"
import { PropertyCard } from "@/components/properties/PropertyCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyService, PropertyWithImages } from "@/services/propertyService"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [category, setCategory] = useState<string>("all")
  const [propertyType, setPropertyType] = useState<string>("all")
  const [location, setLocation] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000000])
  const [minPriceInput, setMinPriceInput] = useState('0')
  const [maxPriceInput, setMaxPriceInput] = useState('300000000')
  const [bedrooms, setBedrooms] = useState<string>("all")
  const [isFiltering, setIsFiltering] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await propertyService.getAllProperties()
        setProperties(allProperties)
      } catch (error) {
        console.error("Error fetching properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handleApplyFilters = async () => {
    setIsFiltering(true)
    
    try {
      const filters = {
        category: category !== "all" ? category : undefined,
        type: propertyType !== "all" ? propertyType : undefined,
        location: location || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        bedrooms: bedrooms !== "all" ? parseInt(bedrooms) : undefined
      }
      
      const filteredProperties = await propertyService.getAllProperties(filters)
      setProperties(filteredProperties)
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setIsFiltering(false)
    }
  }

  const handleClearFilters = async () => {
    // Restablecer todos los filtros a sus valores predeterminados
    setCategory('all');
    setPropertyType('all');
    setLocation('');
    setPriceRange([0, 300000000]);
    setMinPriceInput('0');
    setMaxPriceInput('300000000');
    setBedrooms('all');
    
    // Cargar todas las propiedades sin filtros
    setIsFiltering(true);
    try {
      const allProperties = await propertyService.getAllProperties();
      setProperties(allProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setMinPriceInput(value)
    const numValue = parseInt(value || '0')
    setPriceRange([numValue, priceRange[1]])
  }

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Eliminar caracteres no numéricos
    const value = e.target.value.replace(/\D/g, '')
    
    // Actualizar el estado del input
    setMaxPriceInput(value)
    
    // Actualizar el rango de precio solo si hay un valor
    if (value) {
      const numValue = parseInt(value)
      setPriceRange([priceRange[0], numValue])
    } else {
      // Si el campo está vacío, mantener el valor predeterminado para el filtro
      // pero no mostrar nada en el input
      setPriceRange([priceRange[0], 300000000])
    }
  }

  // Format price with dots as thousand separators
  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-CL')
  }

  // Transform properties for PropertyCard component
  const displayProperties = properties.map(property => {
    // Asegurarse de que category sea estrictamente 'venta' o 'arriendo'
    const safeCategory = property.category === 'arriendo' ? 'arriendo' : 'venta';
    
    return {
      id: property.id,
      title: property.title,
      price: property.price,
      location: property.location,
      type: property.type,
      category: safeCategory as 'venta' | 'arriendo',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      imageUrl: property.images && property.images.length > 0
              ? (property.images.find(img => img.is_main)?.url || 
                property.images[0]?.url)
              : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'
    };
  });

  return (
    <Layout>
      <Head>
        <title>Propiedades - InmobiliariaLagos</title>
        <meta name='description' content='Explora nuestras propiedades en venta y arriendo en la Región de Los Lagos' />
      </Head>

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8 text-center text-gray-900'>Propiedades</h1>
          
          <div className='bg-white p-6 rounded-lg shadow-sm mb-8'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900'>Filtros de Búsqueda</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
              <div>
                <label className='block text-sm font-medium mb-1 text-gray-800'>Categoría</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className='border-gray-300 focus:border-primary text-gray-900'>
                    <SelectValue placeholder='Todas las categorías' className='text-gray-900' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todas las categorías</SelectItem>
                    <SelectItem value='venta'>Venta</SelectItem>
                    <SelectItem value='arriendo'>Arriendo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className='block text-sm font-medium mb-1 text-gray-800'>Tipo de Propiedad</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className='border-gray-300 focus:border-primary text-gray-900'>
                    <SelectValue placeholder='Todos los tipos' className='text-gray-900' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todos los tipos</SelectItem>
                    <SelectItem value='casa'>Casa</SelectItem>
                    <SelectItem value='departamento'>Departamento</SelectItem>
                    <SelectItem value='parcela'>Parcela</SelectItem>
                    <SelectItem value='oficina'>Oficina</SelectItem>
                    <SelectItem value='local'>Local Comercial</SelectItem>
                    <SelectItem value='terreno'>Terreno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className='block text-sm font-medium mb-1 text-gray-800'>Ubicación</label>
                <Input 
                  type='text' 
                  placeholder='Buscar por ubicación' 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className='border-gray-300 focus:border-primary text-gray-900'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium mb-1 text-gray-800'>Habitaciones</label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className='border-gray-300 focus:border-primary text-gray-900'>
                    <SelectValue placeholder='Cualquier número' className='text-gray-900' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Cualquier número</SelectItem>
                    <SelectItem value='1'>1 habitación</SelectItem>
                    <SelectItem value='2'>2 habitaciones</SelectItem>
                    <SelectItem value='3'>3 habitaciones</SelectItem>
                    <SelectItem value='4'>4+ habitaciones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className='mb-8 border-t border-gray-200 pt-6 mt-6'>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>Rango de Precio</h3>
                <p className='text-sm text-gray-500 mt-1'>El precio promedio de propiedades es $150.000.000 CLP</p>
              </div>
              
              <div className='grid grid-cols-2 gap-4 mt-4'>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>Precio mínimo</label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                    <Input
                      type='text'
                      value={formatPrice(parseInt(minPriceInput || '0'))}
                      onChange={handleMinPriceChange}
                      className='pl-7 border-gray-300 focus:border-primary text-gray-900'
                      placeholder='Precio mínimo'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>Precio máximo</label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>$</span>
                    <Input
                      type='text'
                      value={maxPriceInput === '' ? '' : formatPrice(parseInt(maxPriceInput))}
                      onChange={handleMaxPriceChange}
                      className='pl-7 border-gray-300 focus:border-primary text-gray-900'
                      placeholder='Precio máximo'
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className='flex flex-col md:flex-row gap-4'>
              <Button 
                onClick={handleApplyFilters} 
                disabled={isFiltering}
                className='bg-primary hover:bg-primary/90 text-white font-medium w-full md:w-auto'
              >
                {isFiltering ? 'Aplicando...' : 'Aplicar Filtros'}
              </Button>
              
              <Button 
                onClick={handleClearFilters}
                disabled={isFiltering}
                variant='outline'
                className='border-gray-300 text-gray-700 font-medium w-full md:w-auto'
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-800'>Cargando propiedades...</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {displayProperties.length > 0 ? (
                displayProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    {...property}
                  />
                ))
              ) : (
                <div className='col-span-3 text-center py-12'>
                  <h3 className='text-xl font-semibold mb-2 text-gray-900'>No se encontraron propiedades</h3>
                  <p className='text-gray-700'>Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}