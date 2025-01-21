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
import { Utensils, DollarSign, Leaf } from "lucide-react"

interface MenuItem {
  name: string
  price: string
  ingredients: string[]
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
            <TableHead className="min-w-[200px]">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Item
              </div>
            </TableHead>
            <TableHead className="w-[100px]">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Ingredients
              </div>
            </TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
} 