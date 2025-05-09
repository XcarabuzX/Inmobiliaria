import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useIsMobile } from "@/hooks/use-mobile"

export function Header() {
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  return (
    <header className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='text-2xl font-bold text-gray-900'>
            InmobiliariaLagos
          </Link>
          
          {/* Desktop Navigation */}
          <NavigationMenu className='hidden md:block'>
            <NavigationMenuList className='flex gap-6'>
              <NavigationMenuItem>
                <Link href='/propiedades' legacyBehavior passHref>
                  <NavigationMenuLink className='text-gray-600 hover:text-gray-900'>
                    Propiedades
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/nosotros' legacyBehavior passHref>
                  <NavigationMenuLink className='text-gray-600 hover:text-gray-900'>
                    Quiénes Somos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/contacto' legacyBehavior passHref>
                  <NavigationMenuLink className='text-gray-600 hover:text-gray-900'>
                    Contacto
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Contact Button */}
          <div className='hidden md:flex items-center'>
            <Link href='/contacto'>
              <Button size='lg' className='bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-md'>
                Contactar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - Hamburger menu with improved visibility */}
          <div className='md:hidden flex items-center'>
            <Button 
              variant='default' 
              size='icon' 
              onClick={toggleMobileMenu} 
              aria-label='Menu' 
              className='focus:outline-none bg-black text-white hover:bg-gray-800 shadow-md'
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-[500px] opacity-100 border-t mt-4' 
              : 'max-h-0 opacity-0 border-t-0 mt-0'
          }`}
        >
          <nav className='flex flex-col py-4'>
            <Link 
              href='/propiedades' 
              className='text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-3 px-2 rounded-md transition-colors' 
              onClick={() => setMobileMenuOpen(false)}
            >
              Propiedades
            </Link>
            <Link 
              href='/nosotros' 
              className='text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-3 px-2 rounded-md transition-colors' 
              onClick={() => setMobileMenuOpen(false)}
            >
              Quiénes Somos
            </Link>
            <Link 
              href='/contacto' 
              className='text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-3 px-2 rounded-md transition-colors' 
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}