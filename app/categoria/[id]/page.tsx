import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Heart, Menu, Search, User } from "lucide-react"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

// Datos simulados para productos (tabla detalle)
const productsData = {
  1: [
    // iPhone
    {
      id: 101,
      name: "iPhone 15 Pro Max",
      price: 1299,
      originalPrice: 1399,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 245,
      inStock: true,
      features: ["256GB", "Titanio Natural", "Cámara 48MP"],
      category: "iPhone",
    },
    {
      id: 102,
      name: "iPhone 15 Pro",
      price: 1099,
      originalPrice: 1199,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 189,
      inStock: true,
      features: ["128GB", "Titanio Azul", "Cámara 48MP"],
      category: "iPhone",
    },
    {
      id: 103,
      name: "iPhone 14",
      price: 799,
      originalPrice: 899,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 312,
      inStock: false,
      features: ["128GB", "Azul", "Cámara 12MP"],
      category: "iPhone",
    },
  ],
  2: [
    // Samsung Galaxy
    {
      id: 201,
      name: "Galaxy S24 Ultra",
      price: 1199,
      originalPrice: 1299,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 156,
      inStock: true,
      features: ["512GB", "Titanio Gris", "S Pen incluido"],
      category: "Samsung Galaxy",
    },
    {
      id: 202,
      name: "Galaxy S24+",
      price: 999,
      originalPrice: 1099,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 203,
      inStock: true,
      features: ["256GB", "Violeta", "Cámara 50MP"],
      category: "Samsung Galaxy",
    },
    {
      id: 203,
      name: "Galaxy A54",
      price: 449,
      originalPrice: 499,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.4,
      reviews: 89,
      inStock: true,
      features: ["128GB", "Negro", "Cámara 50MP"],
      category: "Samsung Galaxy",
    },
  ],
  3: [
    // Xiaomi
    {
      id: 301,
      name: "Xiaomi 14 Ultra",
      price: 899,
      originalPrice: 999,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.6,
      reviews: 134,
      inStock: true,
      features: ["512GB", "Negro", "Cámara Leica"],
      category: "Xiaomi",
    },
    {
      id: 302,
      name: "Redmi Note 13 Pro",
      price: 299,
      originalPrice: 349,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.5,
      reviews: 267,
      inStock: true,
      features: ["256GB", "Azul", "Carga 67W"],
      category: "Xiaomi",
    },
    {
      id: 303,
      name: "POCO X6 Pro",
      price: 349,
      originalPrice: 399,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.3,
      reviews: 178,
      inStock: true,
      features: ["256GB", "Amarillo", "Gaming"],
      category: "Xiaomi",
    },
  ],
}

const categoryNames = {
  1: "iPhone",
  2: "Samsung Galaxy",
  3: "Xiaomi",
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = Number.parseInt(params.id)
  const products = productsData[categoryId as keyof typeof productsData] || []
  const categoryName = categoryNames[categoryId as keyof typeof categoryNames] || "Categoría"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PartDo</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-900 hover:text-blue-600 font-medium">
                Productos
              </Link>
              <Link href="/ofertas" className="text-gray-600 hover:text-blue-600">
                Ofertas
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600">
                Contacto
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <CartSidebar />
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{categoryName}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
          <h2 className="text-4xl font-bold mb-4">{categoryName}</h2>
          <p className="text-xl opacity-90">
            Descubre los mejores modelos de {categoryName} con las últimas tecnologías
          </p>
        </div>
      </section>

      {/* Products Grid (Tabla Detalle) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Productos Disponibles ({products.length})</h3>
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>Ordenar por precio</option>
                <option>Menor a mayor</option>
                <option>Mayor a menor</option>
                <option>Más populares</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice > product.price && (
                    <Badge className="absolute top-4 left-4 bg-red-500">Oferta</Badge>
                  )}
                  {!product.inStock && <Badge className="absolute top-4 right-4 bg-gray-500">Agotado</Badge>}
                  <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/80 hover:bg-white">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews} reseñas)</span>
                  </div>

                  <div className="mb-4">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <AddToCartButton
                    product={product}
                    disabled={!product.inStock}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">PartDo</h5>
              <p className="text-gray-400">Tu tienda de confianza para smartphones y accesorios.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Enlaces</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/productos" className="hover:text-white">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link href="/ofertas" className="hover:text-white">
                    Ofertas
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Categorías</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/categoria/1" className="hover:text-white">
                    iPhone
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/2" className="hover:text-white">
                    Samsung
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/3" className="hover:text-white">
                    Xiaomi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contacto</h5>
              <p className="text-gray-400">
                Email: info@partdo.com
                <br />
                Teléfono: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PartDo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
