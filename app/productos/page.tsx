"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Star, Menu, Search, User, Heart, Eye, Edit } from "lucide-react"

// Definir interfaces para los tipos de datos
interface Categoria {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  productos: number
  estado: string
  fechaCreacion: string
}

interface Producto {
  id: number
  codigo: string
  nombre: string
  categoria: string
  precio: number
  stock: number
  estado: string
  imagen: string
}

export default function ProductosPage() {
  // Estados con tipos definidos
  const [categoriesTable, setCategoriesTable] = useState<Categoria[]>([
    {
      id: 1,
      codigo: "CAT001",
      nombre: "iPhone",
      descripcion: "Smartphones Apple iPhone",
      productos: 8,
      estado: "Activo",
      fechaCreacion: "2024-01-15",
    },
    {
      id: 2,
      codigo: "CAT002",
      nombre: "Samsung Galaxy",
      descripcion: "Smartphones Samsung Galaxy",
      productos: 12,
      estado: "Activo",
      fechaCreacion: "2024-01-16",
    },
    {
      id: 3,
      codigo: "CAT003",
      nombre: "Xiaomi",
      descripcion: "Smartphones Xiaomi y Redmi",
      productos: 15,
      estado: "Activo",
      fechaCreacion: "2024-01-17",
    },
  ])

  const [productsTable, setProductsTable] = useState<Producto[]>([
    {
      id: 101,
      codigo: "IP15PM001",
      nombre: "iPhone 15 Pro Max",
      categoria: "iPhone",
      precio: 1299,
      stock: 25,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 102,
      codigo: "IP15P001",
      nombre: "iPhone 15 Pro",
      categoria: "iPhone",
      precio: 1099,
      stock: 18,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 103,
      codigo: "IP14001",
      nombre: "iPhone 14",
      categoria: "iPhone",
      precio: 799,
      stock: 0,
      estado: "Agotado",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 201,
      codigo: "GS24U001",
      nombre: "Galaxy S24 Ultra",
      categoria: "Samsung Galaxy",
      precio: 1199,
      stock: 32,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 202,
      codigo: "GS24P001",
      nombre: "Galaxy S24+",
      categoria: "Samsung Galaxy",
      precio: 999,
      stock: 28,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 203,
      codigo: "GA54001",
      nombre: "Galaxy A54",
      categoria: "Samsung Galaxy",
      precio: 449,
      stock: 45,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 301,
      codigo: "X14U001",
      nombre: "Xiaomi 14 Ultra",
      categoria: "Xiaomi",
      precio: 899,
      stock: 15,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 302,
      codigo: "RN13P001",
      nombre: "Redmi Note 13 Pro",
      categoria: "Xiaomi",
      precio: 299,
      stock: 67,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 303,
      codigo: "PX6P001",
      nombre: "POCO X6 Pro",
      categoria: "Xiaomi",
      precio: 349,
      stock: 23,
      estado: "Disponible",
      imagen: "/placeholder.svg?height=60&width=60",
    },
  ])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 🔗 Cargar categorías desde PHP
        const categoriasResponse = await fetch("https://giancarlo.alwaysdata.net/categorias.php")
        const categoriasResult = await categoriasResponse.json()

        // 🔗 Cargar productos desde PHP
        const productosResponse = await fetch("https://giancarlo.alwaysdata.net/productos.php")
        const productosResult = await productosResponse.json()

        if (categoriasResult.success && categoriasResult.data && Array.isArray(categoriasResult.data)) {
          setCategoriesTable(categoriasResult.data as Categoria[])
        }

        if (productosResult.success && productosResult.data && Array.isArray(productosResult.data)) {
          // 🔧 CORREGIR: Construir URL completa para las imágenes
          const productosConImagenes = productosResult.data.map((producto: any) => ({
            ...producto,
            imagen: producto.imagen
              ? `https://giancarlo.alwaysdata.net/images/${producto.imagen}`
              : "/placeholder.svg?height=60&width=60",
          }))

          setProductsTable(productosConImagenes as Producto[])
        }

        if (categoriasResult.success && productosResult.success) {
          console.log("✅ Datos cargados desde PHP")
        } else {
          console.error("❌ Error en respuesta PHP")
        }
      } catch (error) {
        console.error("❌ Error cargando datos:", error)
        // Mantener datos iniciales si hay error
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={180} height={60} className="h-24 w-auto" />
            </div>

            <nav className="hidden md:flex space-x-10">
              <Link href="/" className="text-gray-900 hover:text-blue-600 font-medium text-lg">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-600 hover:text-blue-600 text-lg">
                Productos
              </Link>
              <Link href="/tienda" className="text-gray-600 hover:text-blue-600 text-lg">
                Tienda
              </Link>
              <Link href="/ofertas" className="text-gray-600 hover:text-blue-600 text-lg">
                Ofertas
              </Link>
              <Link href="/contacto" className="text-gray-600 hover:text-blue-600 text-lg">
                Contacto
              </Link>
            </nav>

            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="lg">
                <Search className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="lg">
                <Heart className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="lg">
                <User className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="lg" className="relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-sm">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="lg" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Gestión de Productos</h2>
          <p className="text-xl opacity-90">Administra categorías y productos de manera eficiente</p>
          {loading && (
            <Badge className="bg-yellow-500">Cargando productos...</Badge>
          )}
        </div>
      </section>

      {/* Tables Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Tabla Maestro - Categorías */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoriesTable.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium text-base">{category.id}</TableCell>
                        <TableCell>{category.codigo}</TableCell>
                        <TableCell className="font-semibold text-base">{category.nombre}</TableCell>
                        <TableCell className="text-base">{category.descripcion}</TableCell>
                        <TableCell className="text-center text-2x1">
                          <Badge variant="secondary">{category.productos}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 text-sm">{category.estado}</Badge>
                        </TableCell>
                        <TableCell className="text-base">{category.fechaCreacion}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-8 w-8" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-8 w-8" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Tabla Detalle - Productos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-x1 text-center">Imagen</TableHead>
                      <TableHead className="text-x1 text-center">ID</TableHead>
                      <TableHead className="text-x1 text-center">Código</TableHead>
                      <TableHead className="text-x1 text-center">Nombre</TableHead>
                      <TableHead className="text-x1 text-center">Categoría</TableHead>
                      <TableHead className="text-x1 text-center">Precio</TableHead>
                      <TableHead className="text-x1 text-center">Stock</TableHead>
                      <TableHead className="text-x1 text-center">Estado</TableHead>
                      <TableHead className="text-x1 text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productsTable.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.imagen || "/placeholder.svg"}
                            alt={product.nombre}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-center">{product.id}</TableCell>
                        <TableCell className="text-center">{product.codigo}</TableCell>
                        <TableCell className="font-semibold text-base text-center">{product.nombre}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="text-sm" variant="outline">{product.categoria}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-blue-600 text-center">${product.precio}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>{product.stock}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={product.estado === "Disponible" ? "bg-green-500" : "bg-red-500"}>
                            {product.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Link
                              href={`/categoria/${product.categoria === "iPhone" ? 1 : product.categoria === "Samsung Galaxy" ? 2 : 3}`}
                            >
                              <Button variant="ghost" size="icon">
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Productos</p>
                    <p className="text-2xl font-bold text-gray-900">{productsTable.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Categorías</p>
                    <p className="text-2xl font-bold text-gray-900">{categoriesTable.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Heart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En Stock</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productsTable.reduce((total, product) => total + product.stock, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Valor Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      $
                      {productsTable
                        .reduce((total, product) => total + product.precio * product.stock, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">CellsPeru</h5>
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
                  <Link href="/tienda" className="hover:text-white">
                    Tienda
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
            <p>&copy; 2025 CellsPeru. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
