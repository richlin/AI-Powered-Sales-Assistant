"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MenuUpload from "@/components/menu/MenuUpload"
import AnalysisResults from "@/components/menu/AnalysisResults"
import ProductGrid from "@/components/recommendations/ProductGrid"
import { Trash2, User, Building, Calendar } from "lucide-react"

// Mock data for agents and clients
const mockAgents = [
  { id: "1", name: "John Smith", region: "Northeast", expertise: "Fine Dining" },
  { id: "2", name: "Sarah Johnson", region: "West Coast", expertise: "Casual Dining" },
  { id: "3", name: "Michael Chen", region: "Midwest", expertise: "Fast Casual" },
  { id: "4", name: "Emily Brown", region: "Southeast", expertise: "Bars & Pubs" },
]

const mockClients = [
  { 
    id: "1", 
    name: "The Italian Kitchen", 
    type: "Restaurant", 
    location: "Boston, MA",
    orderHistory: [
      { date: "2024-01-15", items: ["Premium Olive Oil (5L)", "San Marzano Tomatoes (24 cans)", "Tipo 00 Flour (25kg)"], total: "$850.00" },
      { date: "2023-12-20", items: ["Parmigiano Reggiano (10kg)", "Balsamic Vinegar (12 bottles)"], total: "$1,200.00" },
      { date: "2023-12-01", items: ["Fresh Mozzarella (20kg)", "Pasta Variety Pack"], total: "$750.00" },
    ]
  },
  { 
    id: "2", 
    name: "Ocean Blue Seafood", 
    type: "Fine Dining", 
    location: "Seattle, WA",
    orderHistory: [
      { date: "2024-01-18", items: ["Premium Sushi Rice (50kg)", "Wasabi Paste (24 tubes)", "Nori Sheets (1000 sheets)"], total: "$1,450.00" },
      { date: "2023-12-15", items: ["Soy Sauce Premium (36 bottles)", "Rice Vinegar (24 bottles)"], total: "$980.00" },
      { date: "2023-11-30", items: ["Seafood Seasoning Mix", "Tempura Batter Mix"], total: "$550.00" },
    ]
  },
  { 
    id: "3", 
    name: "Burger & Brew", 
    type: "Casual Dining", 
    location: "Chicago, IL",
    orderHistory: [
      { date: "2024-01-20", items: ["Premium Ground Beef (50kg)", "Burger Buns (500 pcs)", "BBQ Sauce (24 bottles)"], total: "$1,200.00" },
      { date: "2023-12-28", items: ["Cheddar Cheese Slices (1000 pcs)", "French Fries (25kg)"], total: "$850.00" },
      { date: "2023-12-10", items: ["Bacon Strips (20kg)", "Onion Rings (15kg)"], total: "$675.00" },
    ]
  },
  { 
    id: "4", 
    name: "Taco Express", 
    type: "Fast Casual", 
    location: "Miami, FL",
    orderHistory: [
      { date: "2024-01-17", items: ["Corn Tortillas (2000 pcs)", "Salsa Verde (36 jars)", "Mexican Spice Blend"], total: "$920.00" },
      { date: "2023-12-22", items: ["Black Beans (50kg)", "Rice (50kg)", "Hot Sauce (48 bottles)"], total: "$780.00" },
      { date: "2023-12-05", items: ["Guacamole Mix", "Tortilla Chips (25kg)"], total: "$550.00" },
    ]
  },
]

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [products, setProducts] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState("")
  const [selectedClient, setSelectedClient] = useState("")

  const handleUploadComplete = (data) => {
    if (data.menu_items) {
      setMenuItems(data.menu_items)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bcg-header py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI-Powered Sales Assistant</h1>
            {showResults && (
              <Button
                variant="outline"
                className="bg-white text-[#009B4D] hover:bg-gray-100"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bcg-nav py-2">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <span className="bcg-nav-item-active">Menu Analysis</span>
            <span className="bcg-nav-item">Order History</span>
            <span className="bcg-nav-item">Reports</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Selection Section */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Select Sales Agent</label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an agent" />
              </SelectTrigger>
              <SelectContent>
                {mockAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-[#009B4D]" />
                      <span>{agent.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Select Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-[#009B4D]" />
                      <span>{client.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analysis and Recommendations */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bcg-card">
            <CardHeader>
              <CardTitle className="bcg-section-title">Menu Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MenuUpload onUploadComplete={handleUploadComplete} />
              {showResults && <AnalysisResults items={menuItems} />}
            </CardContent>
          </Card>

          <Card className="bcg-card">
            <CardHeader>
              <CardTitle className="bcg-section-title">Product Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {showResults ? (
                <ProductGrid products={products} />
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Upload a menu to see product recommendations
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Profile */}
          <Card className="bcg-card md:col-span-2">
            <CardHeader>
              <CardTitle className="bcg-section-title">Client Profile & Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                <div className="space-y-6">
                  {mockClients.map((client) => 
                    client.id === selectedClient && (
                      <div key={client.id}>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                          <div>
                            <h3 className="font-medium text-[#009B4D]">{client.name}</h3>
                            <p className="text-muted-foreground">Type: {client.type}</p>
                            <p className="text-muted-foreground">Location: {client.location}</p>
                          </div>
                          <div className="md:col-span-2">
                            <h4 className="font-medium mb-2">Recent Orders</h4>
                            <div className="space-y-4">
                              {client.orderHistory.map((order, index) => (
                                <div key={index} className="border-b pb-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2 text-[#009B4D]" />
                                      <span>{formatDate(order.date)}</span>
                                    </div>
                                    <span className="font-medium">{order.total}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {order.items.join(", ")}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Select a client to view their profile and order history
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
