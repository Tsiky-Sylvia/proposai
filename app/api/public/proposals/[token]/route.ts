import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSignatureNotificationEmail } from "@/lib/email";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { publicToken: token },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable ou lien invalide." },
        { status: 404 }
      );
    }

    // Vérifier si la proposition est expirée
    if (proposal.validUntil && new Date(proposal.validUntil) < new Date()) {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: { status: "EXPIRED" },
      });
      return NextResponse.json(
        { error: "Cette proposition a expiré." },
        { status: 410 }
      );
    }

    // Créer événement VIEWED + mettre à jour statut si SENT
    // On le fait uniquement si le statut est SENT pour ne pas
    // écraser un statut ACCEPTED ou DECLINED
    if (proposal.status === "SENT") {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: {
          status: "VIEWED",
          events: {
            create: {
              type: "VIEWED",
              metadata: JSON.stringify({
                userAgent: req.headers.get("user-agent"),
              }),
            },
          },
        },
      });
    } else if (proposal.status === "DRAFT") {
      // Si DRAFT, on crée juste un événement VIEWED sans changer le statut
      // Le freelance est probablement en train de prévisualiser sa propre proposition
      await prisma.proposalEvent.create({
        data: {
          type: "VIEWED",
          proposalId: proposal.id,
          metadata: JSON.stringify({ preview: true }),
        },
      });
    }

    // Après le prisma.proposal.update, ajoute:
    // Récupérer les infos du freelance pour la notification
    const freelance = await prisma.user.findUnique({
      where: { id: proposal.userId },
    });

    if (freelance) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      
      await sendSignatureNotificationEmail({
        freelanceEmail: freelance.email,
        freelanceName: freelance.name ?? freelance.email,
        clientName: proposal.clientName.trim(),
        proposalTitle: proposal.title,
        amount: proposal.amount,
        currency: proposal.currency,
        signedAt: proposal.signedAt?.toISOString() ?? '',
        proposalUrl: `${baseUrl}/proposals/${proposal.id}`,
      }).catch((err) => {
        // On ne bloque pas la signature si l'email échoue
        console.error("Erreur envoi notification:", err);
      });
    }

    // Retourner la proposition sans données sensibles
    return NextResponse.json({
      proposal: {
        id: proposal.id,
        title: proposal.title,
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        clientCompany: proposal.clientCompany,
        amount: proposal.amount,
        currency: proposal.currency,
        status: proposal.status,
        validUntil: proposal.validUntil,
        context: proposal.context,
        deliverables: proposal.deliverables,
        timeline: proposal.timeline,
        pricing: proposal.pricing,
        conditions: proposal.conditions,
        createdAt: proposal.createdAt,
        signedAt: proposal.signedAt,
        signatureData: proposal.signatureData,
      },
    });
  } catch (error) {
    console.error("Erreur récupération proposition publique:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération." },
      { status: 500 }
    );
  }
}