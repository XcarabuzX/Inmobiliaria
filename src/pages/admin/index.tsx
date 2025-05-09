
import Head from "next/head"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { propertyService } from "@/services/propertyService"
import { contactService } from "@/services/contactService"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [propertyCount, setPropertyCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const properties = await propertyService.getAllProperties()
        const messages = await contactService.getAllMessages()
        
        setPropertyCount(properties.length)
        setMessageCount(messages.length)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  if (loading || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Cargando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Panel de Administración - InmobiliariaLagos</title>
        <meta name="description" content="Panel de administración para gestionar propiedades y usuarios" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/admin/propiedades/nuevo")}>
              Nueva Propiedad
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Propiedades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{isLoading ? "..." : propertyCount}</p>
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => router.push("/admin/propiedades")}
              >
                Ver todas
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mensajes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{isLoading ? "..." : messageCount}</p>
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={() => router.push("/admin/mensajes")}
              >
                Ver todos
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push("/admin/propiedades/nuevo")}
                >
                  Agregar Propiedad
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push("/admin/agentes")}
                >
                  Gestionar Agentes
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => router.push("/admin/equipo")}
                >
                  Gestionar Equipo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Propiedades Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Cargando propiedades...</p>
              ) : (
                <div className="space-y-2">
                  <p>Aquí se mostrarán las propiedades más recientes</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/admin/propiedades")}
                  >
                    Ver todas las propiedades
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mensajes Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Cargando mensajes...</p>
              ) : (
                <div className="space-y-2">
                  <p>Aquí se mostrarán los mensajes más recientes</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/admin/mensajes")}
                  >
                    Ver todos los mensajes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
