import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import DashboardProvider from '@/dashboardContext/dashboardProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'lwalewah | Rider App',
  description: 'create for riders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <DashboardProvider>
          {children}
          <Toaster />
          </DashboardProvider>
      </body>
    </html>
  )
}
