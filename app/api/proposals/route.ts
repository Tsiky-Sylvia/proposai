import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Mock — sera remplacé par l'appel IA au Jour 4
  return NextResponse.json({
    proposal: {
      id: "mock-id-123",
      ...body,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    },
  });
}