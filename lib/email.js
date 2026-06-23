import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactNotification({ to, contact }) {
  const { name, company, email, phone, message, productInterest } = contact;

  await resend.emails.send({
    from: 'StockAlerte <onboarding@resend.dev>',
    to,
    subject: `Nouveau message de contact — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e85d04">Nouveau message de contact</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;font-weight:bold;width:140px">Nom</td><td>${name}</td></tr>
          ${company ? `<tr><td style="padding:8px 0;font-weight:bold">Société</td><td>${company}</td></tr>` : ''}
          <tr><td style="padding:8px 0;font-weight:bold">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;font-weight:bold">Téléphone</td><td>${phone}</td></tr>` : ''}
          ${productInterest ? `<tr><td style="padding:8px 0;font-weight:bold">Produit</td><td>${productInterest}</td></tr>` : ''}
        </table>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-weight:bold;margin-bottom:4px">Message</p>
        <p style="white-space:pre-wrap;background:#f9f9f9;padding:12px;border-radius:4px">${message}</p>
      </div>
    `,
  });
}
