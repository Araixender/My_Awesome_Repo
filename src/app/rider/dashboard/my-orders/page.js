"use client";
import React, { useContext, useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { DashboardContext } from '@/dashboardContext/dashboard'
import Link from 'next/link';
import { databases } from '@/appwrite/appwrite';
import { chatRemover } from '@/ImportantFunctions/chat';

function MyOrders() {
  const { userDoc, setBreadcumb } = useContext(DashboardContext)
  const [orders, setOrders] = useState(null)
  useEffect(() => {
    setOrders(userDoc?.orders)
    setBreadcumb("My Orders")
  }, [userDoc])

  const deliverer = async (order) => {
    const chatLink = order.chat_link
    const orderId = order.$id
    delete order.chat_link
    delete order.$collectionId
    delete order.$createdAt    
    delete order.$databaseId    
    delete order.$id
    delete order.$permissions    
    delete order.$updatedAt   
    order['orderStatus'] = "delivered"
    try {
      const res = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_ORDER_COLLECTION_ID,
        orderId,
        order
      )
      const chatRes = await chatRemover(chatLink)
      if (chatRes){
        location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const orderCanceller = async (order) => {
    const userID = userDoc.$id
    userDoc.orders = userDoc.orders.filter(e => e !== order)
    userDoc.orders.map(e => delete e.chat_link)
    delete userDoc.$collectionId
    delete userDoc.$createdAt    
    delete userDoc.$databaseId    
    delete userDoc.$id
    delete userDoc.$permissions    
    delete userDoc.$updatedAt 
    try {
      const res = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID,
        userID,
        userDoc
      )
      location.reload()
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h2 className='text-xl font-bold'>My Orders</h2>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {orders ? orders.map((e) => (
            <Card key={e.$id + Date.now()}>
            <CardHeader>
              <CardTitle>{e.customerFirstName} {e.customerLastName}</CardTitle>
              <CardDescription>{e.orderStatus}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Address:<span className='text-gray-600'>{e.deliveryAddressLine1}</span></strong></p>
            </CardContent>
            <CardFooter className="gap-1">
            {e.chat_link && <><Button className="bg-indigo-950" onClick={() => deliverer(e)}>Delivered</Button>
              <Link href={"/chat/" + e.chat_link} target="_blank"><Button className="bg-indigo-950">Chat</Button></Link>
              <Button className="bg-indigo-600" onClick={() => orderCanceller(e)}>Cancel</Button></>}
            </CardFooter>
          </Card>
        )): <>Loading</>}
        

      </div>
    </div>
  )
}

export default MyOrders