// src/auth.js
import { ID } from 'appwrite'
import { account, OAuthProvider } from './appwrite'


export const loginWithGoogle = async (url) => {
  try {
    await account.createOAuth2Session(OAuthProvider.Google, 
        `${process.env.NEXT_PUBLIC_URL}${url}`, 
        `${process.env.NEXT_PUBLIC_URL}`)
  } catch (error) {
    console.error(error)
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.error(error)
  }
}

export const getUser = async () => {
  try {
    return await account.get()
  } catch (error) {
    console.error(error)
  }
}

export const createEmailUser = async (email, password) => {
  try {
    const promise = await account.create(ID.unique(), email, password);
    // console.log(promise)
    const res = await loginEmailUser(email, password)
    return res
  } catch (error) {
    console.log(error)
    return false
  }
}

export const loginEmailUser = async (email, password) => {
  try {
    const promise = await account.createEmailPasswordSession(email, password);
    return true;
  } catch (error) {
    console.log(error)
    return false
  }
}

