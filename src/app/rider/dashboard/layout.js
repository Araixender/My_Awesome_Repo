"use client";
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, logoutUser } from "@/appwrite/auth";
import Link from "next/link";
import { DashboardContext } from "@/dashboardContext/dashboard";

export default function Page({ children }) {
  const {user, breadcumb} = useContext(DashboardContext)
  const router = useRouter()   
  const handleLogout = async () => {
    try {
      await logoutUser()
      return router.push("/rider/login") 
    } catch (error) {
      alert("error")
    }
  }
  return (
    (user ? <SidebarProvider className="bg-gray-950">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-indigo-950 text-white justify-between">
          <div className="flex items-center">  <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-gray-300">
                    iwalewah
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-white" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">{breadcumb}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb></div>
          <div className="">
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="flex justify-center flex-col gap-3">
              <Label htmlFor="email" className="text-gray-500">Login as {user.name}({user.email})</Label>
                <Button className="bg-indigo-950" onClick={handleLogout}>Logout</Button>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-300" >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>: 
    <div className="min-h-screen flex justify-center items-center bg-indigo-950">
      <Card className="bg-gray-200">
        <CardHeader>
          <CardTitle>Please Wait!</CardTitle>
          <CardDescription>If having problem!</CardDescription>
        </CardHeader>
        <CardContent><Button className="bg-indigo-950"><Link href={"/rider/login"}>Login</Link></Button></CardContent>
      </Card>
    </div>))
  
}
