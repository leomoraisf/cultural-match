import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Algoritmo de score de compatibilidade
function calcularScore(
  nichosArtista: string[],
  nichosEdital: string[]
): number {
  if (nichosEdital.length === 0) return 0;

  const matches = nichosArtista.filter((n) => nichosEdital.includes(n)).length;
  const score = (matches / nichosEdital.length) * 100;

  return Math.round(score * 100) / 100;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const artistaId = session.user.id;

    const artista = await prisma.artista.findUnique({
      where: { id: artistaId },
      include: { nichos: true },
    });

    if (!artista) {
      return NextResponse.json(
        { error: "Artista não encontrado" },
        { status: 404 }
      );
    }

    const nichosArtista = artista.nichos.map((n) => n.nicho);

    const editais = await prisma.edital.findMany({
      where: { status: "ABERTO" },
      include: { nichos: true },
    });

    // Calcula e salva os matches
    const matchesCalculados = await Promise.all(
      editais.map(async (edital) => {
        const nichosEdital = edital.nichos.map((n) => n.nicho);
        const score = calcularScore(nichosArtista, nichosEdital);

        if (score === 0) return null;

        const match = await prisma.match.upsert({
          where: {
            artistaId_editalId: { artistaId, editalId: edital.id },
          },
          update: { score },
          create: { artistaId, editalId: edital.id, score },
        });

        return { ...match, edital };
      })
    );

    const matches = matchesCalculados
      .filter(Boolean)
      .sort((a, b) => b!.score - a!.score);

    return NextResponse.json(matches);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}