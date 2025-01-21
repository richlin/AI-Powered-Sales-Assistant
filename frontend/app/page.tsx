"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MenuUpload from "@/components/menu/MenuUpload"
import AnalysisResults from "@/components/menu/AnalysisResults"
import ProductGrid from "@/components/recommendations/ProductGrid"
import { Trash2 } from "lucide-react"

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [products, setProducts] = useState([])
  const [showResults, setShowResults] = useState(false)

  const handleUploadComplete = (data) => {
    if (data.menu_items) {
      setMenuItems(data.menu_items)
      // Fetch product recommendations based on the menu analysis
      fetchRecommendations()
    }
    setShowResults(true)
  }

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/recommendations/products")
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    }
  }

  const handleClear = () => {
    setMenuItems([])
    setProducts([])
    setShowResults(false)
  }

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Sales Assistant Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Upload menus and get instant analysis and recommendations
          </p>
        </div>
        {showResults && (
          <Button 
            variant="outline" 
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Analysis
          </Button>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Menu Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MenuUpload onUploadComplete={handleUploadComplete} />
            {showResults && <AnalysisResults items={menuItems} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {showResults ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-muted-foreground">
                Upload a menu to see product recommendations
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Client information will appear here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              Order history will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
