"use client"

import React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Clock, Truck, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Menu, User, Phone, ShoppingCart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from "axios"

// Si estás probando en v0 o desplegando, CAMBIA esta URL a la URL pública de tu API PHP.
const API_URL = "https://giancarlo.alwaysdata.net/pedidos.php"

interface DetallePedido {
  idproducto: number
  producto: string
  precio: number
  cantidad: number
}

interface Pedido {
  idpedido: number
  numero_pedido: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  cliente_ciudad: string
  fecha_pedido: string
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado"
  metodo_pago: string
  detalle: DetallePedido[]
}

interface ApiResponse {
  total: number
  pedidos: Pedido[]
  message?: string
  debug_info?: any
}

const estadoColors = {
  pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  procesando: "bg-blue-100 text-blue-800 border-blue-200",
  enviado: "bg-purple-100 text-purple-800 border-purple-200",
  entregado: "bg-green-100 text-green-800 border-green-200",
  cancelado: "bg-red-100 text-red-800 border-red-200",
}

const estadoIcons = {
  pendiente: Clock,
  procesando: Package,
  enviado: Truck,
  entregado: CheckCircle,
  cancelado: XCircle,
}

const metodoPagoLabels = {
  tarjeta_credito: "Tarjeta de Crédito",
  tarjeta_debito: "Tarjeta de Débito",
  paypal: "PayPal",
  transferencia: "Transferencia",
  efectivo: "Efectivo",
}

// Componentes de loading
const TableLoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Cargando Pedidos</h3>
    <p className="text-gray-500">Obteniendo datos del servidor...</p>
  </div>
)

const LoadingMoreSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">Cargando más pedidos...</span>
  </div>
)

export default function PedidosPage() {
  // Estados principales
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([]) // Todos los pedidos cargados
  const [displayedPedidos, setDisplayedPedidos] = useState<Pedido[]>([]) // Pedidos mostrados
  const [totalRecords, setTotalRecords] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("fecha_pedido")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [connectionError, setConnectionError] = useState(false)

  // Estados para lazy loading
  const [itemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Estados para Maestro-Detalles
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null)
  const [currentDetalles, setCurrentDetalles] = useState<DetallePedido[]>([])
  const [currentTotalGeneral, setCurrentTotalGeneral] = useState(0)

  // Ref para el observer
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPedidoElementRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (loading || loadingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePedidos()
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore],
  )

  // Función para cargar todos los pedidos desde la API
  const fetchAllPedidos = async () => {
    setLoading(true)
    setError(null)
    setConnectionError(false)

    try {
      const params = {
        sort_by: sortBy,
        sort_order: sortOrder.toUpperCase(),
      }

      console.log(`Solicitando datos con URL: ${API_URL}`)
      const response = await axios.get(API_URL, {
        params,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      const data: ApiResponse = response.data
      console.log("Respuesta de la API:", data)

      if (data && Array.isArray(data.pedidos)) {
        setAllPedidos(data.pedidos)
        setTotalRecords(data.total)

        // Mostrar los primeros 20 pedidos
        const firstPage = data.pedidos.slice(0, itemsPerPage)
        setDisplayedPedidos(firstPage)
        setCurrentPage(1)
        setHasMore(data.pedidos.length > itemsPerPage)

        console.log(`Datos cargados: ${data.pedidos.length} pedidos totales, mostrando ${firstPage.length}`)
      } else {
        throw new Error(data.message || "Error desconocido o formato de respuesta inesperado al cargar los pedidos")
      }
    } catch (err) {
      console.error("Error detallado al cargar pedidos:", err)
      setConnectionError(true)

      let errorMessage = "Error al cargar los pedidos"

      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED" || err.message?.includes("Network Error")) {
          errorMessage = `No se pudo conectar con el servicio web en: ${API_URL}. Asegúrate de que el servidor PHP esté corriendo y la URL sea correcta.`
        } else if (err.response) {
          errorMessage = `Error HTTP: ${err.response.status} - ${err.response.statusText}. Respuesta: ${JSON.stringify(err.response.data)}`
        } else {
          errorMessage = `Error: ${err.message}`
        }
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`
      }

      setError(errorMessage)
      setAllPedidos([])
      setDisplayedPedidos([])
      setTotalRecords(null)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar más pedidos (lazy loading)
  const loadMorePedidos = () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)

    // Simular un pequeño delay para mostrar el loading
    setTimeout(() => {
      const nextPage = currentPage + 1
      const startIndex = (nextPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage

      const nextItems = allPedidos.slice(startIndex, endIndex)

      if (nextItems.length > 0) {
        setDisplayedPedidos((prev) => [...prev, ...nextItems])
        setCurrentPage(nextPage)

        // Verificar si hay más elementos
        setHasMore(endIndex < allPedidos.length)
      } else {
        setHasMore(false)
      }

      setLoadingMore(false)
    }, 500) // Delay de 500ms para simular carga
  }

  // Manejar click en fila para expandir/contraer
  const handleRowClick = (pedidoId: number) => {
    if (expandedPedido === pedidoId) {
      setExpandedPedido(null)
      setCurrentDetalles([])
      setCurrentTotalGeneral(0)
    } else {
      const selectedPedido = displayedPedidos.find((p) => p.idpedido === pedidoId)
      if (selectedPedido) {
        setCurrentDetalles(selectedPedido.detalle)
        const calculatedTotal = selectedPedido.detalle.reduce(
          (sum, item) => sum + Number.parseFloat(item.precio.toString()) * item.cantidad,
          0,
        )
        setCurrentTotalGeneral(calculatedTotal)
        setExpandedPedido(pedidoId)
      }
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const handleRetry = () => {
    fetchAllPedidos()
  }

  const formatCurrency = (amount: number) => {
    return `S/ ${Math.round(amount)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  useEffect(() => {
    fetchAllPedidos()
  }, [sortBy, sortOrder])

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
                INICIO
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/tienda" className="text-white hover:text-yellow-400 font-medium flex items-center">
                TIENDA
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/marcas" className="text-white hover:text-yellow-400 font-medium flex items-center">
                MARCAS
                <Badge className="ml-2 bg-emerald-500 text-white text-xs">SALE</Badge>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/pedidos" className="text-yellow-400 hover:text-yellow-400 font-medium flex items-center">
                PEDIDOS
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

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6 mt-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
            <p className="text-muted-foreground">
              Haz clic en el pedido para ver los detalles
            </p>
          </div>
          {error && (
            <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Reintentar Conexión
            </Button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Error de Conexión con el Servicio Web</p>
                <p className="text-sm">{error}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Button onClick={handleRetry} variant="outline" size="sm" className="bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tabla de Pedidos con Lazy Loading */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Lista de Pedidos</CardTitle>
            <CardDescription className="text-right">
              {totalRecords !== null
                ? `Mostrando ${displayedPedidos.length} de ${totalRecords} pedidos`
                : "Conectando con el servicio web de pedidos..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <TableLoadingSpinner />
            ) : displayedPedidos.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center w-12"></TableHead>
                        <TableHead className="text-center">#</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 text-center"
                          onClick={() => handleSort("numero_pedido")}
                        >
                          Número de Pedido
                          {sortBy === "numero_pedido" && (
                            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                          )}
                        </TableHead>
                        <TableHead className="text-center">Cliente</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 text-center"
                          onClick={() => handleSort("fecha_pedido")}
                        >
                          Fecha
                          {sortBy === "fecha_pedido" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 text-center"
                          onClick={() => handleSort("estado")}
                        >
                          Estado
                          {sortBy === "estado" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                        </TableHead>
                        <TableHead className="text-center">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Ciudad
                        </TableHead>
                        <TableHead className="text-center">Método de Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedPedidos.map((pedido, index) => {
                        const EstadoIcon = estadoIcons[pedido.estado]
                        const isExpanded = expandedPedido === pedido.idpedido
                        const isLast = index === displayedPedidos.length - 1

                        return (
                          <React.Fragment key={pedido.idpedido}>
                            {/* FILA PRINCIPAL DEL PEDIDO */}
                            <TableRow
                              ref={isLast ? lastPedidoElementRef : null}
                              className="hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleRowClick(pedido.idpedido)}
                            >
                              <TableCell className="text-center">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                              </TableCell>
                              <TableCell className="text-center font-mono text-sm">{index + 1}</TableCell>
                              <TableCell className="font-medium text-center">{pedido.numero_pedido}</TableCell>
                              <TableCell className="text-center">
                                <div>
                                  <div className="font-medium">{pedido.cliente_nombre}</div>
                                  <div className="text-sm text-muted-foreground">{pedido.cliente_email}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">{formatDate(pedido.fecha_pedido)}</TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className={`${estadoColors[pedido.estado]} flex items-center gap-1 w-fit mx-auto`}
                                >
                                  <EstadoIcon className="h-3 w-3" />
                                  {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                <div className="flex items-center justify-center gap-1">
                                  <MapPin className="h-3 w-3 text-gray-500" />
                                  {pedido.cliente_ciudad}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {metodoPagoLabels[pedido.metodo_pago as keyof typeof metodoPagoLabels] ||
                                  pedido.metodo_pago}
                              </TableCell>
                            </TableRow>

                            {/* FILA EXPANDIDA CON DETALLES */}
                            {isExpanded && (
                              <TableRow>
                                <TableCell colSpan={8} className="p-0">
                                  <div className="bg-gray-50 border-t border-gray-200">
                                    <div className="p-4">
                                      <h4 className="font-semibold text-lg mb-3 text-blue-700">
                                        📦 Detalles del Pedido #{pedido.numero_pedido}
                                      </h4>
                                      {currentDetalles.length > 0 ? (
                                        <div className="bg-white rounded-lg border">
                                          <Table>
                                            <TableHeader>
                                              <TableRow className="bg-blue-50">
                                                <TableHead className="text-center font-semibold">Código</TableHead>
                                                <TableHead className="text-center font-semibold">Producto</TableHead>
                                                <TableHead className="text-center font-semibold">Precio</TableHead>
                                                <TableHead className="text-center font-semibold">Cantidad</TableHead>
                                                <TableHead className="text-center font-semibold">Subtotal</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {currentDetalles.map((detalle) => (
                                                <TableRow key={detalle.idproducto} className="hover:bg-gray-50">
                                                  <TableCell className="text-center font-mono">
                                                    {detalle.idproducto}
                                                  </TableCell>
                                                  <TableCell className="text-center font-medium">
                                                    {detalle.producto}
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    {formatCurrency(detalle.precio)}
                                                  </TableCell>
                                                  <TableCell className="text-center font-semibold">
                                                    {detalle.cantidad}
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    {formatCurrency(detalle.precio * detalle.cantidad)}
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                              {/* FILA DE TOTAL */}
                                              <TableRow className="bg-green-50 border-t-2 border-green-200">
                                                <TableCell colSpan={4} className="text-right font-bold text-lg">
                                                  TOTAL GENERAL:
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-lg text-green-700">
                                                  {formatCurrency(currentTotalGeneral)}
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 text-gray-500">
                                          No se encontraron productos para este pedido
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Loading más pedidos */}
                {loadingMore && <LoadingMoreSpinner />}

                {/* Mensaje cuando no hay más pedidos */}
                {!hasMore && displayedPedidos.length > 0 && (
                  <div className="text-center py-4 text-gray-500 border-t">
                    <p className="font-medium">✅ Todos los pedidos han sido cargados</p>
                    <p className="text-sm">
                      Total: {displayedPedidos.length} de {totalRecords} pedidos
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {connectionError ? "No se pudo conectar con el servicio web" : "No hay pedidos disponibles"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {connectionError
                    ? "Verifica que tu servidor PHP esté ejecutándose y la URL sea correcta."
                    : "Aún no se han realizado pedidos."}
                </p>
                {connectionError && (
                  <div className="space-y-2">
                    <Button onClick={handleRetry} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Intentar Conectar
                    </Button>
                    <p className="text-xs text-gray-400">Servicio: {API_URL}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
