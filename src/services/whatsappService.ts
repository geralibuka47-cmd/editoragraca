/**
 * Generate WhatsApp link with pre-filled message
 * This is a FREE solution that opens WhatsApp with a message ready to send
 */
export const generateWhatsAppLink = (
    phoneNumber: string,
    message: string
): string => {
    // Remove non-numeric characters and ensure it starts with country code
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // WhatsApp link format: https://wa.me/<number>?text=<message>
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const sendPaymentProofWhatsApp = (
    authorWhatsApp: string,
    readerName: string,
    bookTitles: string[],
    proofUrl: string
): string => {
    const message = `
🔔 *Novo Comprovante de Pagamento*

*Cliente:* ${readerName}

*Livros:*
${bookTitles.map((title, i) => `${i + 1}. ${title}`).join('\n')}

*Comprovante:* ${proofUrl}

_Editora Graça_
    `.trim();

    return generateWhatsAppLink(authorWhatsApp, message);
};

/**
 * Opens WhatsApp in a new window/tab
 */
export const openWhatsApp = (link: string): void => {
    window.open(link, '_blank', 'noopener,noreferrer');
};
