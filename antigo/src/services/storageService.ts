import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

const BUCKET_NAME = 'editora-public'; // Firebase Storage bucket (configured in Firebase Console)

export const uploadFile = async (file: File, bucketPath: string = BUCKET_NAME): Promise<{ fileId: string; fileUrl: string }> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${bucketPath}/${fileName}`;

        // Create storage reference
        const storageRef = ref(storage, filePath);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Get download URL
        const fileUrl = await getDownloadURL(snapshot.ref);

        return { fileId: filePath, fileUrl };
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw new Error('Falha ao fazer upload do ficheiro');
    }
};

export const uploadPaymentProof = (file: File) => uploadFile(file, 'payment-proofs');
export const uploadManuscriptFile = (file: File) => uploadFile(file, 'manuscripts');
export const uploadBookCover = (file: File) => uploadFile(file, 'book-covers');
export const uploadProfilePicture = (file: File) => uploadFile(file, 'profile-pictures');

export const getFileUrl = async (fileId: string): Promise<string> => {
    try {
        const storageRef = ref(storage, fileId);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error('Erro ao obter URL do ficheiro:', error);
        throw error;
    }
};

export const deleteFile = async (fileId: string): Promise<void> => {
    try {
        const storageRef = ref(storage, fileId);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Erro ao eliminar ficheiro:', error);
        throw error;
    }
};
