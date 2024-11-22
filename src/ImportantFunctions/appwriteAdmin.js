import { Query } from "appwrite"
import { chatRemover } from "./chat"

const { databases } = require("@/appwrite/appwrite")

// fetch all the riders
export const riderGetters = async () => {
    try {
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID, 
            [Query.limit(10000)]
        )
        // console.log(res)
        return res.documents
    } catch (error) {
        console.log(error)
        return null
    }
}

export const riderOneGetter = async (id) => {
    try {
        const user = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID,
            [Query.equal('userId', [id])]
        )
        if (user) {
            // console.log(user)
            const userChat = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
                [Query.equal('rider_email', [user.documents[0].email])]
            )
            if (userChat) {
                userChat.documents.map(chat => {
                    user.documents[0].orders.map(order => {
                        if (chat.order_id === order.$id) order['chat_link'] = chat.link
                    })
                })
                return user.documents[0]
            }
        }
    } catch (error) {
        console.log(error)
        return null
    }
}


export const deliverer = async (order) => {
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
    // console.log(orderId)
    try {
      const res = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_ORDER_COLLECTION_ID,
        orderId,
        order
      )
    //   console.log(res)
      const chatRes = await chatRemover(chatLink)
      if (chatRes){
        location.reload()
      }
    } catch (error) {
      console.log(error)
    }
  }


export const orderCanceller = async (userDoc, order) => {
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
    //   console.log(res)
      location.reload()
    } catch (error) {
      console.log(error)
    }

  }


// delete rider

export const riderRemover = async (user) => {
    try {
        const res = await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_RIDER_COLLECTION_ID,
            user.$id,
          )
        //   console.log(res)
          location.reload()
        } catch (error) {
          console.log(error)
        }
}

// fetch all orders 
export const ordersGetter = async () => {
    try {
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_ORDER_COLLECTION_ID, 
            [
                Query.limit(10000),
                Query.orderDesc('$createdAt'),

            ]
        )
        // console.log(res.documents)
        return res.documents
    } catch (error) {
        console.log(error)
    }
}

// delete order

export const orderRemover = async (orderId) => {
    try {
        const res = await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_ORDER_COLLECTION_ID,
            orderId
        )
        location.reload()
    } catch (error) {
        console.log(error)
    }
}