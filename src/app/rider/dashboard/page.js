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
import { DashboardContext } from "@/dashboardContext/dashboard";
import { databases } from "@/appwrite/appwrite";
import { Query } from "appwrite";

function DashboardRiderFunction() {
  const { setBreadcumb, userDoc, user } = useContext(DashboardContext)
  const [totalOrders, setTotalOrders] = useState(0)
  const [pendingOrders, setPendingOrders]= useState()
  
  useEffect(() => {
    (async () => {
      const page = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_ORDER_COLLECTION_ID,
        [
          Query.limit(2500),
        ]
      )
      setTotalOrders(page.total)
      setPendingOrders(page.documents)
    })()
  }, [])
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="aspect-auto rounded-xl bg-muted/50 flex p-7 flex-col" >
          <h3 className="text-gray-900 text-sm">Total Numbers of Orders</h3>
          <h1 className="text-6xl">{totalOrders}</h1>
        </div>
        <div className="aspect-auto rounded-xl bg-muted/50 flex p-7 flex-col" >
          <h3 className="text-gray-900 text-sm">Total Numbers of Orders You Have</h3>
          <h1 className="text-6xl">{userDoc?.orders.length || 0}</h1>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Postal Code</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingOrders && pendingOrders.map(e => (
               <TableRow key={e.$id + Date.now()}>
               <TableCell>{e.orderStatus}</TableCell>
               <TableCell className="font-medium">{e.deliveryPostalCode}</TableCell>
               <TableCell>{e.deliveryAddressLine1} {e.deliveryAddressLine2 }</TableCell>
               <TableCell className="text-right">{e.deliveryCity}</TableCell>
             </TableRow>
            ))}
           
          </TableBody>
        </Table>

      </div>
    </>
  );
}

export default DashboardRiderFunction;
