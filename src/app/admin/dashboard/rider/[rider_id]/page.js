'use client'
import React, { useContext, useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deliverer, orderCanceller, riderOneGetter } from "@/ImportantFunctions/appwriteAdmin";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function RiderInfo() {
    const params = useParams()
    const [user, setUser] = useState(null)
    useEffect(() => {
        (async () => {
            setUser(await riderOneGetter(params.rider_id))
        })()
    }, [])
    return (
        <>
            {user &&
                <>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50 flex p-7 flex-col" >
                            <h3 className="text-gray-900 text-sm">Total Numbers of Orders</h3>
                            <h1 className="text-6xl">{user.orders.length || 0}</h1>
                        </div>
                        <div className="aspect-video rounded-xl bg-muted/50 flex p-7 flex-col" >
                            <h3 className="text-gray-900 text-sm">Rider Travel From</h3>
                            <h1 className="text-xl">{user.from_address}</h1>
                        </div>
                        <div className="aspect-video rounded-xl bg-muted/50 flex p-7 flex-col" >
                            <h3 className="text-gray-900 text-sm">Rider Travel To</h3>
                            <h1 className="text-xl">{user.to_address}</h1>
                        </div>
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user.orders.map(e => (
                                    <TableRow key={e.$id + Date.now()}>
                                        <TableCell>{e.orderStatus}</TableCell>
                                        <TableCell className="font-medium">{e.customerFirstName + e.customerLastName}</TableCell>
                                        <TableCell>{e.deliveryAddressLine1} {e.deliveryAddressLine2}</TableCell>
                                        <TableCell className="text-right gap-1 flex justify-end text-blue-600">
                                            <>{e.chat_link ? <>
                                                <Button onClick={() => deliverer(e)} variant="ghost">Delivered</Button>
                                                <Link href={"/chat/" + e.chat_link} target="_blank"><Button variant="ghost">Chat</Button></Link>
                                                <Link href={"/live/" + e.chat_link} target="_blank"><Button variant="ghost">Live</Button></Link>
                                                <Button variant="ghost" onClick={() => orderCanceller(user, e)}>Cancel</Button></> : <span className="text-gray-400">No Action for Delivered Order</span>}</>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>

                    </div>
                </>
            }
        </>
    )
}

export default RiderInfo