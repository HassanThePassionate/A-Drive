"use server"

import { InputFile } from "node-appwrite/file"
import { createAdminClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { ID } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"

export const uploadFile = async ({file, ownerId, accountId,path}:UploadFileProps) => {
const {storage,databases} = await createAdminClient()
try {
    const inputFile = InputFile.fromBuffer(file,file.name)
    const bucketFile = await storage.createFile(
        appwriteConfig.bucketId,
         ID.unique(),
          inputFile)
          const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size:bucketFile.sizeOriginal,
            accountId,
            owner:ownerId,
            users: [],
            bucketFileId: bucketFile.$id,
          }
          const newFile = await databases.createDocument(appwriteConfig.databaseId,appwriteConfig.fileCollectionId,ID.unique(),fileDocument)
          .catch(async (error:unknown)=> {
            await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
            throw new Error('Failed to upload file')
          })
          revalidatePath(path)
          return parseStringify(newFile)
} catch (error) {
    console.log(error);
    
}
}