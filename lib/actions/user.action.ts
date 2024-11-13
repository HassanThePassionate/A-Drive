"use server"

import { ID, Query } from "node-appwrite"
import { createAdminClient, createClientSession } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { parseStringify } from "../utils"
import { cookies } from "next/headers"
import { avatarPlaceholderUrl } from "@/constant"
import { redirect } from "next/navigation"

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
export const sendEmailOTP = async ({email}:{email:string}) => {
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
          avatar: avatarPlaceholderUrl,
          accountId,
        },
      );
    }
  
    return parseStringify({accountId})
}
export const verifySecret = async ({accountId,password}:{accountId:string, password:string}) => {
try {
  const {account} = await createAdminClient();
  const session = await account.createSession(accountId, password);
  (await cookies()).set('appwrite-session',session.secret,{
    path: '/',
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
  })
  return parseStringify({sessionId: session.$id})
} catch (error) {
  console.log('Failed to verify secret', error);
}

}

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createClientSession();

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", result.$id)],
    );

    if (user.total <= 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};
export const signOutUser = async () => {
  try {
    const { account } = await createClientSession();
   account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    console.log(error);
  }finally{
    redirect('/sign-in')
  }
};
export const signInUser = async ({ email }:{email:string}) => {
  try {
    const existingUser = await getUserByEmail(email);
    if(existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({accountId: existingUser.accountId})
    }
    return parseStringify({accountId: null, error: 'User not found'})
  } catch (error) {
    handleError(error, 'Failed to sign in')
    
  }
}