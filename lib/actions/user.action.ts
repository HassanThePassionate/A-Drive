"use server"

import { ID, Query } from "node-appwrite"
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { parseStringify } from "../utils"

const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient()
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('email', [email])],
    )
    return result.total > 0? result.documents[0] : null
}
const handleError = (error: unknown, message:string) => {
    console.error(message, error);
    throw error
}
const sendEmailOTP = async ({email}:{email:string}) => {
    const {account} = await createAdminClient()
    try {
        const session = await account.createEmailToken(ID.unique(),email)
        return session.userId
    } catch (error) {
       handleError(error, 'Failed to send OTP')
        
    }
}
export const createAccount = async ({
    full_name,
    email,
  }: {
    full_name: string;
    email: string;
  }) => {
    const existingUser = await getUserByEmail(email);
  
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");
  
    if (!existingUser) {
      const { databases } = await createAdminClient();
  
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          full_name,
          email,
          avatar: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
          accountId,
        },
      );
    }
  
    return parseStringify({accountId})
}