"use client"
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
import { createEmailUser, getUser, loginWithGoogle } from "@/appwrite/auth"
import { redirect, useRouter } from "next/navigation"


export function RegisterForm() {
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
        const acc = await createEmailUser(email, password)
        if (acc) {
            return router.push('/rider/working-range')
        }
    }
    if (user){
        return redirect("/rider/dashboard")
    }
  return (
   <div className="min-h-screen flex justify-center items-center bg-indigo-950" style={{background: "url('../register.jpg')", backgroundPosition: "center", backgroundSize: "cover"}}>
     <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email below to register a new account
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
            Register
          </Button>
          <Button variant="outline" className="w-full" onClick={() => loginWithGoogle('/rider/dashboard')}>
            Register with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Have an account?{" "}
          <Link href="/rider/login" className="underline ">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
   </div>
  )
}

export default RegisterForm;