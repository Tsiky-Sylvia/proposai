import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendProposalEmail } from "@/lib/email";
import { handlePrismaError } from "@/lib/prisma-error";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id, userId: user.id },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable" },
        { status: 404 }
      );
    }

    if (proposal.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Cette proposition a déjà été acceptée." },
        { status: 409 }
      );
    }

    // Construire l'URL publique
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const publicUrl = `${baseUrl}/p/${proposal.publicToken}`;
    const proposalUrl = `${baseUrl}/proposals/${proposal.id}`;

    // Envoyer l'email au client
    await sendProposalEmail({
      clientEmail: proposal.clientEmail,
      clientName: proposal.clientName,
      freelanceName: user.name ?? user.email,
      proposalTitle: proposal.title,
      amount: proposal.amount,
      currency: proposal.currency,
      publicUrl,
      validUntil: proposal.validUntil?.toISOString() ?? null,
    });

    // Mettre à jour le statut + créer événement SENT
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "SENT",
        events: {
          create: {
            type: "SENT",
            metadata: JSON.stringify({
              sentTo: proposal.clientEmail,
              publicUrl,
            }),
          },
        },
      },
    });

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