"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  tags: string[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products = [] }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No recommendations available yet
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">
              {product.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4 pt-0">
            <span className="font-semibold">{product.price}</span>
            <Button size="sm">Add to Quote</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 