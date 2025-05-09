
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ContactList() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mensajes Recibidos</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="responded">Respondidos</SelectItem>
            <SelectItem value="archived">Archivados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p>Cargando mensajes...</p>
        ) : messages.length === 0 ? (
          <p>No hay mensajes para mostrar</p>
        ) : (
          messages.map((message: any) => (
            <Card key={message.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="mt-2">{message.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge>{message.status}</Badge>
                    <Button variant="outline" size="sm">
                      Responder
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
