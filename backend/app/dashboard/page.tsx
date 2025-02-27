"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronRight, DollarSign, Package, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockData } from "@/lib/utils"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface User {
  email: string
  role: string
  name?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!user) {
    return null // Or a loading spinner
  }

  // Get recent orders
  const recentOrders = mockData.orders.slice(0, 5)

  // Get statistics based on user role
  let stats = []

  if (user.role === "restaurant") {
    stats = [
      {
        title: "Total Revenue",
        value: "$4,250.89",
        description: "This month",
        icon: DollarSign,
        change: "+12.5%",
        changeType: "positive",
      },
      {
        title: "Orders",
        value: "145",
        description: "This month",
        icon: ShoppingBag,
        change: "+8.2%",
        changeType: "positive",
      },
      {
        title: "Menu Items",
        value: mockData.menuItems.length.toString(),
        description: "Active items",
        icon: Package,
        change: "0%",
        changeType: "neutral",
      },
      {
        title: "Average Order",
        value: "$29.32",
        description: "Per order",
        icon: DollarSign,
        change: "+2.1%",
        changeType: "positive",
      },
    ]
  } else if (user.role === "driver") {
    stats = [
      {
        title: "Total Earnings",
        value: "$1,250.75",
        description: "This month",
        icon: DollarSign,
        change: "+8.5%",
        changeType: "positive",
      },
      {
        title: "Deliveries",
        value: "78",
        description: "This month",
        icon: ShoppingBag,
        change: "+12.2%",
        changeType: "positive",
      },
      {
        title: "Acceptance Rate",
        value: "94%",
        description: "Last 30 days",
        icon: Package,
        change: "+2%",
        changeType: "positive",
      },
      {
        title: "Rating",
        value: "4.8",
        description: "Out of 5",
        icon: Users,
        change: "+0.2",
        changeType: "positive",
      },
    ]
  } else if (user.role === "admin") {
    stats = [
      {
        title: "Total Revenue",
        value: "$42,500.89",
        description: "This month",
        icon: DollarSign,
        change: "+15.5%",
        changeType: "positive",
      },
      {
        title: "Active Restaurants",
        value: mockData.statistics.totalRestaurants.toString(),
        description: "Total",
        icon: ShoppingBag,
        change: "+3",
        changeType: "positive",
      },
      {
        title: "Active Drivers",
        value: mockData.statistics.totalDrivers.toString(),
        description: "Total",
        icon: Users,
        change: "+8",
        changeType: "positive",
      },
      {
        title: "Total Orders",
        value: "1,245",
        description: "This month",
        icon: Package,
        change: "+18.2%",
        changeType: "positive",
      },
    ]
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your {user.role} account.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span
                  className={`flex items-center ${
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : stat.changeType === "negative"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.changeType === "positive" && <ArrowUpRight className="h-3 w-3" />}
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue for the current year</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData.revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders across the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={
                user.role === "restaurant"
                  ? "/dashboard/restaurant/orders"
                  : user.role === "driver"
                    ? "/dashboard/driver/deliveries"
                    : "/dashboard/admin/orders"
              }
            >
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-500"
                            : order.status === "in_progress"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <span className="capitalize">{order.status.replace("_", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/${user.role}/orders/${order.id}`}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View order</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

