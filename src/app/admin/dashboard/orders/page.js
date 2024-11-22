"use client";
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { orderRemover, ordersGetter } from '@/ImportantFunctions/appwriteAdmin'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardContext } from '@/dashboardContext/dashboard';


function AdminDashboardOrders() {
    const [orders, setOrders] = useState(null)
    const {setBreadcumb} = useContext(DashboardContext)
    useEffect(() => {

        (async () => {
            setOrders(await ordersGetter())
        })()
        setBreadcumb("Orders")
    }, [])
    return (
        <div>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h2 className='text-xl font-bold'>Orders</h2>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    {orders && orders.map((seg) => (
                        <>

                            <div className="rounded-xl bg-muted/50" key={seg.$id + Date.now()}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{seg.customerFirstName + seg.customerLastName}</CardTitle>
                                        <CardDescription><strong>Address: </strong>{seg.deliveryAddressLine1 + " " + seg.deliveryAddressLine2}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger><Button className="text-xs bg-indigo-900">View Info</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Order Information</DialogTitle>
                                                    <DialogDescription>
                                                        <span><strong>First Name: </strong>{seg.customerFirstName}</span><br />
                                                        <span><strong>Last Name: </strong>{seg.customerLastName}</span><br />
                                                        <span><strong>Phone: </strong>{seg.phoneNumber}</span><br />
                                                        <span><strong>Order Date: </strong>{seg.$createdAt.split("T")[0]}</span><br />
                                                        <span><strong>Email: </strong>{seg.email}</span><br />
                                                        <span><strong>Address: </strong>{seg.deliveryAddressLine1} {seg.deliveryAddressLine2}</span><br />
                                                        <span><strong>City: </strong>{seg.deliveryCity	}</span><br />
                                                        <span><strong>Region: </strong>{seg.deliveryRegion	}</span><br />
                                                        <span><strong>Postal Code: </strong>{seg.deliveryPostalCode}</span><br />
                                                        <span><strong>Country: </strong>{seg.deliveryCountry}</span><br />
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <Button className="text-xs text-indigo-900" variant="ghost" onClick={() => orderRemover(seg.$id)}>Delete</Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </>
                    ))}

                </div>
            </div></div>
    )
}

export default AdminDashboardOrders