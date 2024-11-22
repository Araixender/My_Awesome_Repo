"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useContext, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { databases } from '@/appwrite/appwrite'
import { getUser } from '@/appwrite/auth'
import { Query } from 'appwrite'
import { DashboardContext } from '@/dashboardContext/dashboard'
import { useToast } from "@/hooks/use-toast"
import { chatCollection } from '@/ImportantFunctions/chat'


function Orders(props) {
    const [data, setData] = useState(null)
    const { toast } = useToast()
    const { setBreadcumb, userDoc, user } = useContext(DashboardContext)
    useEffect(() => {
        (async () => {
            const page1 = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_ORDER_COLLECTION_ID,
                [
                    Query.limit(25000),
                    Query.orderDesc('$createdAt'),
                ]
            )
            setData(page1.documents)
        })()
        setBreadcumb('Orders')
    }, [])
    const acceptOrder = async (order) => {
        if (order.riders) {
            toast({
                title: "Sorry!",
                description: "Order has been assign to someone else."
            })
        }else{
            try {
                userDoc?.orders.map(e => {
                    delete e['chat_link']
                })
                const orderArry = userDoc?.orders
                orderArry.push(order)
                const page1 = await databases.updateDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID,
                userDoc.$id,
                {orders: orderArry}
                );
                chatCollection(user.email, order.email, order.$id)
                // TODO: make chat collection between two with emails
                // TODO: send email to customers
                toast({
                    title: "Hurry Customer is Waiting!",
                    description: "Order has been assign to you."
                })
            } catch (error) {
                toast({
                    title: "Something went wrong!",
                    description: "Please try other jobs or try a moment later."
                })
                console.log(error)
            }
            
        }
        
        
    }  

    return (
        <div>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h2 className='text-xl font-bold'>Orders</h2>
            <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                {data && data.map((seg) => (
                    <>
                     {seg.orderStatus === 'pending' &&
                     <div className="rounded-xl bg-muted/50">
                     <Card>
                         <CardHeader>
                             <CardTitle>{seg.customerFirstName} {seg.customerLastName}</CardTitle>
                             <CardDescription><strong>Address: </strong>{seg.deliveryAddressLine1}</CardDescription>
                         </CardHeader>
                         <CardFooter className="flex gap-2">
                             <Dialog>
                                 <DialogTrigger><Button className="text-xs text-indigo-800" variant="ghost">View Info</Button></DialogTrigger>
                                 <DialogContent>
                                     <DialogHeader>
                                         <DialogTitle>Order Information</DialogTitle>
                                         <DialogDescription className="my-2">
                                             <strong>First Name: {seg.customerFirstName}</strong><br />
                                             <strong>Last Name: {seg.customerLastName}</strong><br />
                                             <strong>Phone: {seg.phoneNumber}</strong><br />
                                             <strong>Order Date: {seg.$createdAt?.split('T')[0]}</strong><br />
                                             <strong>Email: {seg.email}</strong><br />
                                             <strong>Address: {seg.deliveryAddressLine1} {seg.deliveryAddressLine2}</strong><br />
                                             <strong>City: {seg.deliveryCity}</strong><br />
                                             <strong>Region: {seg.deliveryRegion}</strong><br />
                                             <strong>Postal Code: {seg.deliveryPostalCode}</strong><br />
                                             <strong>Country: {seg.deliveryCountry}</strong><br />
                                         </DialogDescription>
                                         <DialogDescription className="flex">
                                            <Button className="w-full bg-indigo-950" onClick={() => acceptOrder(seg)}>Accept</Button>
                                         </DialogDescription>
                                     </DialogHeader>
                                 </DialogContent>
                             </Dialog>
                            <Button className="text-xs bg-indigo-900" onClick={() => acceptOrder(seg)}>Accept</Button>
                         </CardFooter>
                     </Card>
                 </div>
                 } 
                 </>
                ))}
                   
            </div>
        </div></div>
    )
}

export default Orders