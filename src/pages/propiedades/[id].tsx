import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { propertyService, PropertyWithImages } from "@/services/propertyService"
import { contactService } from "@/services/contactService"
import { useToast } from "@/hooks/use-toast"
import { Bed, Bath, Square, Calendar, Car, Home } from 'lucide-react'

export default function PropertyDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()
  const [property, setProperty] = useState<PropertyWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [contactFormVisible, setContactFormVisible] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      if (id) {
        try {
          const propertyData = await propertyService.getPropertyById(id as string)
          setProperty(propertyData)
        } catch (error) {
          console.error(`Error fetching property with id ${id}:`, error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchProperty()
    }
  }, [id])

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const messageId = await contactService.submitContactMessage({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone || null,
        message: contactForm.message,
        property_id: property?.id || null,
        agent_id: null
      })

      if (messageId) {
        toast({
          title: 'Mensaje enviado',
          description: 'Nos pondremos en contacto contigo pronto.',
          variant: 'default'
        })
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
        setContactFormVisible(false)
      } else {
        throw new Error('No se pudo enviar el mensaje')
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (router.isFallback || loading) {
    return (
      <Layout>
        <div className='container mx-auto px-4 py-12 text-center'>
          <p>Cargando propiedad...</p>
        </div>
      </Layout>
    )
  }

  if (!property) {
    return (
      <Layout>
        <div className='container mx-auto px-4 py-12 text-center'>
          <h1 className='text-2xl font-bold mb-4'>Propiedad no encontrada</h1>
          <p className='mb-6'>La propiedad que estás buscando no existe o ha sido eliminada.</p>
          <Button onClick={() => router.push('/propiedades')}>
            Ver todas las propiedades
          </Button>
        </div>
      </Layout>
    )
  }

  // Asegurarse de que property.images sea un array antes de usarlo
  const propertyImages = property.images || [];
  
  // Get main image or first image with fallback
  const mainImage = propertyImages.length > 0 && propertyImages.find(img => img?.is_main)?.url || 
                    (propertyImages.length > 0 ? propertyImages[0]?.url : null) || 
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa';

  // Get other images safely
  const otherImages = propertyImages.length > 0 
    ? propertyImages.filter(img => img && !img.is_main).map(img => img.url || '')
    : [];

  return (
    <Layout>
      <Head>
        <title>{property.title} - InmobiliariaLagos</title>
        <meta name='description' content={property.description?.substring(0, 160) || 'Detalles de la propiedad'} />
      </Head>

      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8'>
          <Button variant='outline' size='sm' onClick={() => router.back()}>
            ← Volver
          </Button>
        </div>

        {/* Título y badges fuera del grid para que aparezcan antes de la imagen y la card */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>{property.title}</h1>
          <p className='text-gray-600 mb-2'>{property.address || property.location}</p>
          <div className='flex items-center gap-2'>
            <Badge>{property.category === 'venta' ? 'Venta' : 'Arriendo'}</Badge>
            <Badge variant='outline'>{property.type}</Badge>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='mb-8'>
              <div className='relative h-96 w-full mb-2 rounded-lg overflow-hidden'>
                <Image
                  src={mainImage}
                  alt={property.title}
                  fill
                  className='object-cover'
                />
              </div>
              {otherImages.length > 0 && (
                <div className='grid grid-cols-4 gap-2'>
                  {otherImages.slice(0, 4).map((image, index) => (
                    <div key={index} className='relative h-24 rounded-lg overflow-hidden'>
                      <Image
                        src={image}
                        alt={`${property.title} - Imagen ${index + 2}`}
                        fill
                        className='object-cover'
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Tabs defaultValue='details'>
              <TabsList className='mb-4'>
                <TabsTrigger value='details'>Detalles</TabsTrigger>
                <TabsTrigger value='features'>Características</TabsTrigger>
                <TabsTrigger value='location'>Ubicación</TabsTrigger>
              </TabsList>
              
              <TabsContent value='details' className='space-y-4'>
                <div>
                  <h2 className='text-2xl font-semibold mb-4'>Descripción</h2>
                  <p className='text-gray-700'>{property.description || 'No hay descripción disponible para esta propiedad.'}</p>
                </div>
                
                <div>
                  <h3 className='text-xl font-semibold mb-3'>Información General</h3>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <div>
                      <p className='text-gray-600'>Tipo</p>
                      <div className='flex items-center gap-1 font-medium'>
                        <Home size={18} className='text-primary' />
                        <span>{property.type}</span>
                      </div>
                    </div>
                    <div>
                      <p className='text-gray-600'>Habitaciones</p>
                      <div className='flex items-center gap-1 font-medium'>
                        <Bed size={18} className='text-primary' />
                        <span>{property.bedrooms}</span>
                      </div>
                    </div>
                    <div>
                      <p className='text-gray-600'>Baños</p>
                      <div className='flex items-center gap-1 font-medium'>
                        <Bath size={18} className='text-primary' />
                        <span>{property.bathrooms}</span>
                      </div>
                    </div>
                    <div>
                      <p className='text-gray-600'>Superficie</p>
                      <div className='flex items-center gap-1 font-medium'>
                        <Square size={18} className='text-primary' />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                    {property.year_built && (
                      <div>
                        <p className='text-gray-600'>Año construcción</p>
                        <div className='flex items-center gap-1 font-medium'>
                          <Calendar size={18} className='text-primary' />
                          <span>{property.year_built}</span>
                        </div>
                      </div>
                    )}
                    {property.parking !== null && (
                      <div>
                        <p className='text-gray-600'>Estacionamientos</p>
                        <div className='flex items-center gap-1 font-medium'>
                          <Car size={18} className='text-primary' />
                          <span>{property.parking}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value='features'>
                <h2 className='text-2xl font-semibold mb-4'>Características</h2>
                {property.features && property.features.length > 0 ? (
                  <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {property.features.map((feature) => (
                      <li key={feature.id} className='flex items-center gap-2'>
                        <span className='text-primary'>✓</span>
                        <span>{feature.feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay características disponibles para esta propiedad.</p>
                )}
              </TabsContent>
              
              <TabsContent value='location'>
                <h2 className='text-2xl font-semibold mb-4'>Ubicación</h2>
                <div className='relative h-96 w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center'>
                  <p className='text-gray-600'>Mapa de ubicación (se integrará con Google Maps)</p>
                </div>
                <p className='mt-4 text-gray-700'>{property.address || property.location}</p>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className='shadow-md'>
              <CardContent className='pt-6'>
                <div className='text-3xl font-bold text-primary mb-4'>
                  {property.price.toLocaleString('es-CL', {
                    style: 'currency',
                    currency: 'CLP'
                  })}
                </div>
                
                {property.agent && (
                  <div className='border-t border-b py-4 my-4'>
                    <h3 className='text-lg font-semibold mb-3'>Agente Inmobiliario</h3>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='relative h-12 w-12 rounded-full overflow-hidden'>
                        <Image
                          src={property.agent.photo_url || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e'}
                          alt={property.agent.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                      <div>
                        <p className='font-medium'>{property.agent.name}</p>
                        <p className='text-sm text-gray-600'>Agente de Ventas</p>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <p className='text-sm'>{property.agent.phone || 'Teléfono no disponible'}</p>
                      <p className='text-sm'>{property.agent.email}</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={() => setContactFormVisible(!contactFormVisible)} 
                  className='w-full mt-4'
                >
                  {contactFormVisible ? 'Ocultar' : 'Contactar al agente'}
                </Button>
                
                {contactFormVisible && (
                  <div className='mt-6 border-t pt-6'>
                    <h3 className='text-lg font-semibold mb-3'>Formulario de Contacto</h3>
                    <form onSubmit={handleContactSubmit} className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium mb-1'>Nombre *</label>
                        <input
                          type='text'
                          name='name'
                          value={contactForm.name}
                          onChange={handleContactFormChange}
                          className='w-full p-2 border rounded text-gray-900'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium mb-1'>Email *</label>
                        <input
                          type='email'
                          name='email'
                          value={contactForm.email}
                          onChange={handleContactFormChange}
                          className='w-full p-2 border rounded text-gray-900'
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium mb-1'>Teléfono</label>
                        <input
                          type='tel'
                          name='phone'
                          value={contactForm.phone}
                          onChange={handleContactFormChange}
                          className='w-full p-2 border rounded text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium mb-1'>Mensaje *</label>
                        <textarea
                          name='message'
                          value={contactForm.message}
                          onChange={handleContactFormChange}
                          className='w-full p-2 border rounded text-gray-900'
                          rows={4}
                          required
                        />
                      </div>
                      <Button type='submit' className='w-full' disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                      </Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}