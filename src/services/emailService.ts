import emailjs from '@emailjs/browser';

// Using placeholders for credentials. User will need to replace these with real values from EmailJS dashboard.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder';

export interface EmailParams {
    [key: string]: unknown;
}

export const sendEmail = async (templateId: string, params: EmailParams) => {
    try {
        const response = await emailjs.send(
            SERVICE_ID,
            templateId,
            params,
            PUBLIC_KEY
        );
        return response;
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw error;
    }
};
