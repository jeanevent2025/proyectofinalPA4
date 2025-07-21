"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Globe,
  Calendar,
  FileText,
  Loader2,
  ShoppingCart,
  Menu,
  User,
  ChevronDown,
  Phone,
  MapPin,
  Mail,
} from "lucide-react"
import axios from "axios"

interface Marca {
  id: number
  nombre: string
  pais_origen: string
  año_fundacion: number
  descripcion: string
  activo: number
  fecha_creacion: string
  fecha_actualizacion: string
}

interface FormData {
  nombre: string
  pais_origen: string
  año_fundacion: string
  descripcion: string
}

const API_URL = "https://giancarlo.alwaysdata.net/marcas.php"

// 🎨 COMPONENTE DE SKELETON LOADING SOLO PARA LOS GRIDS DE STATS
// 📍 UBICACIÓN: Solo se aplica a las tarjetas de estadísticas (grid de 4 cards)
const StatsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded w-12"></div>
            </div>
            <div className="animate-pulse w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

// 🎨 COMPONENTE DE SKELETON LOADING SOLO PARA LA TABLA DE MARCAS
// 📍 UBICACIÓN: Solo se aplica a la tabla principal de marcas
const TableGridSkeleton = () => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="border-r border-gray-200 text-center bg-gray-100">
            <div className="animate-pulse h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
          </TableHead>
          <TableHead className="border-r border-gray-200 text-center bg-gray-100">
            <div className="animate-pulse h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
          </TableHead>
          <TableHead className="border-r border-gray-200 text-center bg-gray-100">
            <div className="animate-pulse h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
          </TableHead>
          <TableHead className="border-r border-gray-200 text-center bg-gray-100">
            <div className="animate-pulse h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
          </TableHead>
          <TableHead className="border-r border-gray-200 text-center bg-gray-100">
            <div className="animate-pulse h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell className="border-r border-gray-200 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-pulse w-10 h-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-full"></div>
                <div className="animate-pulse h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20"></div>
                <div className="animate-pulse h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-12"></div>
              </div>
            </TableCell>
            <TableCell className="border-r border-gray-200 text-center">
              <div className="animate-pulse h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-24 mx-auto"></div>
            </TableCell>
            <TableCell className="border-r border-gray-200 text-center">
              <div className="animate-pulse h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 mx-auto"></div>
            </TableCell>
            <TableCell className="border-r border-gray-200">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-pulse w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
                <div className="animate-pulse w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"></div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [loadingGrids, setLoadingGrids] = useState(true) // 📍 ESTADO DE LOADING SOLO PARA LOS GRIDS
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMarca, setEditingMarca] = useState<Marca | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    pais_origen: "",
    año_fundacion: "",
    descripcion: "",
  })
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)

  // 🔄 OBTENER TODAS LAS MARCAS
  // 📍 LÓGICA: Solo afecta el loading de los grids (stats y tabla)
  const fetchMarcas = async () => {
    try {
      setLoadingGrids(true)
      const response = await axios.get(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      const data = response.data

      // --- INICIO DEL RETRASO ARTIFICIAL ---
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Retraso de 1.5 segundos
      // --- FIN DEL RETRASO ARTIFICIAL ---

      if (data.success) {
        setMarcas(data.data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar las marcas",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error de conexión",
          description: `No se pudo conectar con el servidor: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          variant: "destructive",
        })
      }
    } finally {
      setLoadingGrids(false)
    }
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido"
    }
    if (!formData.pais_origen.trim()) {
      errors.pais_origen = "El país de origen es requerido"
    }
    if (!formData.año_fundacion.trim()) {
      errors.año_fundacion = "El año de fundación es requerido"
    } else {
      const año = Number.parseInt(formData.año_fundacion)
      if (isNaN(año) || año < 1800 || año > new Date().getFullYear()) {
        errors.año_fundacion = "Ingrese un año válido"
      }
    }
    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es requerida"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Crear nueva marca
  const createMarca = async () => {
    if (!validateForm()) return
    try {
      setSubmitting(true)
      const response = await axios.post(
        API_URL,
        {
          ...formData,
          año_fundacion: Number.parseInt(formData.año_fundacion),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      const data = response.data
      if (data.success) {
        toast({
          title: "Éxito",
          description: "Marca creada exitosamente",
        })
        fetchMarcas()
        resetForm()
        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al crear la marca",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: `Error de conexión al crear la marca: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Error de conexión al crear la marca",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Actualizar marca
  const updateMarca = async () => {
    if (!validateForm() || !editingMarca) return
    try {
      setSubmitting(true)
      const response = await axios.put(
        `${API_URL}?id=${editingMarca.id}`,
        {
          ...formData,
          año_fundacion: Number.parseInt(formData.año_fundacion),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      const data = response.data
      if (data.success) {
        toast({
          title: "Éxito",
          description: "Marca actualizada exitosamente",
        })
        fetchMarcas()
        resetForm()
        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al actualizar la marca",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: `Error de conexión al actualizar la marca: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Error de conexión al actualizar la marca",
          variant: "destructive",
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Eliminar marca
  const deleteMarca = async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}?id=${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = response.data
      if (data.success) {
        toast({
          title: "Éxito",
          description: "Marca eliminada exitosamente",
        })
        fetchMarcas()
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al eliminar la marca",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: `Error de conexión al eliminar la marca: ${error.message}`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Error de conexión al eliminar la marca",
          variant: "destructive",
        })
      }
    }
  }

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      pais_origen: "",
      año_fundacion: "",
      descripcion: "",
    })
    setFormErrors({})
    setEditingMarca(null)
  }

  // Abrir modal para editar
  const openEditDialog = (marca: Marca) => {
    setEditingMarca(marca)
    setFormData({
      nombre: marca.nombre,
      pais_origen: marca.pais_origen,
      año_fundacion: marca.año_fundacion.toString(),
      descripcion: marca.descripcion,
    })
    setIsDialogOpen(true)
  }

  // Abrir modal para crear
  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Filtrar marcas por búsqueda
  const filteredMarcas = marcas.filter(
    (marca) =>
      marca.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marca.pais_origen.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Cargar marcas al montar el componente
  useEffect(() => {
    fetchMarcas()
  }, [])

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
              <Link href="/marcas" className="text-yellow-400 hover:text-yellow-400 font-medium flex items-center">
                MARCAS
                <Badge className="ml-2 bg-emerald-500 text-white text-xs">SALE</Badge>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Link>
              <Link href="/pedidos" className="text-white hover:text-yellow-400 font-medium flex items-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestión de Marcas
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Administra las marcas de celulares disponibles en tu tienda. Crea, edita y organiza toda la información de
              las marcas.
            </p>
          </div>
          {/* 📍 STATS CARDS CON SKELETON LOADING SOLO EN LOS GRIDS */}
          {loadingGrids ? (
            <StatsGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Marcas</p>
                      <p className="text-3xl font-bold">{marcas.length}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Países</p>
                      <p className="text-3xl font-bold">{new Set(marcas.map((m) => m.pais_origen)).size}</p>
                    </div>
                    <Globe className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Más Antigua</p>
                      <p className="text-3xl font-bold">
                        {marcas.length > 0 ? Math.min(...marcas.map((m) => m.año_fundacion)) : 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Más Reciente</p>
                      <p className="text-3xl font-bold">
                        {marcas.length > 0 ? Math.max(...marcas.map((m) => m.año_fundacion)) : 0}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {/* CRUD */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar marcas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openCreateDialog}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Marca
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{editingMarca ? "Actualizar Marca" : "Nueva Marca"}</DialogTitle>
                      <DialogDescription>
                        {editingMarca
                          ? "Modifica los datos de la marca seleccionada"
                          : "Completa los datos para crear una nueva marca"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre de la Marca</Label>
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          placeholder="Ej: Apple, Samsung, Xiaomi"
                        />
                        {formErrors.nombre && <p className="text-sm text-red-600">{formErrors.nombre}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pais_origen">País de Origen</Label>
                        <Input
                          id="pais_origen"
                          value={formData.pais_origen}
                          onChange={(e) => setFormData({ ...formData, pais_origen: e.target.value })}
                          placeholder="Ej: Estados Unidos, China, Corea del Sur"
                        />
                        {formErrors.pais_origen && <p className="text-sm text-red-600">{formErrors.pais_origen}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="año_fundacion">Año de Fundación</Label>
                        <Input
                          id="año_fundacion"
                          type="number"
                          value={formData.año_fundacion}
                          onChange={(e) => setFormData({ ...formData, año_fundacion: e.target.value })}
                          placeholder="Ej: 1976, 2010, 1938"
                          min="1800"
                          max={new Date().getFullYear()}
                        />
                        {formErrors.año_fundacion && <p className="text-sm text-red-600">{formErrors.año_fundacion}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                          id="descripcion"
                          value={formData.descripcion}
                          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                          placeholder="Describe la marca, su historia y características principales..."
                          rows={3}
                        />
                        {formErrors.descripcion && <p className="text-sm text-red-600">{formErrors.descripcion}</p>}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={editingMarca ? updateMarca : createMarca}
                        disabled={submitting}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {editingMarca ? "Actualizar" : "Crear"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          {/* 📍 TABLE CON SKELETON LOADING SOLO EN EL GRID DE LA TABLA */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Marcas ({filteredMarcas.length})</CardTitle>
              <CardDescription>Gestiona todas las marcas de celulares disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingGrids ? (
                <TableGridSkeleton />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="border-r border-gray-200 text-center bg-gray-100 font-semibold">
                          Marca
                        </TableHead>
                        <TableHead className="border-r border-gray-200 text-center bg-gray-100 font-semibold">
                          País de Origen
                        </TableHead>
                        <TableHead className="border-r border-gray-200 text-center bg-gray-100 font-semibold">
                          Año de Fundación
                        </TableHead>
                        <TableHead className="border-r border-gray-200 text-center bg-gray-100 font-semibold">
                          Descripción
                        </TableHead>
                        <TableHead className="border-r border-gray-200 text-center bg-gray-100 font-semibold">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarcas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            {searchTerm ? "No se encontraron marcas" : "No hay marcas registradas"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMarcas.map((marca) => (
                          <TableRow key={marca.id}>
                            <TableCell className="border-r border-gray-200 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {marca.nombre.charAt(0)}
                                </div>
                                <div className="text-center">
                                  <div className="font-medium">{marca.nombre}</div>
                                  <div className="text-sm text-muted-foreground">ID: {marca.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-200 text-center">
                              <div className="flex justify-center">
                                <Badge variant="outline" className="gap-1 text-base">
                                  <Globe className="h-3 w-3" />
                                  {marca.pais_origen}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-200 text-center">
                              <div className="flex justify-center">
                                <Badge variant="secondary" className="gap-1 text-base">
                                  <Calendar className="h-3 w-3" />
                                  {marca.año_fundacion}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="border-r border-gray-200">
                              <div className="whitespace-normal break-words text-center text-base font-medium">
                                {marca.descripcion}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(marca)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 bg-transparent"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Eliminar Marca</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        ¿Esta seguro de eliminar la marca {marca.nombre}?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteMarca(marca.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-100 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Brand Column */}
            <div className="pr-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-md flex items-center justify-center mr-3">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">BRANCHY</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronictook a galley of type and scrambled it to
              </p>
            </div>
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
    </div>
  )
}
