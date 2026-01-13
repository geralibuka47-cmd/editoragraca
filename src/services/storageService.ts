import { supabase } from './supabase';

const BUCKET_NAME = 'editora-public'; // Standard bucket name for our files

export const uploadFile = async (file: File, bucketId: string = BUCKET_NAME): Promise<{ fileId: string; fileUrl: string }> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucketId)
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucketId)
            .getPublicUrl(filePath);

        return { fileId: data.path, fileUrl: publicUrl };
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw new Error('Falha ao fazer upload do ficheiro');
    }
};

export const uploadPaymentProof = (file: File) => uploadFile(file);
export const uploadManuscriptFile = (file: File) => uploadFile(file);

export const getFileUrl = (fileId: string, bucketId: string = BUCKET_NAME): string => {
    const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(fileId);
    return publicUrl;
};

export const deleteFile = async (fileId: string, bucketId: string = BUCKET_NAME): Promise<void> => {
    try {
        const { error } = await supabase.storage
            .from(bucketId)
            .remove([fileId]);

        if (error) throw error;
    } catch (error) {
        console.error('Erro ao eliminar ficheiro:', error);
        throw error;
    }
};
