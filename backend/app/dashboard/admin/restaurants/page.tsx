"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { mockData } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  image: string
  rating: number
  cuisine: string
  isOpen: boolean
}

export default function AdminRestaurants() {
  const { toast } = useToast()
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockData.restaurants)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    if (searchQuery === "") return true
    
    const query = searchQuery.toLowerCase()
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.cuisine.toLowerCase().includes(query) ||
      restaurant.address.toLowerCase().includes(query)
    )
  })
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const handleAddRestaurant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newRestaurant: Restaurant = {
      id: `${restaurants.length + 1}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      image: "/placeholder.svg?height=100&width=100",
      rating: 0,
      cuisine: formData.get("cuisine") as string,
      isOpen: formData.get("isOpen") === "on",
    }
    
    if (editingRestaurant) {
      // Update existing restaurant
      setRestaurants(restaurants.map(restaurant => 
        restaurant.id === editingRestaurant.id ? { ...newRestaurant, id: restaurant.id } : restaurant
      ))
      toast({
        title: "Restaurant updated",
        description: `${newRestaurant.name} has been updated successfully.`,
      })
    } else {
      // Add new restaurant
      setRestaurants([...restaurants, newRestaurant])
      toast({
        title: "Restaurant added",
        description: `${newRestaurant.name} has been added to the platform.`,
      })
    }
    
    setIsDialogOpen(false)
    setEditingRestaurant(null)
  }
  
  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant)
    setIsDialogOpen(true)
  }
  
  const handleDeleteRestaurant = (id: string) => {
    setRestaurants(restaurants.filter(restaurant => restaurant.id !== id))
    toast({
      title: "Restaurant deleted",
      description: "The restaurant has been removed from the platform.",
    })
  }
  
  const handleToggleStatus = (id: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id ? { ...restaurant, isOpen: !restaurant.isOpen } : restaurant
    ))
    
    const restaurant = restaurants.find(r => r.id === id)
    toast({
      title: restaurant?.isOpen ? "Restaurant marked as closed" : "Restaurant marked as open",
      description: `${restaurant?.name} is now ${restaurant?.isOpen ? "closed" : "open"} for orders.`,
    })
  }
  
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
          <p className="text-muted-foreground">
            Manage restaurants on the platform.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0" onClick={() => setEditingRestaurant(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingRestaurant ? "Edit Restaurant" : "Add Restaurant"}</DialogTitle>
              <DialogDescription>
                {editingRestaurant 
                  ? "Update the restaurant details." 
                  : "Fill in the details to add a new restaurant to the platform."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRestaurant}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={editingRestaurant?.name || ""} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <Input 
                      id="cuisine" 
                      name="cuisine" 
                      defaultValue={editingRestaurant?.cuisine || ""} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    defaultValue={editingRestaurant?.description || ""} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    defaultValue={editingRestaurant?.address || ""} 
                    \

