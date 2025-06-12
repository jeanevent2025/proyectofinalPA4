"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Eye, Plus, Minus, ShoppingCart, X, Star, Heart } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: number
  title: string
  image: string
  price: number
  category: string
  inStock: boolean
  featured?: boolean
  features?: string[]
}

interface ProductPreviewModalProps {
  product: Product
  children?: React.ReactNode
}

export function ProductPreviewModal({ product, children }: ProductPreviewModalProps) {
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  // Simular stock disponible (en una app real vendría de la base de datos)
  const stockAvailable = product.inStock ? Math.floor(Math.random() * 20) + 5 : 0

  const handleAddToCart = async () => {
    if (!product.inStock || quantity <= 0) return

    setIsAdding(true)

    // Agregar múltiples unidades al carrito
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        features: product.features,
      })
    }

    toast({
      title: "Productos agregados",
      description: `${quantity} x ${product.title} agregado${quantity > 1 ? "s" : ""} al carrito`,
    })

    // Simular delay de carga
    setTimeout(() => {
      setIsAdding(false)
      setIsOpen(false)
      setQuantity(1) // Resetear cantidad
    }, 500)
  }

  const increaseQuantity = () => {
    if (quantity < stockAvailable) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const totalPrice = product.price * quantity

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Vista Previa del Producto</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
              {product.featured && <Badge className="absolute top-4 left-4 bg-red-500">Destacado</Badge>}
              {!product.inStock && <Badge className="absolute top-4 right-4 bg-gray-500">Agotado</Badge>}
            </div>

            {/* Características del producto */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Características:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div className="space-y-6">
            {/* Título y categoría */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2>
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            </div>

            {/* Rating simulado */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0) • 127 reseñas</span>
            </div>

            <Separator />

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-blue-600">${product.price.toLocaleString()}</span>
                <span className="text-lg text-gray-500 line-through">${(product.price * 1.2).toLocaleString()}</span>
                <Badge className="bg-green-500">-17% OFF</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Precio total: <span className="font-semibold">${totalPrice.toLocaleString()}</span>
              </p>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Stock disponible:</span>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? `${stockAvailable} unidades` : "Sin stock"}
                </Badge>
              </div>
              {product.inStock && stockAvailable <= 10 && (
                <p className="text-sm text-orange-600 font-medium">¡Solo quedan {stockAvailable} unidades!</p>
              )}
            </div>

            <Separator />

            {/* Selector de cantidad */}
            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Cantidad:</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseQuantity}
                      disabled={quantity >= stockAvailable}
                      className="h-10 w-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {quantity >= stockAvailable && (
                  <p className="text-sm text-orange-600">Has alcanzado el stock máximo disponible</p>
                )}
              </div>
            )}

            <Separator />

            {/* Botones de acción */}
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1" size="lg">
                <X className="h-4 w-4 mr-2" />
                Cerrar
              </Button>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding || quantity <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isAdding ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Agregando...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Añadir al Carrito
                  </>
                )}
              </Button>
            </div>

            {/* Botón de favoritos */}
            <Button variant="outline" className="w-full" size="lg">
              <Heart className="h-4 w-4 mr-2" />
              Agregar a Favoritos
            </Button>

            {/* Información adicional */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-900">Información de envío:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Envío gratis en compras mayores a $100</li>
                <li>• Entrega en 2-3 días hábiles</li>
                <li>• Garantía oficial de 12 meses</li>
                <li>• Devolución gratuita en 30 días</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
