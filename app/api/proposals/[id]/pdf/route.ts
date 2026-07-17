import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DocumentProps, renderToBuffer } from "@react-pdf/renderer";
import ProposalPDF from "@/components/ProposalPDF";
import { createElement, ReactElement } from "react";

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
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposition introuvable" },
        { status: 404 }
      );
    }
    
    const pdfElement = createElement(ProposalPDF, {proposal}) as ReactElement<DocumentProps>;;

    const buffer = await renderToBuffer(pdfElement);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="proposition-${proposal.id}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Erreur génération PDF:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 }
    );
  }
}