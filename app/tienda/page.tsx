"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Menu,
  Search,
  User,
  Phone,
  MapPin,
  Mail,
  ChevronDown,
  Grid,
  List,
  Star,
  Eye,
  Heart,
  Minus,
} from "lucide-react"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { ProductPreviewModal } from "@/components/product/product-preview-modal"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/hooks/use-toast"

// Datos simulados para la galería 5x5 (25 imágenes) - DATOS FIJOS para evitar hidratación
const galleryImages = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    image: "/placeholder.svg?height=300&width=300&text=iPhone+15+Pro",
    price: 1199,
    originalPrice: 1299,
    category: "smartphones",
    brand: "apple",
    inStock: true,
    featured: true,
    discount: 8,
    rating: 4.5,
    features: ["256GB", "Titanio Natural", "Cámara 48MP"],
  },
  {
    id: 2,
    title: "Samsung Galaxy S24",
    image: "/placeholder.svg?height=300&width=300&text=Samsung+Galaxy+S24",
    price: 999,
    originalPrice: 1099,
    category: "smartphones",
    brand: "samsung",
    inStock: true,
    featured: false,
    discount: 9,
    rating: 4.3,
    features: ["256GB", "Negro", "Cámara 50MP"],
  },
  {
    id: 3,
    title: "Xiaomi 14 Ultra",
    image: "/placeholder.svg?height=300&width=300&text=Xiaomi+14+Ultra",
    price: 899,
    originalPrice: 999,
    category: "smartphones",
    brand: "xiaomi",
    inStock: true,
    featured: true,
    discount: 10,
    rating: 4.7,
    features: ["512GB", "Negro", "Cámara Leica"],
  },
  {
    id: 4,
    title: "iPhone 14",
    image: "/placeholder.svg?height=300&width=300&text=iPhone+14",
    price: 799,
    originalPrice: 899,
    category: "smartphones",
    brand: "apple",
    inStock: false,
    featured: false,
    discount: 11,
    rating: 4.2,
    features: ["128GB", "Azul", "Cámara 12MP"],
  },
  {
    id: 5,
    title: "Galaxy A54",
    image: "/placeholder.svg?height=300&width=300&text=Galaxy+A54",
    price: 449,
    originalPrice: 499,
    category: "smartphones",
    brand: "samsung",
    inStock: true,
    featured: false,
    discount: 10,
    rating: 4.0,
    features: ["128GB", "Negro", "Cámara 50MP"],
  },
  {
    id: 6,
    title: "Redmi Note 13",
    image: "/placeholder.svg?height=300&width=300&text=Redmi+Note+13",
    price: 299,
    originalPrice: 349,
    category: "smartphones",
    brand: "xiaomi",
    inStock: true,
    featured: true,
    discount: 14,
    rating: 4.4,
    features: ["256GB", "Azul", "Carga 67W"],
  },
  {
    id: 7,
    title: "Funda iPhone",
    image: "/placeholder.svg?height=300&width=300&text=Funda+iPhone",
    price: 29,
    originalPrice: 35,
    category: "accesorios",
    brand: "apple",
    inStock: true,
    featured: false,
    discount: 17,
    rating: 4.1,
    features: ["Silicona", "Transparente", "Anti-golpes"],
  },
  {
    id: 8,
    title: "Cargador USB-C",
    image: "/placeholder.svg?height=300&width=300&text=Cargador+USB-C",
    price: 39,
    originalPrice: 49,
    category: "accesorios",
    brand: "samsung",
    inStock: true,
    featured: false,
    discount: 20,
    rating: 4.3,
    features: ["20W", "Carga rápida", "Cable incluido"],
  },
  {
    id: 9,
    title: "AirPods Pro",
    image: "/placeholder.svg?height=300&width=300&text=AirPods+Pro",
    price: 249,
    originalPrice: 279,
    category: "accesorios",
    brand: "apple",
    inStock: true,
    featured: true,
    discount: 11,
    rating: 4.8,
    features: ["Cancelación ruido", "Estuche carga", "Bluetooth 5.0"],
  },
  {
    id: 10,
    title: "Galaxy Buds",
    image: "/placeholder.svg?height=300&width=300&text=Galaxy+Buds",
    price: 149,
    originalPrice: 179,
    category: "accesorios",
    brand: "samsung",
    inStock: true,
    featured: false,
    discount: 17,
    rating: 4.2,
    features: ["Inalámbricos", "Resistente agua", "8h batería"],
  },
  {
    id: 11,
    title: "iPhone 13",
    image: "/placeholder.svg?height=300&width=300&text=iPhone+13",
    price: 699,
    originalPrice: 799,
    category: "smartphones",
    brand: "apple",
    inStock: true,
    featured: false,
    discount: 13,
    rating: 4.4,
    features: ["128GB", "Rosa", "Cámara dual"],
  },
  {
    id: 12,
    title: "Galaxy S23",
    image: "/placeholder.svg?height=300&width=300&text=Galaxy+S23",
    price: 799,
    originalPrice: 899,
    category: "smartphones",
    brand: "samsung",
    inStock: true,
    featured: false,
    discount: 11,
    rating: 4.5,
    features: ["256GB", "Verde", "Cámara 50MP"],
  },
]

// Colores para el filtro
const filterColors = [
  { name: "Negro", value: "black", color: "#000000" },
  { name: "Azul", value: "blue", color: "#3B82F6" },
  { name: "Marrón", value: "brown", color: "#D2691E" },
  { name: "Gris", value: "gray", color: "#808080" },
  { name: "Verde", value: "green", color: "#008000" },
  { name: "Naranja", value: "orange", color: "#FFA500" },
  { name: "Rosa", value: "pink", color: "#FFC0CB" },
  { name: "Rosa claro", value: "lightpink", color: "#FFB6C1" },
  { name: "Morado", value: "purple", color: "#800080" },
  { name: "Rojo", value: "red", color: "#FF0000" },
  { name: "Gris claro", value: "lightgray", color: "#D3D3D3" },
  { name: "Celeste", value: "lightblue", color: "#87CEEB" },
]

export default function TiendaPage() {
  const [images, setImages] = useState(galleryImages)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedHighlight, setSelectedHighlight] = useState("All Products")
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("default")
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCart()

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Cargar imágenes automáticamente al iniciar
  useEffect(() => {
    if (mounted) {
      loadImagesFromPHP()
    }
  }, [mounted])

  // Función para cargar imágenes desde PHP
  const loadImagesFromPHP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://giancarlo.alwaysdata.net/imagenes.php");
      const result = await response.json();

      if (result.success && result.data) {
        const convertedImages = result.data.map((item: any) => {
          // Extraer solo el nombre del archivo
          const imageName = item.image.split("/").pop();

          return {
            id: item.id,
            title: item.title || item.titulo,
            image: `https://giancarlo.alwaysdata.net/images/${imageName}`,
            price: item.precio,
            originalPrice: item.precio * 1.2,
            category: item.categoria || "smartphones",
            brand: item.marca || "apple",
            inStock: true,
            featured: item.destacado || false,
            discount: Math.floor(Math.random() * 20) + 5,
            rating: 4 + Math.random(),
            features: item.features || ["Producto", "De calidad", "Garantía"],
          };
        });

        setImages(convertedImages);
        console.log("✅ Imágenes cargadas desde PHP:", convertedImages.length);
      } else {
        console.error("❌ Error en respuesta PHP:", result.message);
      }
    } catch (error) {
      console.error("❌ Error cargando desde PHP:", error);
    } finally {
      setIsLoading(false);
    }
  };



  // Filtrar imágenes
  const filteredImages = images.filter((image) => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "" || image.category === selectedCategory
    const matchesBrand = selectedBrand === "" || image.brand === selectedBrand
    const matchesHighlight =
      selectedHighlight === "All Products" ||
      (selectedHighlight === "Best Seller" && image.featured) ||
      (selectedHighlight === "Sale" && image.discount > 15) ||
      (selectedHighlight === "Hot Items" && image.rating > 4.5)

    return matchesSearch && matchesCategory && matchesBrand && matchesHighlight
  })

  // Obtener categorías y marcas únicas
  const categories = [...new Set(images.map((img) => img.category))]
  const brands = [...new Set(images.map((img) => img.brand))]

  // Renderizar estrellas
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  // No renderizar hasta que esté montado para evitar hidratación
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                ABOUT US
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                BLOG
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                CONTACT US
              </Link>
              <Link href="/faqs" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                FAQS
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">
                LOGIN / REGISTER
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#f0f0f0] shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">BRANCHY</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">CALL US NOW :</div>
                <div className="text-sm text-gray-600">Toll Free : 0123-456-789</div>
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900">MY CART</div>
                  <div className="text-sm text-gray-600">0 Item</div>
                </div>
              </div>
              <CartSidebar />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            {/* Menu Button */}
            <div className="bg-yellow-400 h-14 flex items-center px-4 mr-6">
              <Menu className="h-5 w-5 text-gray-800" />
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8 flex-1">
              <Link href="/" className="text-white hover:text-yellow-400 font-medium flex items-center">
                HOME
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/tienda" className="text-yellow-400 hover:text-yellow-400 font-medium flex items-center">
                SHOP
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/categories" className="text-white hover:text-yellow-400 font-medium flex items-center">
                CATEGORIES
                <Badge className="ml-2 bg-emerald-500 text-white text-xs">SALE</Badge>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/productos" className="text-white hover:text-yellow-400 font-medium flex items-center">
                PRODUCTS
                <Badge className="ml-2 bg-red-500 text-white text-xs">HOT</Badge>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/deals" className="text-white hover:text-yellow-400 font-medium flex items-center">
                TOP DEALS
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/elements" className="text-white hover:text-yellow-400 font-medium flex items-center">
                ELEMENTS
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-64 pr-4 pl-4 py-2 bg-white border-0 rounded-none h-10"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-none font-semibold h-10">
                SEARCH
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb Navigation */}
      <section className="bg-[#f0f0f0] py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-sm text-gray-600 mb-2">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>{" "}
              / Shop
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar - Más estrecho */}
            <div className="w-64">
              {/* Shop By Categories */}
              <div className="bg-white border border-gray-200 mb-6">
                <div className="bg-white border-l-4 border-teal-500 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Shop By Categories</h3>
                  <Minus className="h-4 w-4 text-gray-600" />
                </div>
                <div className="px-4 py-2">
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-50 ${selectedCategory === "" ? "text-gray-800" : "text-gray-600"
                        }`}
                    >
                      Our Store ({images.length})
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-50 capitalize ${selectedCategory === category ? "text-gray-800" : "text-gray-600"
                          }`}
                      >
                        {category} ({images.filter((img) => img.category === category).length})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlight */}
              <div className="bg-white border border-gray-200 mb-6">
                <div className="bg-white border-l-4 border-teal-500 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Highlight</h3>
                  <Minus className="h-4 w-4 text-gray-600" />
                </div>
                <div className="px-4 py-2">
                  <div className="space-y-1">
                    {["All Products", "Best Seller", "New Arrivals", "Sale", "Hot Items"].map((highlight) => (
                      <button
                        key={highlight}
                        onClick={() => setSelectedHighlight(highlight)}
                        className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-50 ${selectedHighlight === highlight ? "text-red-500 font-medium" : "text-gray-600"
                          }`}
                      >
                        {highlight}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter by Color */}
              <div className="bg-white border border-gray-200">
                <div className="bg-white border-l-4 border-teal-500 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Filter by Color</h3>
                  <Minus className="h-4 w-4 text-gray-600" />
                </div>
                <div className="px-4 py-2">
                  <div className="grid grid-cols-4 gap-2">
                    {filterColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(selectedColor === color.value ? "" : color.value)}
                        className={`w-6 h-6 rounded border ${selectedColor === color.value ? "border-gray-800 border-2" : "border-gray-300"
                          }`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Area */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-600">
                  Showing 1-{filteredImages.length} of {filteredImages.length} results
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                  <div className="flex border border-gray-300 rounded">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-red-500 text-white" : "bg-white text-gray-600"}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-red-500 text-white" : "bg-white text-gray-600"}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid - Sin bordes, solo separados por líneas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-px gap-y-6 bg-white">
                {filteredImages.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 group hover:shadow-lg transition-shadow border-r border-gray-200 last:border-r-0"
                  >
                    <div className="flex flex-col h-full">
                      <div className="relative mb-4">
                        {item.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{item.discount}%
                          </div>
                        )}
                        <div className="aspect-square flex items-center justify-center relative group">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={200}
                            height={200}
                            className="max-w-full max-h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                              <ProductPreviewModal product={item}>
                                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </ProductPreviewModal>
                              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">{item.title}</h3>
                        <div className="flex items-center mb-2">{renderStars(item.rating)}</div>
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 text-sm py-2 mt-auto"
                        size="sm"
                        onClick={() => {
                          const product = {
                            id: item.id,
                            name: item.title,
                            price: item.price,
                            image: item.image,
                            category: item.category,
                          }
                          addItem(product)
                          toast({
                            title: "Producto agregado",
                            description: `${item.title} se agregó al carrito`,
                          })
                        }}
                      >
                        AGREGAR CARRITO
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredImages.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-600 mb-4">Intenta ajustar los filtros o términos de búsqueda</p>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-8 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-xl font-semibold text-white">SIGN UP NEWSLETTER</span>
            </div>

            <div className="flex flex-1 max-w-md mx-4">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full px-4 py-2 border-0 focus:ring-0 focus:outline-none"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 font-medium">
                SUBSCRIBE
              </button>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-white hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Brand Column */}
            <div className="pr-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-md flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">BRANCHY</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronictook a galley of type and scrambled it to
              </p>
            </div>

            {/* Vertical divider after first column */}
            <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300 hidden md:block"></div>

            {/* Help Column */}
            <div className="px-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">HELP</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Term & policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Delivery
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Vertical divider after second column */}
            <div className="absolute left-2/4 top-0 bottom-0 w-px bg-gray-300 hidden md:block"></div>

            {/* Info Column */}
            <div className="px-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">INFO</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    My cart
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Checkout
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    My account
                  </a>
                </li>
              </ul>
            </div>

            {/* Vertical divider after third column */}
            <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-300 hidden md:block"></div>

            {/* Contact Info Column */}
            <div className="pl-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">CONTACT INFO</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">
                    99 New Theme St. XY, USA 12345, Beside the Sun point land.
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">+00 123-456-789</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">demo@example.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section */}
      <div className="bg-gray-100 border-t border-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm mb-8 md:mb-0">
              © 2025 Branchy - Electronics - WordPress Theme by Avanam
            </div>
            <div className="flex items-center space-x-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                alt="Visa"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                alt="American Express"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png"
                alt="MasterCard"
                className="h-6"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
                alt="PayPal"
                className="h-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
