import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendRenewRequestEmail } from "@/lib/email";
import { handlePrismaError } from "@/lib/prisma-error";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { message } = await req.json();

    const proposal = await prisma.proposal.findUnique({
      where: { publicToken: token },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable." },
        { status: 404 }
      );
    }

    // Notifier le freelance
    const freelance = await prisma.user.findUnique({
      where: { id: proposal.userId },
    });

    if (freelance) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

      await sendRenewRequestEmail({
        freelanceEmail: freelance.email,
        freelanceName: freelance.name ?? freelance.email,
        clientName: proposal.clientName,
        proposalTitle: proposal.title,
        message: message?.trim() || null,
        proposalUrl: `${baseUrl}/proposals/${proposal.id}`,
      }).catch((err) => {
        console.error("Erreur envoi demande renouvellement:", err);
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