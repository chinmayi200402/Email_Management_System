import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, from = "noreply@yourdomain.com" } = options;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, id: data?.id };
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendBulkEmails(
  recipients: Array<{ email: string; name: string }>,
  subject: string,
  html: string,
  onProgress?: (sent: number, total: number) => void
) {
  const results = [];
  const total = recipients.length;

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    
    try {
      const result = await sendEmail({
        to: recipient.email,
        subject,
        html,
      });
      
      results.push({
        email: recipient.email,
        name: recipient.name,
        status: "sent",
        resendId: result.id,
      });
    } catch (error: any) {
      results.push({
        email: recipient.email,
        name: recipient.name,
        status: "failed",
        error: error.message,
      });
    }

    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
