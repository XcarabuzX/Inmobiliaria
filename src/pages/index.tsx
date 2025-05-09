import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Button } from '@/components/ui/button'
import { propertyService, PropertyWithImages } from '@/services/propertyService'

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<PropertyWithImages[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const properties = await propertyService.getFeaturedProperties()
        setFeaturedProperties(properties)
      } catch (error) {
        console.error('Error fetching featured properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  // Fallback data if no properties in database
  const fallbackProperties = [
    {
      id: '1',
      title: 'Casa Moderna en Puerto Montt',
      price: 180000000,
      location: 'Puerto Montt, Los Lagos',
      type: 'casa',
      category: 'venta' as 'venta',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'
    },
    {
      id: '2',
      title: 'Departamento con Vista al Mar',
      price: 450000,
      location: 'Puerto Varas, Los Lagos',
      type: 'departamento',
      category: 'arriendo' as 'arriendo',
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
    },
    {
      id: '3',
      title: 'Parcela en Frutillar',
      price: 250000000,
      location: 'Frutillar, Los Lagos',
      type: 'parcela',
      category: 'venta' as 'venta',
      bedrooms: 4,
      bathrooms: 3,
      area: 5000,
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994'
    }
  ]

  const displayProperties = featuredProperties.length > 0 
    ? featuredProperties.map(property => {
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
                  ? (property.images.find(img => img.is_main)?.url || property.images[0]?.url)
                  : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'
        };
      })
    : fallbackProperties

  return (
    <Layout>
      <Head>
        <title>InmobiliariaLagos - Propiedades en la Región de Los Lagos</title>
        <meta name='description' content='Encuentra las mejores propiedades en venta y arriendo en la Región de Los Lagos, Chile' />
      </Head>

      <section className='relative h-[500px] flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white'>
        <div className='absolute inset-0'>
          <Image
            src='https://images.unsplash.com/photo-1582407947304-fd86f028f716'
            alt='Puerto Montt'
            fill
            className='object-cover opacity-30'
          />
        </div>
        <div className='relative container mx-auto px-4 text-center'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>
            Tu Hogar Ideal en la Región de Los Lagos
          </h1>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Encuentra las mejores propiedades en venta y arriendo en Puerto Montt y sus alrededores
          </p>
          <div className='flex gap-4 justify-center'>
            <Link href='/propiedades'>
              <Button size='lg'>
                Ver Propiedades
              </Button>
            </Link>
            {/* Botón de contactar eliminado */}
          </div>
        </div>
      </section>

      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl md:text-5xl font-bold mb-10 text-center text-gray-900 mx-auto'>
            Propiedades Destacadas
          </h2>
          {loading ? (
            <div className='text-center py-8'>
              <p>Cargando propiedades...</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {displayProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                />
              ))}
            </div>
          )}
          <div className='text-center mt-16'>
            <Link href='/propiedades'>
              <Button size='lg' className='bg-primary hover:bg-primary/90 text-white font-bold text-lg px-10 py-7 shadow-lg rounded-md transition-all hover:scale-105'>
                Ver Todas las Propiedades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold mb-4'>
                ¿Por qué elegirnos?
              </h2>
              <ul className='space-y-4'>
                <li className='flex gap-3'>
                  <span className='text-primary'>✓</span>
                  <span>Más de 15 años de experiencia en el mercado inmobiliario</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary'>✓</span>
                  <span>Amplio conocimiento de la Región de Los Lagos</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary'>✓</span>
                  <span>Asesoría personalizada en todo el proceso</span>
                </li>
                <li className='flex gap-3'>
                  <span className='text-primary'>✓</span>
                  <span>Garantía de satisfacción en nuestros servicios</span>
                </li>
              </ul>
            </div>
            <div className='relative h-[400px]'>
              <Image
                src='https://images.unsplash.com/photo-1560518883-ce09059eeffa'
                alt='Equipo de trabajo'
                fill
                className='object-cover rounded-lg'
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}