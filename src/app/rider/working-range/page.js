"use client";
import { databases } from '@/appwrite/appwrite'
import { getUser } from '@/appwrite/auth'
import dynamic from 'next/dynamic'
const GeoWrapper = dynamic(() => import('./GeoWrapper'), { ssr: false });
import { ID } from 'appwrite'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'

function Page() {
    const router = useRouter()
    const [value, setValue] = useState("")
    const [fromCoordinates, setFromCoordinates] = useState(null)
    const [fromFullAdress, setFromFullAddress] = useState(null)
    const [toCoordinates, setToCoordinates] = useState(null)
    const [toFullAddress, setToFullAddress] = useState(null)
    const [user, setUser] = useState(null)

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

    const fromInput = async (value) => {
        setFromCoordinates(value.properties.coordinates)
        setFromFullAddress(value.properties.full_address)
    }

    const toInput = async (value) => {
        setToCoordinates(value.properties.coordinates)
        setToFullAddress(value.properties.full_address)
    }


    const submitFunc = async () => {
        try {
            if (user) {
                const data = {
                    from_address: fromFullAdress,
                    userId: user.$id,
                    to_address: toFullAddress,
                    from_langitude: "" + fromCoordinates.longitude,
                    from_latitue: "" + fromCoordinates.latitude,
                    to_langitute: "" + toCoordinates.longitude,
                    to_latitude: "" + toCoordinates.latitude,
                    name: user?.name,
                    email: user.email
                }
                const promise = await databases.createDocument(
                    process.env.NEXT_PUBLIC_DATABASE_ID,
                    process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID,
                    ID.unique(),
                    data
                )
                return router.push("/rider/dashboard")
            } else {
                alert("No session is active")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen flex justify-center items-center bg-purple-950">
            <div className=''>
                <Card className="mx-auto max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Range</CardTitle>
                        <CardDescription>
                            Fill the range from where you want to deliver to where you want to deliver
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="">From</Label>
                                <GeoWrapper
                                    options={{
                                        proximity: {
                                            lng: -122.431297,
                                            lat: 37.773972,
                                        },
                                    }}
                                    onRetrieve={fromInput}
                                    accessToken={process.env.NEXT_PUBLIC_MAPBOX}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="">To</Label>
                                </div>
                                <GeoWrapper
                                    options={{
                                        proximity: {
                                            lng: -122.431297,
                                            lat: 37.773972,
                                        },
                                    }}
                                    onRetrieve={toInput}
                                    accessToken={process.env.NEXT_PUBLIC_MAPBOX}
                                />
                            </div>
                            <Button type="submit" className="w-full bg-purple-900 hover:bg-purple-600" onClick={submitFunc}>
                                Submit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Page