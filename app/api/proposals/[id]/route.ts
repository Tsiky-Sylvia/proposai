import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/prisma-error";

export async function GET(
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
      include: { events: { orderBy: { createdAt: "asc" } } },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ proposal });
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

export async function PATCH(
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
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Champs modifiables par le freelance
    const allowedFields = [
      "title",
      "context",
      "deliverables",
      "timeline",
      "pricing",
      "conditions",
      "amount",
      "validUntil",
      "clientName",
      "clientEmail",
      "clientCompany",
    ];

    // Filtrer uniquement les champs autorisés
    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Aucun champ valide à mettre à jour." },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.update({
      where: { id, userId: user.id },
      data: updateData,
    });

    return NextResponse.json({ proposal });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    if (prismaError) return prismaError;

    console.error("Erreur mise à jour proposition:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    );
  }
}