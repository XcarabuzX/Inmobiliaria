import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  id: string
  title: string
  price: number
  location: string
  type: string
  category: "venta" | "arriendo"
  bedrooms: number
  bathrooms: number
  area: number
  imageUrl: string
}

export function PropertyCard({
  id,
  title,
  price,
  location,
  type,
  category,
  bedrooms,
  bathrooms,
  area,
  imageUrl
}: PropertyCardProps) {
  return (
    <Link href={`/propiedades/${id}`}>
      <Card className='overflow-hidden hover:shadow-lg transition-shadow'>
        <CardHeader className='p-0'>
          <div className='relative h-48 w-full'>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className='object-cover'
            />
            <Badge className='absolute top-2 right-2'>
              {category === 'venta' ? 'Venta' : 'Arriendo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='p-4'>
          <h3 className='text-lg font-semibold mb-2'>{title}</h3>
          <p className='text-gray-600 mb-2'>{location}</p>
          <p className='text-xl font-bold text-primary'>
            {price.toLocaleString('es-CL', {
              style: 'currency',
              currency: 'CLP'
            })}
          </p>
        </CardContent>
        <CardFooter className='p-4 pt-0 flex justify-between text-sm text-gray-600'>
          <span className='flex items-center gap-1'>
            <Bed size={18} className='text-primary' />
            <span>{bedrooms} hab.</span>
          </span>
          <span className='flex items-center gap-1'>
            <Bath size={18} className='text-primary' />
            <span>{bathrooms} baños</span>
          </span>
          <span className='flex items-center gap-1'>
            <Square size={18} className='text-primary' />
            <span>{area} m²</span>
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}