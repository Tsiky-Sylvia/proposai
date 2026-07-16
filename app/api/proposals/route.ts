import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";
import { PROPOSAL_SYSTEM_PROMPT } from "@/lib/prompts";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const {
      title,
      rawInput,
      clientName,
      clientEmail,
      clientCompany,
      amount,
      validUntil,
    } = await req.json();

    if (!title?.trim() || !rawInput?.trim() || !clientName?.trim() || !clientEmail?.trim() || !amount) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Étape 3 — Appel Groq avec structured output
    const userMessage = `
Projet: ${title}
Description: ${rawInput}
Client: ${clientName} ${clientCompany ? `(${clientCompany})` : ""}
Email client: ${clientEmail}
Montant proposé: ${amount}€
    `.trim();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: PROPOSAL_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content ?? "";
    console.log("Réponse brute Groq:", text);

    // Parsing JSON
    let generated;
    try {
      generated = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "La réponse de l'IA n'est pas valide, réessayez." },
        { status: 500 }
      );
    }

    // Étape 4 — Sauvegarder en base
    const proposal = await prisma.proposal.create({
      data: {
        title,
        rawInput,
        clientName,
        clientEmail,
        clientCompany: clientCompany ?? null,
        amount: parseFloat(amount),
        validUntil: validUntil ? new Date(validUntil) : null,
        context: generated.context,
        deliverables: generated.deliverables,
        timeline: generated.timeline,
        pricing: generated.pricing,
        conditions: generated.conditions,
        userId: user.id,
        // Étape 6 — Créer l'événement CREATED
        events: {
          create: {
            type: "CREATED",
            metadata: JSON.stringify({ title, clientEmail }),
          },
        },
      },
    });

    return NextResponse.json({ proposal }, { status: 201 });

  } catch (error) {
    console.error("Erreur création proposition:", error);

    // Étape 8 — Gestion des erreurs
    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessayez dans quelques secondes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la génération, réessayez." },
      { status: 500 }
    );
  }
  
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const proposals = await prisma.proposal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        clientName: true,
        clientEmail: true,
        clientCompany: true,
        amount: true,
        currency: true,
        status: true,
        validUntil: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error("Erreur récupération propositions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Supprimer d'abord les événements liés
    await prisma.proposalEvent.deleteMany({
      where: { proposalId: id },
    });

    // Puis supprimer la proposition
    await prisma.proposal.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression proposition:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}