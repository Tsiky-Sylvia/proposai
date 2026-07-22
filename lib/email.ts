import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Email envoyé au client avec le lien de la proposition
export async function sendProposalEmail({
  clientEmail,
  clientName,
  freelanceName,
  proposalTitle,
  amount,
  currency,
  publicUrl,
  validUntil,
}: {
  clientEmail: string;
  clientName: string;
  freelanceName: string;
  proposalTitle: string;
  amount: number;
  currency: string;
  publicUrl: string;
  validUntil?: string | null;
}) {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: clientEmail,
    subject: `Proposition commerciale: ${proposalTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 32px;">📄</span>
              <h1 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 8px 0 0;">
                ProposAI
              </h1>
            </div>

            <!-- Salutation -->
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Bonjour <strong>${clientName}</strong>,
            </p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              <strong>${freelanceName}</strong> vous a envoyé une proposition commerciale pour le projet suivant:
            </p>

            <!-- Proposition card -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 6px;">
                Proposition
              </p>
              <p style="color: #1f2937; font-size: 17px; font-weight: 700; margin: 0 0 12px;">
                ${proposalTitle}
              </p>
              <p style="color: #2563eb; font-size: 24px; font-weight: 700; margin: 0 0 8px;">
                ${amount.toLocaleString("fr-FR")} ${currency}
              </p>
              ${
                validUntil
                  ? `<p style="color: #9ca3af; font-size: 13px; margin: 0;">
                Valide jusqu'au ${new Date(validUntil).toLocaleDateString("fr-FR")}
              </p>`
                  : ""
              }
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 32px;">
              
                href="${publicUrl}"
                style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;"
              >
                Consulter la proposition →
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
              Vous pouvez également copier ce lien dans votre navigateur:
            </p>
            <p style="color: #2563eb; font-size: 12px; word-break: break-all; margin: 0 0 32px;">
              ${publicUrl}
            </p>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Généré avec ProposAI — Si vous n'attendiez pas cet email, vous pouvez l'ignorer.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

// Email envoyé au freelance quand le client signe
export async function sendSignatureNotificationEmail({
  freelanceEmail,
  freelanceName,
  clientName,
  proposalTitle,
  amount,
  currency,
  signedAt,
  proposalUrl,
}: {
  freelanceEmail: string;
  freelanceName: string;
  clientName: string;
  proposalTitle: string;
  amount: number;
  currency: string;
  signedAt: string;
  proposalUrl: string;
}) {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: freelanceEmail,
    subject: `🎉 ${clientName} a accepté votre proposition !`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">🎉</span>
              <h1 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 12px 0 0;">
                Proposition acceptée !
              </h1>
            </div>

            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Bonjour <strong>${freelanceName}</strong>,
            </p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              Bonne nouvelle ! <strong>${clientName}</strong> vient d'accepter et signer votre proposition commerciale.
            </p>

            <!-- Détails -->
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #bbf7d0;">
              <p style="color: #166534; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 6px;">
                Proposition signée
              </p>
              <p style="color: #1f2937; font-size: 17px; font-weight: 700; margin: 0 0 8px;">
                ${proposalTitle}
              </p>
              <p style="color: #16a34a; font-size: 24px; font-weight: 700; margin: 0 0 8px;">
                ${amount.toLocaleString("fr-FR")} ${currency}
              </p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">
                Signé le ${new Date(signedAt).toLocaleDateString("fr-FR")} à ${new Date(signedAt).toLocaleTimeString("fr-FR")}
              </p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 32px;">
              
                href="${proposalUrl}"
                style="display: inline-block; background-color: #16a34a; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;"
              >
                Voir la proposition →
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ProposAI — Vous recevez cet email car vous utilisez ProposAI.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendDeclineNotificationEmail({
  freelanceEmail,
  freelanceName,
  clientName,
  proposalTitle,
  reason,
  proposalUrl,
}: {
  freelanceEmail: string;
  freelanceName: string;
  clientName: string;
  proposalTitle: string;
  reason: string | null;
  proposalUrl: string;
}) {
  return resend.emails.send({
    from: "ProposAI <onboarding@resend.dev>",
    to: freelanceEmail,
    subject: `❌ ${clientName} a refusé votre proposition`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">😔</span>
              <h1 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 12px 0 0;">
                Proposition refusée
              </h1>
            </div>

            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Bonjour <strong>${freelanceName}</strong>,
            </p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              <strong>${clientName}</strong> a refusé votre proposition commerciale.
            </p>

            <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #fecaca;">
              <p style="color: #991b1b; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 6px;">
                Proposition refusée
              </p>
              <p style="color: #1f2937; font-size: 17px; font-weight: 700; margin: 0 0 12px;">
                ${proposalTitle}
              </p>
              ${
                reason
                  ? `<p style="color: #6b7280; font-size: 13px; margin: 0;">
                <strong>Motif:</strong> ${reason}
              </p>`
                  : `<p style="color: #9ca3af; font-size: 13px; margin: 0; font-style: italic;">
                Aucun motif fourni
              </p>`
              }
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              
                href="${proposalUrl}"
                style="display: inline-block; background-color: #6b7280; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;"
              >
                Voir la proposition →
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ProposAI — Ne vous découragez pas, chaque refus est une opportunité d'amélioration.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export async function sendRenewRequestEmail({
  freelanceEmail,
  freelanceName,
  clientName,
  proposalTitle,
  message,
  proposalUrl,
}: {
  freelanceEmail: string;
  freelanceName: string;
  clientName: string;
  proposalTitle: string;
  message: string | null;
  proposalUrl: string;
}) {
  return resend.emails.send({
    from: "ProposAI <onboarding@resend.dev>",
    to: freelanceEmail,
    subject: `🔄 ${clientName} demande une nouvelle proposition`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
          <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
            
            <div style="text-align: center; margin-bottom: 32px;">
              <span style="font-size: 48px;">🔄</span>
              <h1 style="font-size: 22px; font-weight: 700; color: #1f2937; margin: 12px 0 0;">
                Demande de renouvellement
              </h1>
            </div>

            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
              Bonjour <strong>${freelanceName}</strong>,
            </p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
              <strong>${clientName}</strong> souhaite recevoir une nouvelle proposition pour le projet suivant.
            </p>

            <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
              <p style="color: #1e40af; font-size: 12px; text-transform: uppercase; font-weight: 600; margin: 0 0 6px;">
                Proposition concernée
              </p>
              <p style="color: #1f2937; font-size: 17px; font-weight: 700; margin: 0 0 12px;">
                ${proposalTitle}
              </p>
              ${
                message
                  ? `<p style="color: #374151; font-size: 13px; margin: 0;">
                <strong>Message du client:</strong> ${message}
              </p>`
                  : `<p style="color: #9ca3af; font-size: 13px; margin: 0; font-style: italic;">
                Aucun message fourni
              </p>`
              }
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
              
                href="${proposalUrl}"
                style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;"
              >
                Voir la proposition et renouveler →
              </a>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ProposAI — Une nouvelle opportunité de conclure !
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}