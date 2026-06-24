import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, bio, cidade, estado, nichos } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const existe = await prisma.artista.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    const senhaCriptografada = await bcrypt.hash(password, 12);

    const artista = await prisma.artista.create({
      data: {
        name,
        email,
        password: senhaCriptografada,
        bio,
        cidade,
        estado,
        nichos: {
          create: nichos?.map((nicho: string) => ({ nicho })) ?? [],
        },
      },
      include: { nichos: true },
    });

    const { password: _, ...artistaSemSenha } = artista;

    return NextResponse.json(artistaSemSenha, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}