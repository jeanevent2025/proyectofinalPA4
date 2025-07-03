"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Package, Clock, Truck, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ChevronDown, Menu, User, Phone, ShoppingCart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// URL de tu servicio web
const API_URL = "http://localhost/celulares-api/api/pedidos.php"

interface Pedido {
  id: number
  numero_pedido: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  cliente_ciudad: string
  fecha_pedido: string
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado"
  subtotal: number
  impuestos: number
  total: number
  metodo_pago: string
  direccion_envio: string
  notas: string
  fecha_entrega_estimada: string
  record_number?: number
}

interface PaginationInfo {
  current_page: number
  per_page: number
  total_records: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
  next_page: number | null
  prev_page: number | null
}

interface ApiResponse {
  success: boolean
  data: Pedido[]
  pagination: PaginationInfo
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

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("fecha_pedido")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [connectionError, setConnectionError] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const fetchPedidos = async (page = 1) => {
    setLoading(true)
    setError(null)
    setConnectionError(false)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString(),
        sort_by: sortBy,
        sort_order: sortOrder,
      })

      console.log(`Solicitando página ${page} con URL: ${API_URL}?${params}`)

      const response = await fetch(`${API_URL}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()
      console.log("Respuesta de la API:", data)

      if (data.success) {
        setPedidos(data.data)
        setPagination(data.pagination)
        setCurrentPage(page)
        console.log(`Página ${page} cargada: ${data.data.length} registros`)
      } else {
        throw new Error(data.message || "Error desconocido al cargar los pedidos")
      }
    } catch (err) {
      console.error("Error detallado al cargar pedidos:", err)
      setConnectionError(true)

      let errorMessage = "Error al cargar los pedidos"

      if (err instanceof TypeError && err.message.includes("fetch")) {
        errorMessage = `No se pudo conectar con el servicio web en: ${API_URL}`
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`
      }

      setError(errorMessage)
      setPedidos([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidos(1)
  }, [sortBy, sortOrder, rowsPerPage])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && pagination && page <= pagination.total_pages) {
      console.log(`Cambiando a página ${page}`)
      fetchPedidos(page)
    }
  }

  const handleRetry = () => {
    fetchPedidos(currentPage)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header simplificado para loading */}
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando pedidos...</p>
              <p className="text-sm text-gray-500 mt-2">Página {currentPage}</p>
            </div>
          </div>
        </div>
      </div>
    )
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
              <Link href="/productos" className="text-white hover:text-yellow-400 font-medium flex items-center">
                PRODUCTOS
                <Badge className="ml-2 bg-red-500 text-white text-xs">HOT</Badge>
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
            <p className="text-muted-foreground">Administra y supervisa todos los pedidos de la tienda</p>
          </div>
          {error && (
            <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Reintentar Conexión
            </Button>
          )}
          <div className="flex items-center gap-3">
            <label htmlFor="rows-select" className="text-base font-medium text-gray-700">
              Número de filas:
            </label>
            <select
              id="rows-select"
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[80px]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
              <option value={35}>35</option>
              <option value={40}>40</option>
              <option value={45}>45</option>
              <option value={50}>50</option>
              <option value={55}>55</option>
            </select>
          </div>
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

        {/* Tabla de Pedidos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Lista de Pedidos</CardTitle>
            <CardDescription className="text-right">
              {pagination
                ? `Mostrando ${pedidos.length} de ${pagination.total_records} pedidos (Página ${pagination.current_page} de ${pagination.total_pages})`
                : "Conectando con el servicio web de pedidos..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pedidos.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50 text-center"
                          onClick={() => handleSort("total")}
                        >
                          Total
                          {sortBy === "total" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                        </TableHead>
                        <TableHead className="text-center">Método de Pago</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((pedido, index) => {
                        const EstadoIcon = estadoIcons[pedido.estado]
                        return (
                          <TableRow key={pedido.id} className="hover:bg-muted/50">
                            <TableCell className="text-center font-mono text-sm">
                              {pedido.record_number || (currentPage - 1) * 20 + index + 1}
                            </TableCell>
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
                            <TableCell className="text-center font-medium">{formatCurrency(pedido.total)}</TableCell>
                            <TableCell className="text-center">
                              {metodoPagoLabels[pedido.metodo_pago as keyof typeof metodoPagoLabels] ||
                                pedido.metodo_pago}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginación */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                      Página {pagination.current_page} de {pagination.total_pages} ({pagination.total_records} pedidos
                      en total)
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={!pagination.has_prev}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>

                      {/* Números de página */}
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                          const pageNum = Math.max(1, pagination.current_page - 2) + i
                          if (pageNum > pagination.total_pages) return null

                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === pagination.current_page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={!pagination.has_next}
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
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
