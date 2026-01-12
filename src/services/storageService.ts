import { ID, storage } from './appwrite';

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'payment_proofs';

export const uploadFile = async (file: File, bucketId: string = BUCKET_ID): Promise<{ fileId: string; fileUrl: string }> => {
    try {
        const response = await storage.createFile(bucketId, ID.unique(), file);
        const fileUrl = storage.getFileView(bucketId, response.$id).toString();
        return { fileId: response.$id, fileUrl };
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw new Error('Falha ao fazer upload do ficheiro');
    }
};

export const uploadPaymentProof = (file: File) => uploadFile(file);
export const uploadManuscriptFile = (file: File) => uploadFile(file);

export const getFileUrl = (fileId: string, bucketId: string = BUCKET_ID): string => {
    return storage.getFileView(bucketId, fileId).toString();
};

export const deleteFile = async (fileId: string, bucketId: string = BUCKET_ID): Promise<void> => {
    try {
        await storage.deleteFile(bucketId, fileId);
    } catch (error) {
        console.error('Erro ao eliminar ficheiro:', error);
        throw error;
    }
};
