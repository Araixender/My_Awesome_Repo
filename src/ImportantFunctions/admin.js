import { databases } from "@/appwrite/appwrite";
import { ID, Query } from "appwrite";

const { getUser } = require("@/appwrite/auth");


// check admin 
export const adminChecker = async () => {
    const user = await getUser()
    const userID = user?.$id
    try {
        const userExists = await databases.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_ADMIN_COLLECTION_ID,
            [
                Query.equal("user_id", userID)
            ]
        )
        if (userExists.total === 0) return false
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

// create admin
export const adminCreator = async () => {
    const user = await getUser()
    const userEmail = user.email
    const userID = user.$id
    try {
        const userExists = await adminChecker()
        if (!userExists) {
            const res = await databases.createDocument(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_ADMIN_COLLECTION_ID,
                ID.unique(),
                {
                    user_id: userID,
                    user_email: userEmail
                }
            )
            return true
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

