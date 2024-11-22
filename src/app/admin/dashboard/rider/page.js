"use client";
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { riderGetters, riderRemover } from '@/ImportantFunctions/appwriteAdmin'
import Link from 'next/link';
import { DashboardContext } from '@/dashboardContext/dashboard';


function AdminDashboardRider() {
    const {setBreadcumb} = useContext(DashboardContext)
    const [riders, setRiders] = useState(null)
    useEffect(() => {
        (async () => {
            setRiders(await riderGetters())
        })()
        setBreadcumb("Riders")
    }, [])
  return (
    <div>
    <div className="flex flex-1 flex-col gap-4 p-4">
        <h2 className='text-xl font-bold'>Riders</h2>
    <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {riders && riders.map((seg) => (
            <>

             <div className="rounded-xl bg-muted/50" key={seg.$id + Date.now()}>
             <Card>
                 <CardHeader>
                     <CardTitle>{seg.name ||seg.email}</CardTitle>
                     <CardDescription><strong>No of orders: </strong>{seg.orders.length}</CardDescription>
                 </CardHeader>
                 <CardFooter className="flex gap-2">
                    <Link href={"/admin/dashboard/rider/" + seg.userId}><Button className="text-xs bg-indigo-900">Show details</Button></Link>
                    <Button className="text-xs text-indigo-800" variant="ghost" onClick={() => riderRemover(seg)}>Remove</Button>
                 </CardFooter>
             </Card>
         </div>
         </>
        ))}
           
    </div>
</div></div>
  )
}

export default AdminDashboardRider