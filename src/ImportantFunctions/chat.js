// save chat link with email

const { databases } = require("@/appwrite/appwrite");
const { ID, Query } = require("appwrite");

// Generate string
export function generateUniqueString() {
    const timestamp = Date.now().toString(36); // Convert current time to base-36
    const randomPart = Math.random().toString(36).substring(2, 15); // Generate a random string
    return `${timestamp}-${randomPart}`;
}
// make collection 
export const chatCollection = async (rider_email, customer_email, order_id) => {
    const link = generateUniqueString()
    try {
        const res = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
            ID.unique(),
            {
                rider_email,
                customer_email,
                link,
                order_id
            }
        )
        genEmail(link, customer_email)
    } catch (error) {
        console.log(error)
    }
}


// make email
export const genEmail = async (link, customer_email) => {
    try {
       const res = await fetch('/api/mail', {
        method: "POST",
        body: JSON.stringify({link, customer_email})
       })
    //    console.log(res)
    } catch (error) {
        console.log("Email cannot be send: " + error)
    }

}


// verify persons
export const verifyChat = async (chatLink, email) => {
    try {
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
            [
                Query.equal("link", chatLink)
            ]
        )
        // console.log(res.documents[0])
        if ((res.documents[0].customer_email ||  res.documents[0].rider_email) === email){
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

export const messageCollection = async (link, message, rider) => {
    try {
        const res = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_MESSAGE_COLLECTION_ID,
            ID.unique(),
            {
                link,
                message,
                rider,
            }
        )
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


export const fetchMessages = async (chatLink) => {
    try {
        const res = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_MESSAGE_COLLECTION_ID,
            [
                Query.equal("link", chatLink)
            ]
        )
        // console.log(res.documents)
        
        return res.documents
    } catch (error) {
        console.log(error)
    }
}


// delete chat collection's documents

export const chatRemover = async (chatLink) => {
    try {
        try {
            const res = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
                [
                    Query.equal("link", chatLink)
                ]
            )
            const chatId = res.documents[0].$id

            const remve = await databases.deleteDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_CHAT_COLLECTION_ID,
                chatId
            )
            return true
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)   
    }
}