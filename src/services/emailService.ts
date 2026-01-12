import { messaging } from './appwrite';

const EDITORA_EMAIL = 'geral@editoragraca.com'; // Email da editora

interface EmailData {
    to: string[];
    subject: string;
    html: string;
}

// Usar Appwrite Messaging para enviar emails
const sendEmail = async ({ to, subject, html }: EmailData): Promise<void> => {
    try {
        // Appwrite Messaging API
        // Note: Você precisará configurar um provider de email no Appwrite Console
        await messaging.createEmail(
            to,
            subject,
            html
        );
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        // Em desenvolvimento, apenas log o erro mas não falhar
        console.log('Email que seria enviado:', { to, subject, html });
    }
};

export const sendPaymentProofToAuthor = async (
    authorEmail: string,
    authorName: string,
    readerName: string,
    bookTitles: string[],
    proofUrl: string
): Promise<void> => {
    const html = `
        <h2>Novo Comprovante de Pagamento Recebido</h2>
        <p>Olá <strong>${authorName}</strong>,</p>
        <p>O leitor <strong>${readerName}</strong> enviou um comprovante de pagamento para:</p>
        <ul>
            ${bookTitles.map(title => `<li>${title}</li>`).join('')}
        </ul>
        <p><a href="${proofUrl}" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Ver Comprovante</a></p>
        <p>Por favor, verifique o comprovante e aguarde a confirmação da Editora Graça.</p>
        <br>
        <p>Atenciosamente,<br><strong>Editora Graça</strong></p>
    `;

    await sendEmail({
        to: [authorEmail],
        subject: `Novo Comprovante de Pagamento - ${readerName}`,
        html
    });
};

export const sendPaymentProofToEditora = async (
    readerName: string,
    readerEmail: string,
    bookTitles: string[],
    totalAmount: number,
    proofUrl: string
): Promise<void> => {
    const html = `
        <h2>Novo Comprovante de Pagamento</h2>
        <p><strong>Cliente:</strong> ${readerName} (${readerEmail})</p>
        <p><strong>Livros:</strong></p>
        <ul>
            ${bookTitles.map(title => `<li>${title}</li>`).join('')}
        </ul>
        <p><strong>Valor Total:</strong> ${totalAmount.toLocaleString()} Kz</p>
        <p><a href="${proofUrl}" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Ver Comprovante</a></p>
        <br>
        <p>Aceda ao painel administrativo para confirmar o pagamento.</p>
    `;

    await sendEmail({
        to: [EDITORA_EMAIL],
        subject: `Comprovante de Pagamento - ${readerName}`,
        html
    });
};

export const sendPaymentConfirmationToReader = async (
    readerEmail: string,
    readerName: string,
    bookTitles: string[]
): Promise<void> => {
    const html = `
        <h2>Pagamento Confirmado! 🎉</h2>
        <p>Olá <strong>${readerName}</strong>,</p>
        <p>O seu pagamento foi confirmado com sucesso!</p>
        <p><strong>Livros adquiridos:</strong></p>
        <ul>
            ${bookTitles.map(title => `<li>${title}</li>`).join('')}
        </ul>
        <p>Agora pode aceder aos seus livros no seu painel de leitor.</p>
        <p><a href="${window.location.origin}" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Aceder à Minha Biblioteca</a></p>
        <br>
        <p>Obrigado pela sua compra!<br><strong>Editora Graça</strong></p>
    `;

    await sendEmail({
        to: [readerEmail],
        subject: 'Pagamento Confirmado - Editora Graça',
        html
    });
};
