"use client"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    category: string
    features?: string[]
  }
  disabled?: boolean
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function AddToCartButton({ product, disabled = false, className = "", size = "default" }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      features: product.features,
    })

    setIsAdded(true)

    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    })

    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <Button onClick={handleAddToCart} disabled={disabled || isAdded} className={className} size={size}>
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Agregado
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {disabled ? "Agotado" : "Agregar al Carrito"}
        </>
      )}
    </Button>
  )
}
