import Link from "next/link"
import { useAuth } from '@/contexts/AuthContext'

export function Footer() {
  const { user } = useAuth()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">InmobiliariaLagos</h3>
            <p className="text-gray-400">
              Tu mejor opción en bienes raíces en la Región de Los Lagos
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/propiedades" className="text-gray-400 hover:text-white">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-white">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white">
                  Panel Administrativo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Puerto Montt, Chile</li>
              <li>+56 9 1234 5678</li>
              <li>contacto@inmobiliarialagos.cl</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}