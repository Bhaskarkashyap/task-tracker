// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import ClientOnly from "@/components/ClientOnly"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskTracker - Manage Your Tasks Efficiently",
  description: "A multi-user task tracking application for managing projects and tasks",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnly>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  )
}
