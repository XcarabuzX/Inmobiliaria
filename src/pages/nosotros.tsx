
import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Layout } from "@/components/layout/Layout"
import { teamService, TeamMember } from "@/services/teamService"

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await teamService.getAllTeamMembers()
        setTeamMembers(members)
      } catch (error) {
        console.error("Error fetching team members:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  return (
    <Layout>
      <Head>
        <title>Quiénes Somos - InmobiliariaLagos</title>
        <meta name="description" content="Conoce a nuestro equipo de profesionales inmobiliarios en la Región de Los Lagos" />
      </Head>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Quiénes Somos</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Nuestra Historia</h2>
              <p className="text-gray-700 mb-4">
                Fundada en 2005, InmobiliariaLagos nació con la visión de transformar la experiencia de comprar, vender y arrendar propiedades en la Región de Los Lagos. Comenzamos como una pequeña oficina en Puerto Montt y hoy contamos con presencia en las principales ciudades de la región.
              </p>
              <p className="text-gray-700 mb-4">
                A lo largo de estos años, hemos ayudado a cientos de familias a encontrar el hogar de sus sueños y a inversionistas a concretar negocios exitosos. Nuestro profundo conocimiento del mercado local y nuestro compromiso con la excelencia nos han posicionado como líderes en el sector inmobiliario regional.
              </p>
              <p className="text-gray-700">
                En InmobiliariaLagos creemos que cada propiedad tiene una historia que contar y cada cliente tiene necesidades únicas. Por eso, nos esforzamos por ofrecer un servicio personalizado y de calidad, respaldado por un equipo de profesionales altamente capacitados.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
                alt="Oficina de InmobiliariaLagos"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-4 text-center">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Integridad</h3>
                <p className="text-gray-700">
                  Actuamos con honestidad y transparencia en cada transacción, priorizando siempre los intereses de nuestros clientes.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Excelencia</h3>
                <p className="text-gray-700">
                  Nos esforzamos por superar las expectativas, ofreciendo un servicio de calidad superior y atención al detalle.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-3">Compromiso</h3>
                <p className="text-gray-700">
                  Estamos comprometidos con el éxito de nuestros clientes, acompañándolos en cada paso del proceso inmobiliario.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-8 text-center">Nuestro Equipo</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p>Cargando equipo...</p>
              </div>
            ) : teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-64 w-full">
                      <Image
                        src={member.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a"}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary mb-3">{member.role}</p>
                      <p className="text-gray-700 text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Fallback data if no team members in database */}
                {[
                  {
                    id: "1",
                    name: "Carlos Rodríguez",
                    role: "Gerente General",
                    bio: "Con más de 20 años de experiencia en el sector inmobiliario, Carlos ha liderado el crecimiento de InmobiliariaLagos desde sus inicios.",
                    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
                  },
                  {
                    id: "2",
                    name: "María González",
                    role: "Agente Senior",
                    bio: "Especialista en propiedades residenciales de alto valor, María ha cerrado más de 200 transacciones exitosas en los últimos 5 años.",
                    photo_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
                  },
                  {
                    id: "3",
                    name: "Juan Pérez",
                    role: "Agente Comercial",
                    bio: "Experto en locales comerciales y oficinas, Juan tiene un profundo conocimiento del mercado empresarial en la Región de Los Lagos.",
                    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  },
                  {
                    id: "4",
                    name: "Ana Martínez",
                    role: "Asesora Legal",
                    bio: "Abogada especializada en derecho inmobiliario, Ana asegura que todas nuestras transacciones cumplan con la normativa vigente.",
                    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
                  }
                ].map((member) => (
                  <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-64 w-full">
                      <Image
                        src={member.photo_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary mb-3">{member.role}</p>
                      <p className="text-gray-700 text-sm">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
