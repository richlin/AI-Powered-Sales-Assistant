"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"

interface MenuUploadProps {
  onUploadComplete: (data: any) => void
}

export default function MenuUpload({ onUploadComplete }: MenuUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/api/v1/menu/analyze-menu", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.detail || "Failed to analyze menu")
      }

      const data = await response.json()
      if (!data.menu_items) {
        throw new Error("Invalid response format")
      }

      onUploadComplete(data)
      toast({
        title: "Success",
        description: "Menu analysis completed successfully",
      })
    } catch (error) {
      console.error("Error analyzing menu:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze menu. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
        <Upload className="h-8 w-8 mb-4 text-muted-foreground" />
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="hidden"
        />
        <Button
          onClick={handleButtonClick}
          disabled={isLoading}
          variant="secondary"
        >
          {isLoading ? "Analyzing..." : "Choose Menu Image"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Upload a JPG or PNG menu image to get started
        </p>
      </div>
      {isLoading && (
        <div className="text-sm text-muted-foreground text-center">
          Analyzing menu... This may take a few seconds.
        </div>
      )}
    </div>
  )
} 