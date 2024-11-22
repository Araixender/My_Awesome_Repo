"use client";
import React, { useEffect, useState } from 'react'
import { DashboardContext } from './dashboard'
import { getUser } from '@/appwrite/auth'
import { databases } from '@/appwrite/appwrite';
import { Query } from 'appwrite';
import { useRouter } from 'next/navigation';


function DashboardProvider({children}) {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [userDoc, setUserDoc] = useState(null)
    const [userChat, setUserChat] = useState(null)
    const [breadcumb, setBreadcumb] = useState("Home")
    useEffect(() => {
        const userFetch = async () => {
            try {
                const usr = await getUser()  
                setUser(usr) 
                // console.log(usr)
            } catch (error) {
                console.log(error)
            }    
        }
        userFetch()
    }, [])

    useEffect(() => {
        const userDocFetch = async () => {
            try {
                const usrDoc = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DATABASE_ID,
                    process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID,
                    [Query.equal('userId', [user.$id])]
                )
                // console.log(usrDoc)
                setUserDoc(usrDoc.documents[0])
                // if (user && usrDoc.documents.length === 0){
                //     router.push("/rider/working-range")
                // }
            } catch (error) {
                console.log(error)
            }
        }

        if (user) {
            userDocFetch()
        }
    }, [user])

    useEffect(() => {
        const userChat = async () => {
            try {
                const usrDoc = await databases.listDocuments(
                    process.env.NEXT_PUBLIC_DATABASE_ID,
                    process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
                    [Query.equal('rider_email', [user.email])]
                )
                setUserChat(usrDoc.documents)
                
            } catch (error) {
                console.log(error)
            }
        }

        if (user) {
            userChat()
            
        }
    }, [user])

    const linkChatLink = () => {
        userChat.map((orderId) => {
           userDoc.orders.map((order_doc) => {
               if (orderId.order_id === order_doc.$id){
                order_doc['chat_link'] = orderId.link
               }
           })
        })
        // console.log(userDoc.orders)
    }

    useEffect(() => {
        if (userChat && userDoc){
            linkChatLink()
        }
    }, [userChat, userDoc])
  return (
    <DashboardContext.Provider value={{user, userDoc, breadcumb, setBreadcumb}}>
        {children}
    </DashboardContext.Provider>
  )
}

export default DashboardProvider