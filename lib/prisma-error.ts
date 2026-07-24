import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma";

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Une entrée identique existe déjà." },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          { error: "Enregistrement introuvable." },
          { status: 404 }
        );
      case "P2003":
        return NextResponse.json(
          { error: "Référence invalide." },
          { status: 400 }
        );
      case "P2016":
        return NextResponse.json(
          { error: "Données manquantes." },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { error: `Erreur base de données: ${error.code}` },
          { status: 500 }
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: "Données invalides envoyées à la base de données." },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      { error: "Impossible de se connecter à la base de données." },
      { status: 503 }
    );
  }

  return null;
}