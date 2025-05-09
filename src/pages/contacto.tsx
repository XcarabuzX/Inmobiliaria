
import Head from "next/head"
import { useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { contactService } from "@/services/contactService"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const messageId = await contactService.submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        property_id: null,
        agent_id: null
      })

      if (messageId) {
        toast({
          title: "Mensaje enviado",
          description: "Nos pondremos en contacto contigo pronto.",
          variant: "default"
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        })
      } else {
        throw new Error("No se pudo enviar el mensaje")
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Contacto - InmobiliariaLagos</title>
        <meta name="description" content="Contáctanos para más información sobre nuestras propiedades en la Región de Los Lagos" />
      </Head>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Contacto</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Información de Contacto</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-1">Dirección</h3>
                  <p className="text-gray-600">Av. Diego Portales 860, Puerto Montt, Chile</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Teléfono</h3>
                  <p className="text-gray-600">+56 9 1234 5678</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Email</h3>
                  <p className="text-gray-600">contacto@inmobiliarialagos.cl</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Horario de Atención</h3>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                  <p className="text-gray-600">Sábado: 10:00 - 14:00</p>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Ubicación</h3>
                <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Mapa de ubicación (se integrará con Google Maps)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre Completo *</label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Teléfono</label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Mensaje *</label>
                  <Textarea 
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
