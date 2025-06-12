"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Star,
  Menu,
  User,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  Truck,
  DollarSign,
  MapPin,
  Mail,
} from "lucide-react"
import { CartSidebar } from "@/components/cart/cart-sidebar"

// Import CSS files
import "../styles/global-variables.css"
import "../styles/banner-section.css"
import "../styles/product-tabs.css"

// Datos simulados para las categorías (tabla maestro)
const categories = [
  {
    id: 1,
    name: "iPhone",
    description: "Los últimos modelos de Apple",
    image: "/iphone-categoria.pgn.webp",
    productCount: 8,
    featured: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy",
    description: "Tecnología Android avanzada",
    image: "/galaxy-categoria.webp",
    productCount: 12,
    featured: true,
  },
  {
    id: 3,
    name: "Xiaomi",
    description: "Calidad y precio excepcional",
    image: "/xiaomi-categoria.png",
    productCount: 15,
    featured: false,
  },
]

// Datos para el carrusel
const carouselSlides = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    subtitle: "El poder de la innovación",
    description: "Experimenta la tecnología más avanzada con el nuevo iPhone 14 Pro Max",
    watermarkImage: "/carousel/iphone-16.png",
    buttonText: "Ver iPhone",
    buttonLink: "/categoria/1",
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    subtitle: "Redefiniendo la excelencia",
    description: "Descubre las capacidades ilimitadas del Galaxy S24 Ultra",
    watermarkImage: "/carousel/s24-ultra.png",
    buttonText: "Ver Samsung",
    buttonLink: "/categoria/2",
  },
  {
    id: 3,
    title: "Xiaomi 14 Ultra",
    subtitle: "Fotografía profesional",
    description: "Captura momentos únicos con la cámara Leica del Xiaomi 14 Ultra",
    watermarkImage: "/carousel/14-ultra.png",
    buttonText: "Ver Xiaomi",
    buttonLink: "/categoria/3",
  },
]

// Productos para las diferentes pestañas
const bestSellerProducts = [
  {
    id: 1,
    name: "Microware 9 Cap DualSense Wireless Controller",
    price: 200,
    originalPrice: null,
    image: "/play-station.jpg",
    rating: 5,
    category: "Gaming",
  },
  {
    id: 2,
    name: "Google Home Smart Voice Activated Speaker",
    price: 300,
    originalPrice: null,
    image: "/parlante.jpg",
    rating: 5,
    category: "Smart Home",
  },
  {
    id: 3,
    name: "Logitech M350 WHITE Optical Wireless Mouse",
    price: 299,
    originalPrice: null,
    image: "/mouse.jpg",
    rating: 5,
    category: "Accessories",
  },
  {
    id: 4,
    name: "Raptag Screen Guard For Rrr-Apple Watch Series",
    price: 1800,
    originalPrice: 2000,
    image: "/reloj.jpg",
    rating: 4,
    category: "Accessories",
    countdown: { days: 624, hours: 17, minutes: 41, seconds: 12 },
    discount: "-5%",
  },
  {
    id: 5,
    name: "Lenovo Tab M9 Tablet 4 GB RAM 64 GB",
    price: 144,
    originalPrice: 150,
    image: "/tablet.jpg",
    rating: 5,
    category: "Tablets",
    hasOptions: true,
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState("best-seller")

  // Auto-play del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium">
                ABOUT US
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 font-medium">
                BLOG
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                CONTACT US
              </Link>
              <Link href="/faqs" className="text-gray-600 hover:text-gray-900 font-medium">
                FAQS
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                LOGIN / REGISTER
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
              <div className="flex items-center space-x-2">
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
                <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
              </Link>
              <Link href="/tienda" className="text-white hover:text-yellow-400 font-medium flex items-center">
                SHOP
                <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
              </Link>
              <Link href="/categories" className="text-white hover:text-yellow-400 font-medium flex items-center">
                CATEGORIES
                <Badge className="ml-2 bg-emerald-500 text-white text-xs">SALE</Badge>
                <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
              </Link>
              <Link href="/productos" className="text-white hover:text-yellow-400 font-medium flex items-center">
                PRODUCTS
                <Badge className="ml-2 bg-red-500 text-white text-xs">HOT</Badge>
                <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
              </Link>
              <Link href="/deals" className="text-white hover:text-yellow-400 font-medium flex items-center">
                TOP DEALS
                <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
              </Link>
              <Link href="/elements" className="text-white hover:text-yellow-400 font-medium flex items-center">
                ELEMENTS
                <ChevronLeft className="h-4 w-4 ml-1 rotate-90" />
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

      {/* Benefits Section */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Reward */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">UPTO 5% REWARD</h4>
                <p className="text-gray-600">At vero eos et accusamus dignissimos</p>
              </div>
            </div>

            {/* Delivery Schedule */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">DELIVERY SCHEDULE</h4>
                <p className="text-gray-600">At vero eos et accusamus dignissimos</p>
              </div>
            </div>

            {/* Same Day Shipping */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">SAME DAY SHIPPING</h4>
                <p className="text-gray-600">At vero eos et accusamus dignissimos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            {/* Fondo blanco base */}
            <div className="absolute inset-0 bg-white" />

            {/* Imagen de marca de agua como fondo */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: `url(${slide.watermarkImage})`,
                backgroundPosition: "center right",
                backgroundSize: "cover",
              }}
            />

            {/* Overlay oscuro sutil para mejorar legibilidad del texto */}
            <div className="absolute inset-0 bg-black/10" />

            {/* Contenido centrado */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center text-gray-900 space-y-8 max-w-4xl mx-auto">
                  <div className="space-y-6">
                    <p className="carousel-subtitle text-xl md:text-2xl font-medium text-gray-700 tracking-wide">
                      {slide.subtitle}
                    </p>
                    <h2 className="carousel-title text-6xl md:text-8xl font-black leading-none tracking-tight text-gray-900">
                      {slide.title}
                    </h2>
                    <p className="carousel-description text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href={slide.buttonLink}>
                      <Button
                        size="lg"
                        className="carousel-button bg-blue-600 text-white hover:bg-blue-700 px-12 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {slide.buttonText}
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="carousel-button border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      Ver Ofertas
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 text-gray-900 p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg z-20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 text-gray-900 p-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg z-20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gray-900 scale-125 shadow-lg"
                  : "bg-gray-400 hover:bg-gray-600 hover:scale-110"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Banner Section - Simplified WordPress Structure */}
      <section className="banner-section">
        <div className="banner-container">
          {/* Left Banner - Smart Phone */}
          <div className="banner-column">
            <Link href="#" className="banner-image-link">
              <Image src="/banner02-1.jpg" alt="Smart Phone Banner" width={585} height={210} className="banner-image" />
            </Link>

            <h6 className="banner-trending">Trending</h6>

            <h3 className="banner-heading">
              The Best Smart
              <br />
              Phone's
            </h3>

            <Link href="#" className="banner-button">
              SHOP NOW
            </Link>
          </div>

          {/* Right Banner - TV */}
          <div className="banner-column">
            <Link href="#" className="banner-image-link">
              <Image src="/banner03-1.jpg" alt="4K TV Banner" width={585} height={210} className="banner-image" />
            </Link>

            <h6 className="banner-trending">Trending</h6>

            <h3 className="banner-heading">
              Buy Ultra HD 4K
              <br />
              TVs Online
            </h3>

            <Link href="#" className="banner-button">
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="product-tabs-section">
        <div className="product-tabs-container">
          <div className="tabs-navigation">
            <div className="tabs-list">
              <button
                className={`tab-trigger ${activeTab === "best-seller" ? "bg-[#ff6b7a] text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("best-seller")}
              >
                BEST SELLER
              </button>
              <button
                className={`tab-trigger ${activeTab === "featured" ? "bg-[#ff6b7a] text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("featured")}
              >
                FEATURED
              </button>
              <button
                className={`tab-trigger ${activeTab === "top-rated" ? "bg-[#ff6b7a] text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setActiveTab("top-rated")}
              >
                TOP RATED
              </button>
            </div>

            <div className="tabs-arrows">
              <button className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {activeTab === "best-seller" && (
            <div className="products-grid">
              {bestSellerProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {product.discount && <div className="product-discount-badge">{product.discount}</div>}

                  <div className="product-content">
                    <div className="product-image-container">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="product-image"
                      />
                    </div>

                    <h4 className="product-title">{product.name}</h4>

                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`star-icon ${i < product.rating ? "star-filled" : "star-empty"}`} />
                      ))}
                    </div>

                    <div className="product-price-container">
                      <div>
                        <span className="product-price">${product.price}</span>
                        {product.originalPrice && (
                          <span className="product-original-price">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    {product.countdown && (
                      <div className="countdown-timer">
                        <div className="countdown-item">
                          <div className="countdown-number">{product.countdown.days}</div>
                          <div className="countdown-label">DAYS</div>
                        </div>
                        <div className="countdown-item">
                          <div className="countdown-number">{product.countdown.hours}</div>
                          <div className="countdown-label">HRS</div>
                        </div>
                        <div className="countdown-item">
                          <div className="countdown-number">{product.countdown.minutes}</div>
                          <div className="countdown-label">MIN</div>
                        </div>
                        <div className="countdown-item">
                          <div className="countdown-number">{product.countdown.seconds}</div>
                          <div className="countdown-label">SEC</div>
                        </div>
                      </div>
                    )}

                    <button className="product-button">{product.hasOptions ? "SELECT OPTIONS" : "ADD TO CART"}</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "featured" && (
            <div className="products-grid">
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 0", color: "#888888" }}>
                Featured products will be displayed here
              </div>
            </div>
          )}

          {activeTab === "top-rated" && (
            <div className="products-grid">
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 0", color: "#888888" }}>
                Top rated products will be displayed here
              </div>
            </div>
          )}
        </div>
      </section>

      {/* From Our Blog Section (reemplazando Categorías Principales) */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Línea horizontal arriba del título */}
          <div className="w-full border-t border-gray-300 mb-4"></div>

          <div className="flex items-center justify-between mb-8">
            <h3
              className="text-[18px] font-semibold text-black tracking-normal"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              FROM OUR BLOG
            </h3>
            <div className="flex space-x-2">
              <button className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Artículo 1 - Usando la primera imagen de categorías */}
            <div className="group">
              <div className="relative overflow-hidden mb-6">
                <Image
                  src={categories[0].image || "/placeholder.svg"}
                  alt="Blog post image"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-rose-500" style={{ fontFamily: "sans-serif" }}>
                  <span>February 9, 2024</span>
                  <span className="mx-2">•</span>
                  <span>by Editor</span>
                </div>
                <h4
                  className="text-xl font-bold text-gray-900 group-hover:text-[#ff6b7a] transition-colors cursor-pointer"
                  style={{ fontFamily: "sans-serif" }}
                >
                  How to Write a Blog Post Your Readers Will Love in 5 Steps
                </h4>
                <p className="text-gray-600" style={{ fontFamily: "sans-serif" }}>
                  Why the world would end without {categories[0].name}. The 16 worst songs about smartphone deals...
                </p>
              </div>
            </div>

            {/* Artículo 2 - Usando la segunda imagen de categorías */}
            <div className="group">
              <div className="relative overflow-hidden mb-6">
                <Image
                  src={categories[1].image || "/placeholder.svg"}
                  alt="Blog post image"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-rose-500" style={{ fontFamily: "sans-serif" }}>
                  <span>February 7, 2024</span>
                  <span className="mx-2">•</span>
                  <span>by Editor</span>
                </div>
                <h4
                  className="text-xl font-bold text-gray-900 group-hover:text-[#ff6b7a] transition-colors cursor-pointer"
                  style={{ fontFamily: "sans-serif" }}
                >
                  9 Content Marketing Trends and Ideas to Increase Traffic
                </h4>
                <p className="text-gray-600" style={{ fontFamily: "sans-serif" }}>
                  Why do people think {categories[1].name} are a good idea? Unbelievable cool tech gadget success...
                </p>
              </div>
            </div>

            {/* Artículo 3 - Usando la tercera imagen de categorías */}
            <div className="group">
              <div className="relative overflow-hidden mb-6">
                <Image
                  src={categories[2].image || "/placeholder.svg"}
                  alt="Blog post image"
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-rose-500" style={{ fontFamily: "sans-serif" }}>
                  <span>February 5, 2024</span>
                  <span className="mx-2">•</span>
                  <span>by Editor</span>
                </div>
                <h4
                  className="text-xl font-bold text-gray-900 group-hover:text-[#ff6b7a] transition-colors cursor-pointer"
                  style={{ fontFamily: "sans-serif" }}
                >
                  The Ultimate Guide to Marketing Strategies to Improve Sales
                </h4>
                <p className="text-gray-600" style={{ fontFamily: "sans-serif" }}>
                  Many things about {categories[2].name} your kids don't want you to know. How storage devices...
                </p>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-200 mt-16"></div>
        </div>
      </section>

      {/* Footer - Brand Logos Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {/* Logo 1 */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 50 50" className="h-10 w-10 text-blue-500">
                <circle cx="10" cy="10" r="5" fill="currentColor" opacity="0.8" />
                <circle cx="25" cy="10" r="5" fill="currentColor" opacity="0.8" />
                <circle cx="10" cy="25" r="5" fill="currentColor" opacity="0.8" />
                <circle cx="25" cy="25" r="5" fill="currentColor" opacity="0.8" />
              </svg>
            </div>

            {/* Logo 2 */}
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold">
                <span className="text-emerald-500">digi</span>
                <span className="text-gray-800">smart</span>
              </span>
            </div>

            {/* Logo 3 */}
            <div className="flex items-center justify-center">
              <div className="relative h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Logo 4 */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  <div className="h-2 w-2 bg-orange-500"></div>
                  <div className="h-2 w-2 bg-orange-500"></div>
                  <div className="h-2 w-2 bg-orange-500"></div>
                </div>
                <div className="flex gap-0.5">
                  <div className="h-2 w-2 bg-orange-500"></div>
                  <div className="h-2 w-2 bg-orange-500"></div>
                  <div className="h-2 w-2 bg-orange-500"></div>
                </div>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800">TECHLOGO</span>
            </div>

            {/* Logo 5 */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-cyan-500">
                <circle cx="12" cy="4" r="3" fill="currentColor" />
                <circle cx="4" cy="12" r="3" fill="currentColor" />
                <circle cx="20" cy="12" r="3" fill="currentColor" />
                <circle cx="12" cy="20" r="3" fill="currentColor" />
                <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="1" />
                <line x1="4" y1="12" x2="12" y2="20" stroke="currentColor" strokeWidth="1" />
                <line x1="12" y1="20" x2="20" y2="12" stroke="currentColor" strokeWidth="1" />
                <line x1="20" y1="12" x2="12" y2="4" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>

            {/* Logo 6 */}
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">PENTAX</span>
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
              <a href="#" className="text-white hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
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
