import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import type React from "react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import { APP_NAME, frontendRoutes } from "@/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${APP_NAME} Partner Portal`,
  description: "Partner portal for restaurants, drivers, and administrators",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
          {/* Header */}
          <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">OE</span>
                  </div>
                  <h1 className="text-2xl font-bold hidden sm:block">
                    {APP_NAME}
                  </h1>
                </div>
              </Link>
              <nav className="flex items-center space-x-2">
                <Link href="/v1/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/v1/auth/signup">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </nav>
            </div>
          </header>

          {children}

          {/* Footer */}
          <footer className="bg-gray-100 border-t py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold mb-4 text-lg">{APP_NAME}</h3>
                  <p className="text-sm text-gray-600">
                    An open-source food delivery platform with powerful API
                    capabilities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/v1/api-docs"
                        className="text-gray-600 hover:text-primary"
                      >
                        API Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/docs/guides"
                        className="text-gray-600 hover:text-primary"
                      >
                        Integration Guides
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/docs/examples"
                        className="text-gray-600 hover:text-primary"
                      >
                        Code Examples
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Legal</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/terms"
                        className="text-gray-600 hover:text-primary"
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy"
                        className="text-gray-600 hover:text-primary"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/cookies"
                        className="text-gray-600 hover:text-primary"
                      >
                        Cookie Policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Connect</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="https://github.com/your-repo"
                        className="text-gray-600 hover:text-primary"
                      >
                        GitHub
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/discord"
                        className="text-gray-600 hover:text-primary"
                      >
                        Discord Community
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={frontendRoutes.help}
                        className="text-gray-600 hover:text-primary"
                      >
                        Contact Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
                <p>
                  &copy; {new Date().getFullYear()} {APP_NAME}. All rights
                  reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
