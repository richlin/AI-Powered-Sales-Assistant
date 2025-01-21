"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface MenuItem {
  name: string
  price: string
  ingredients: string[]
  allergens: string[]
}

interface AnalysisResultsProps {
  items: MenuItem[]
}

export default function AnalysisResults({ items = [] }: AnalysisResultsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Ingredients</TableHead>
            <TableHead>Allergens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.map((ingredient, i) => (
                    <Badge key={i} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.allergens.map((allergen, i) => (
                    <Badge key={i} variant="destructive">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
} 