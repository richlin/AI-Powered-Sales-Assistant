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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const selectedAgentName = mockAgents.find(agent => agent.id === selectedAgent)?.name
  const selectedClientName = mockClients.find(client => client.id === selectedClient)?.name

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
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
        </div>
        {(selectedAgentName || selectedClientName) && (
          <div className="flex items-center gap-2 mt-4 text-sm">
            {selectedAgentName && (
              <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Agent: <span className="font-medium">{selectedAgentName}</span></span>
              </div>
            )}
            {selectedClientName && (
              <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>Client: <span className="font-medium">{selectedClientName}</span></span>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Sales Agent</label>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an agent">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Choose an agent</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {mockAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex flex-col">
                    <span>{agent.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {agent.region} - {agent.expertise}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Client</label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a client">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Choose a client</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  <div className="flex flex-col">
                    <span>{client.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {client.type} - {client.location}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
            {selectedClient ? (
              <div className="space-y-4">
                {mockClients.map((client) => 
                  client.id === selectedClient && (
                    <div key={client.id}>
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-muted-foreground">Type: {client.type}</p>
                      <p className="text-muted-foreground">Location: {client.location}</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                Select a client to view their profile
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedClient ? (
              <div className="space-y-6">
                {mockClients
                  .find(client => client.id === selectedClient)
                  ?.orderHistory.map((order, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.date)}
                      </div>
                      <ul className="list-disc list-inside text-sm text-muted-foreground pl-1">
                        {order.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium">Total: {order.total}</p>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-muted-foreground">
                Select a client to view order history
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
