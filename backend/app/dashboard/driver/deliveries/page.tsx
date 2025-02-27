"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, MapPin, Package, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockData } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function DriverDeliveries() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter orders based on driver ID and status
  const activeDeliveries = mockData.orders.filter(
    (order) =>
      order.driverId === "2" &&
      order.status === "in_progress" &&
      (searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const completedDeliveries = mockData.orders.filter(
    (order) =>
      order.driverId === "2" &&
      order.status === "delivered" &&
      (searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
        <p className="text-muted-foreground">View and manage your active and completed deliveries.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by order ID or address..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active Deliveries
            {activeDeliveries.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeDeliveries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed Deliveries
            {completedDeliveries.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {completedDeliveries.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active deliveries</h3>
                <p className="text-muted-foreground text-center mt-2">
                  You don't have any active deliveries at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Order #{delivery.id}</CardTitle>
                      <Badge>In Progress</Badge>
                    </div>
                    <CardDescription>{new Date(delivery.createdAt).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-sm text-muted-foreground">{delivery.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Order Summary</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.items.reduce((acc, item) => acc + item.quantity, 0)} items • $
                            {delivery.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <p className="text-sm font-medium">Earnings</p>
                          <p className="text-lg font-bold">${(delivery.deliveryFee * 0.8).toFixed(2)}</p>
                        </div>
                        <Button asChild>
                          <Link href={`/dashboard/driver/deliveries/${delivery.id}`}>
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedDeliveries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No completed deliveries</h3>
                <p className="text-muted-foreground text-center mt-2">You haven't completed any deliveries yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedDeliveries.map((delivery) => (
                <Card key={delivery.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Order #{delivery.id}</CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Delivered
                      </Badge>
                    </div>
                    <CardDescription>{new Date(delivery.createdAt).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-sm text-muted-foreground">{delivery.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Order Summary</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.items.reduce((acc, item) => acc + item.quantity, 0)} items • $
                            {delivery.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <p className="text-sm font-medium">Earnings</p>
                          <p className="text-lg font-bold">${(delivery.deliveryFee * 0.8).toFixed(2)}</p>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/dashboard/driver/deliveries/${delivery.id}`}>
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

