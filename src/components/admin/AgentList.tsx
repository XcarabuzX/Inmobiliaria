
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AgentList() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Agentes Inmobiliarios</h2>
        <Button>Agregar Agente</Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p>Cargando agentes...</p>
        ) : agents.length === 0 ? (
          <p>No hay agentes registrados</p>
        ) : (
          agents.map((agent: any) => (
            <Card key={agent.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.photo_url} alt={agent.name} />
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">
                        {agent.properties_count} propiedades
                      </Badge>
                      <Badge variant="outline">
                        {agent.closed_deals_count} ventas cerradas
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
