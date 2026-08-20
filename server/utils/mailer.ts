import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    console.log('[Mailer] SMTP transport configured successfully');
  } else {
    console.log('[Mailer] SMTP credentials not fully configured. Email notifications will be logged to server console.');
  }

  return transporter;
}

export async function sendInquiryNotification(inquiry: {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceInterest?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const mail = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ammautomation.com';
  const from = process.env.SMTP_FROM || '"AMM Automation" <no-reply@ammautomation.com>';

  const textContent = `
NEW INQUIRY RECEIVED - AMM AUTOMATION
-------------------------------------
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone}
Company: ${inquiry.companyName || 'Not specified'}
Service Interest: ${inquiry.serviceInterest || 'General Inquiry'}
Subject: ${inquiry.subject || 'Website Inquiry'}

Message:
${inquiry.message}
-------------------------------------
Received at: ${new Date().toLocaleString()}
`;

  if (mail) {
    try {
      await mail.sendMail({
        from,
        to: adminEmail,
        subject: `[New Inquiry] ${inquiry.subject || 'Website Inquiry'} - ${inquiry.name}`,
        text: textContent
      });
      console.log(`[Mailer] Notification email dispatched to ${adminEmail}`);
    } catch (err: any) {
      console.warn('[Mailer] Failed to send email via SMTP:', err?.message || err);
    }
  } else {
    console.log('[Mailer Log (Console Fallback)]', textContent);
  }
}

export async function sendQuoteNotification(quote: {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  industry?: string;
  requiredService: string;
  projectDescription: string;
  estimatedBudget?: string;
  preferredContactMethod?: string;
}): Promise<void> {
  const mail = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ammautomation.com';
  const from = process.env.SMTP_FROM || '"AMM Automation" <no-reply@ammautomation.com>';

  const textContent = `
NEW QUOTE REQUEST - AMM AUTOMATION
----------------------------------
Client Name: ${quote.name}
Email: ${quote.email}
Phone: ${quote.phone}
Company: ${quote.companyName || 'Not specified'}
Industry: ${quote.industry || 'Not specified'}
Required Service: ${quote.requiredService}
Estimated Budget: ${quote.estimatedBudget || 'Not specified'}
Preferred Contact: ${quote.preferredContactMethod || 'Email'}

Project Requirements:
${quote.projectDescription}
----------------------------------
Received at: ${new Date().toLocaleString()}
`;

  if (mail) {
    try {
      await mail.sendMail({
        from,
        to: adminEmail,
        subject: `[New Quote Request] ${quote.requiredService} - ${quote.name}`,
        text: textContent
      });
      console.log(`[Mailer] Quote notification dispatched to ${adminEmail}`);
    } catch (err: any) {
      console.warn('[Mailer] Failed to send quote email via SMTP:', err?.message || err);
    }
  } else {
    console.log('[Mailer Log (Quote Fallback)]', textContent);
  }
}

export const sendContactNotificationEmail = sendInquiryNotification;
export const sendQuoteNotificationEmail = sendQuoteNotification;
