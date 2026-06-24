import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const editais = await prisma.edital.findMany({
      where: { status: "ABERTO" },
      include: { nichos: true },
      orderBy: { dataFechamento: "asc" },
    });
    return NextResponse.json(editais);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      titulo,
      descricao,
      orgao,
      valorMaximo,
      dataAbertura,
      dataFechamento,
      linkOriginal,
      tipo,
      nichos,
    } = await req.json();

    const edital = await prisma.edital.create({
      data: {
        titulo,
        descricao,
        orgao,
        valorMaximo,
        dataAbertura: new Date(dataAbertura),
        dataFechamento: new Date(dataFechamento),
        linkOriginal,
        tipo,
        nichos: {
          create: nichos?.map((nicho: string) => ({ nicho })) ?? [],
        },
      },
      include: { nichos: true },
    });

    return NextResponse.json(edital, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}