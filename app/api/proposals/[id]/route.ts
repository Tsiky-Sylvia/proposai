import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
    console.error("Erreur récupération proposition:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}