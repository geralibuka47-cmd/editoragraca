const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = import.meta.env.VITE_BREVO_LIST_ID;

export const subscribeToNewsletter = async (email: string): Promise<boolean> => {
    if (!BREVO_API_KEY) {
        console.warn('Brevo API Key not found. Newsletter subscription is in simulation mode.');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return true;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                email,
                listIds: BREVO_LIST_ID ? [parseInt(BREVO_LIST_ID)] : []
            })
        });

        if (response.ok || response.status === 204 || response.status === 201) {
            return true;
        }

        const data = await response.json();
        // Handle case where user is already in the list
        if (data.code === 'duplicate_parameter') {
            return true;
        }

        console.error('Brevo API Error:', data);
        return false;
    } catch (error) {
        console.error('Newsletter Subscription Error:', error);
        return false;
    }
};
