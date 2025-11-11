


import { Resend } from 'resend';
import { EmailTemplate } from '../src/components/ui/email-template';

export const resend = new Resend(import.meta.env.RESEND_API_KEY);

type Language = 'en' | 'ro';

const getPasswordResetContent = (language: Language, name?: string) => {
  const translations = {
    en: {
      greeting: `Hello ${name || 'there'},`,
      requested: 'You requested a password reset for your Doors account.',
      instruction: 'Click the button below to reset your password. This link will expire in 15 minutes.',
      ignore: "If you didn't request this, you can safely ignore this email.",
      heading: 'Reset your password',
      action: 'Reset Password',
      subject: 'Reset your password - Doors'
    },
    ro: {
      greeting: `Salut ${name || 'acolo'},`,
      requested: 'Ați solicitat o resetare a parolei pentru contul dvs. Doors.',
      instruction: 'Faceți clic pe butonul de mai jos pentru a vă reseta parola. Acest link va expira în 15 minute.',
      ignore: 'Dacă nu ați solicitat acest lucru, puteți ignora în siguranță acest e-mail.',
      heading: 'Resetați-vă parola',
      action: 'Resetează Parola',
      subject: 'Resetați-vă parola - Doors'
    }
  };

  return translations[language];
};

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
  language: Language = 'en',
  name?: string
) => {
  try {
    const content = getPasswordResetContent(language, name);

    const { data, error } = await resend.emails.send({
      from: 'contact@doors.ro',
      to: [email],
      subject: content.subject,
      react: EmailTemplate({
        action: content.action,
        content: (
          <>
            <p>{content.greeting}</p>
            <p>{content.requested}</p>
            <p>{content.instruction}</p>
            <p>{content.ignore}</p>
          </>
        ),
        heading: content.heading,
        siteName: "Doors",
        baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
        url: resetUrl
      })
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return data;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
