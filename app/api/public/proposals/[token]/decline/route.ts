import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendDeclineNotificationEmail } from "@/lib/email";
import { handlePrismaError } from "@/lib/prisma-error";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { reason } = await req.json();

    const proposal = await prisma.proposal.findUnique({
      where: { publicToken: token },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable." },
        { status: 404 }
      );
    }

    if (proposal.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Cette proposition a déjà été acceptée." },
        { status: 409 }
      );
    }

    if (proposal.status === "DECLINED") {
      return NextResponse.json(
        { error: "Cette proposition a déjà été refusée." },
        { status: 409 }
      );
    }

    // Mettre à jour le statut + créer événement DECLINED
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "DECLINED",
        events: {
          create: {
            type: "DECLINED",
            metadata: JSON.stringify({
              reason: reason?.trim() || null,
              declinedAt: new Date().toISOString(),
            }),
          },
        },
      },
    });

    // Notifier le freelance
    const freelance = await prisma.user.findUnique({
      where: { id: proposal.userId },
    });

    if (freelance) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      await sendDeclineNotificationEmail({
        freelanceEmail: freelance.email,
        freelanceName: freelance.name ?? freelance.email,
        clientName: proposal.clientName,
        proposalTitle: proposal.title,
        reason: reason?.trim() || null,
        proposalUrl: `${baseUrl}/proposals/${proposal.id}`,
      }).catch((err) => {
        console.error("Erreur envoi notification refus:", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    if (prismaError) return prismaError;
    
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}