import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

// TODO: maybe rewrite with a hook 
export const getUploadLink = async (imageFile: File) => {
    const storageRef = ref(storage, `postsImages/${imageFile.name}-${Date.now()}`); // Unique file name
    try {
      const snapshot = await uploadBytes(storageRef, imageFile); // Upload file
      const url = await getDownloadURL(snapshot.ref); // Get file URL from Firebase Storage
  
      return url;
    } catch (error) {
      console.error("Error uploading file:", error);
    }

}