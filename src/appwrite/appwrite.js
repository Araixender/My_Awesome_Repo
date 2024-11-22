import { Client, Account, OAuthProvider, Databases  } from 'appwrite'

const client = new Client()
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_END_POINT)// The Appwrite API endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)// Your Appwrite project IDexport const account = new Account(client)

const account = new Account(client)
const databases = new Databases(client)
export { OAuthProvider, account, databases }