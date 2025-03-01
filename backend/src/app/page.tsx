import Link from "next/link";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">OpenEats</h1>
          <nav className="space-x-2">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-white/90"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="outline"
                className="bg-white text-primary hover:bg-white/90"
              >
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Partner Portal</h2>
          <p className="text-xl mb-8">
            Welcome to the OpenEats Partner Portal. Sign up or login to manage
            your restaurant, track your deliveries, or administer the platform.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Restaurants</h3>
              <p className="mb-6">
                Manage your menu, track orders, and update your restaurant
                profile.
              </p>
              <Link href="/auth/signup?role=restaurant">
                <Button className="w-full mb-2">Sign Up as Restaurant</Button>
              </Link>
              <Link href="/auth/login?role=restaurant">
                <Button variant="outline" className="w-full">
                  Restaurant Login
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Drivers</h3>
              <p className="mb-6">
                Track your deliveries, manage your availability, and view your
                earnings.
              </p>
              <Link href="/auth/signup?role=driver">
                <Button className="w-full mb-2">Sign Up as Driver</Button>
              </Link>
              <Link href="/auth/login?role=driver">
                <Button variant="outline" className="w-full">
                  Driver Login
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Administrators</h3>
              <p className="mb-6">
                Manage users, view platform statistics, and configure global
                settings.
              </p>
              <Link href="/auth/login?role=admin">
                <Button className="w-full">Admin Login</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} OpenEats. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
