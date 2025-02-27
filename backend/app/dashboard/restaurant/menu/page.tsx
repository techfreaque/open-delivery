"use client";

import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockData } from "@/lib/utils";

interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export default function RestaurantMenu() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockData.menuItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newItem: MenuItem = {
      id: `${menuItems.length + 1}`,
      restaurantId: "1",
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      image: "/placeholder.svg?height=100&width=100",
      category: formData.get("category") as string,
      isAvailable: formData.get("isAvailable") === "on",
    };

    if (editingItem) {
      // Update existing item
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id ? { ...newItem, id: item.id } : item,
        ),
      );
      toast({
        title: "Menu item updated",
        description: `${newItem.name} has been updated successfully.`,
      });
    } else {
      // Add new item
      setMenuItems([...menuItems, newItem]);
      toast({
        title: "Menu item added",
        description: `${newItem.name} has been added to your menu.`,
      });
    }

    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast({
      title: "Menu item deleted",
      description: "The menu item has been deleted from your menu.",
    });
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
      ),
    );

    const item = menuItems.find((item) => item.id === id);
    toast({
      title: item?.isAvailable
        ? "Item marked as unavailable"
        : "Item marked as available",
      description: `${item?.name} is now ${item?.isAvailable ? "unavailable" : "available"} for ordering.`,
    });
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage your restaurant's menu items.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="mt-4 md:mt-0"
              onClick={() => setEditingItem(null)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the details of your menu item."
                  : "Fill in the details to add a new menu item."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingItem?.name || ""}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingItem?.description || ""}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingItem?.price || ""}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    defaultValue={editingItem?.category || "Main"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appetizers">Appetizers</SelectItem>
                      <SelectItem value="Main">Main</SelectItem>
                      <SelectItem value="Sides">Sides</SelectItem>
                      <SelectItem value="Desserts">Desserts</SelectItem>
                      <SelectItem value="Drinks">Drinks</SelectItem>
                      <SelectItem value="Salads">Salads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isAvailable" className="flex-1">
                    Available for ordering
                  </Label>
                  <Switch
                    id="isAvailable"
                    name="isAvailable"
                    defaultChecked={editingItem?.isAvailable ?? true}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingItem ? "Save Changes" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.id} className={!item.isAvailable ? "opacity-60" : ""}>
            <CardHeader className="relative pb-0">
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditItem(item)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleAvailability(item.id)}
                    >
                      <Switch
                        className="mr-2"
                        checked={item.isAvailable}
                        onCheckedChange={() => {}}
                      />
                      {item.isAvailable
                        ? "Mark as Unavailable"
                        : "Mark as Available"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="aspect-video relative overflow-hidden rounded-md">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardTitle className="mt-4">{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-bold">${item.price.toFixed(2)}</p>
                {!item.isAvailable && (
                  <span className="text-xs bg-muted px-2 py-1 rounded-md">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
