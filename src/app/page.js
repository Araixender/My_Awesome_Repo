'use client';
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { useContext, useEffect } from "react"
import { DashboardContext } from "@/dashboardContext/dashboard"
import { useRouter } from "next/navigation"


export default function Home() {
  const {user} = useContext(DashboardContext)
  const router = useRouter()
  useEffect(() => {
    if (user) return router.push("/rider/dashboard")
  }, [user])
  return (
    <div className="flex flex-col justify-center min-h-screen gap-4 p-10" style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(home.jpg)', backgroundPosition: "center", backgroundSize: "cover"}}>
        <h2 className="text-6xl font-extrabold text-white leading-snug">Unlock the Road<br /> to Success with <span class="bg-indigo-600">Lwalewah!</span></h2>
        <p className="text-gray-300 text-2xl">Join the fastest-growing rider community and take control of your journey today.</p>
        <div className="flex items-center gap-3 my-3">
        <Link href={"/rider/login"}><button className="text-gray-200 px-9 py-3 font-bold border-2 hover:bg-indigo-600">Login</button></Link>
        <Link href={"/rider/register"}><button className="text-gray-200 px-9 py-3 font-bold border-2 hover:bg-indigo-600">Register</button></Link>
        </div>
      </div>

  )
}
