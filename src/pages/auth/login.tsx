
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import { Layout } from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const { signInWithUsername } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signInWithUsername(username, password)
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al panel de administración",
        variant: "default"
      })
      router.push("/admin")
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error)
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Credenciales inválidas. Por favor, intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Iniciar Sesión - InmobiliariaLagos</title>
        <meta name="description" content="Inicia sesión en el panel de administración de InmobiliariaLagos" />
      </Head>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede al panel de administración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Nombre de Usuario
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </label>
                    <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
