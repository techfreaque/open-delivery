"use client";

import {
  BarChart3,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    ...(user.role === "restaurant"
      ? [
          {
            name: "Orders",
            href: "/dashboard/restaurant/orders",
            icon: ShoppingBag,
          },
          { name: "Menu", href: "/dashboard/restaurant/menu", icon: Package },
          {
            name: "Profile",
            href: "/dashboard/restaurant/profile",
            icon: User,
          },
        ]
      : []),
    ...(user.role === "driver"
      ? [
          {
            name: "Deliveries",
            href: "/dashboard/driver/deliveries",
            icon: ShoppingBag,
          },
          {
            name: "Earnings",
            href: "/dashboard/driver/earnings",
            icon: BarChart3,
          },
          {
            name: "Profile",
            href: "/dashboard/driver/profile",
            icon: User,
          },
        ]
      : []),
    ...(user.role === "admin"
      ? [
          {
            name: "Restaurants",
            href: "/dashboard/admin/restaurants",
            icon: ShoppingBag,
          },
          {
            name: "Drivers",
            href: "/dashboard/admin/drivers",
            icon: Users,
          },
          {
            name: "Statistics",
            href: "/dashboard/admin/statistics",
            icon: BarChart3,
          },
          {
            name: "Settings",
            href: "/dashboard/admin/settings",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 sm:max-w-sm">
            <nav className="grid gap-2 text-lg font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <Package className="h-6 w-6" />
            <span className="hidden md:inline">OpenEats</span>
          </Link>
        </div>

        <div className="flex-1"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <nav className="grid gap-2 p-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}
