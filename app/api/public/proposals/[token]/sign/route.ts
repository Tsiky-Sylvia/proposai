import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { fullName } = await req.json();

    if (!fullName?.trim() || fullName.trim().length < 3) {
      return NextResponse.json(
        { error: "Nom complet invalide." },
        { status: 400 }
      );
    }

    const proposal = await prisma.proposal.findUnique({
      where: { publicToken: token },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable." },
        { status: 404 }
      );
    }

    // Vérifications avant signature
    if (proposal.status === "ACCEPTED") {
      return NextResponse.json(
        { error: "Cette proposition a déjà été signée." },
        { status: 409 }
      );
    }

    if (proposal.status === "DECLINED") {
      return NextResponse.json(
        { error: "Cette proposition a été refusée." },
        { status: 409 }
      );
    }

    if (proposal.status === "EXPIRED") {
      return NextResponse.json(
        { error: "Cette proposition a expiré." },
        { status: 410 }
      );
    }

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

    // Récupérer l'IP du signataire
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") ?? "inconnue";

    const signedAt = new Date();

    // Sauvegarder la signature + créer événement ACCEPTED
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "ACCEPTED",
        signedAt,
        signatureData: fullName.trim(),
        signedIp: ip,
        events: {
          create: {
            type: "ACCEPTED",
            metadata: JSON.stringify({
              fullName: fullName.trim(),
              ip,
              signedAt: signedAt.toISOString(),
            }),
          },
        },
      },
    });

    return NextResponse.json({ signedAt: signedAt.toISOString() });
  } catch (error) {
    console.error("Erreur signature:", error);
    return NextResponse.json(
      { error: "Erreur lors de la signature." },
      { status: 500 }
    );
  }
}