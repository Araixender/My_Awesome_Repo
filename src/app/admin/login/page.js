"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { createEmailUser, getUser, loginEmailUser, loginWithGoogle } from "@/appwrite/auth"
import { redirect, useRouter } from "next/navigation"


function AdminLoginForm() {
    const [user, setUser] = useState(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    useEffect(() => {
        const checkUser = async () => {
          try {
            const userData = await getUser()
            setUser(userData)
          } catch (error) {
            setUser(null)
          }
        }
    
        checkUser()
      }, [])
    
    const handleOnSubmit = async (ev) => {
        ev.preventDefault()
        const acc = await loginEmailUser(email, password)
        if (acc) {
            return router.push('/admin/dashboard')
        }
        else{
          alert("Email or Password is incorrect!")
        }
    }
    if (user){
        return redirect("/admin/dashboard")
    }
  return (
   <div className="min-h-screen flex justify-center items-center" style={{background: "url('../adminLogin.jpg')", backgroundPosition: "center", backgroundSize: "cover"}}>
     <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={ev => setEmail(ev.target.value)}
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required onChange={ev => setPassword(ev.target.value)} value={password}/>
          </div>
          <Button type="submit" className="w-full bg-indigo-900 hover:bg-indigo-600" onClick={handleOnSubmit}>
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/admin/register" className="underline ">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
   </div>
  )
}
export default AdminLoginForm;