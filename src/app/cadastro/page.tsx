"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NICHOS = [
  "MUSICA", "TEATRO", "AUDIOVISUAL", "ARTES_VISUAIS",
  "DANCA", "LITERATURA", "CIRCO", "PATRIMONIO_CULTURAL",
  "ARTESANATO", "OUTROS",
];

const NICHO_LABEL: Record<string, string> = {
  MUSICA: "Música", TEATRO: "Teatro", AUDIOVISUAL: "Audiovisual",
  ARTES_VISUAIS: "Artes Visuais", DANCA: "Dança", LITERATURA: "Literatura",
  CIRCO: "Circo", PATRIMONIO_CULTURAL: "Patrimônio Cultural",
  ARTESANATO: "Artesanato", OUTROS: "Outros",
};

export default function Cadastro() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    bio: "", cidade: "", estado: "",
  });
  const [nichos, setNichos] = useState<string[]>([]);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleNicho(nicho: string) {
    setNichos((prev) =>
      prev.includes(nicho) ? prev.filter((n) => n !== nicho) : [...prev, nicho]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const res = await fetch("/api/artistas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, nichos }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErro(data.error || "Erro ao cadastrar");
      setLoading(false);
      return;
    }

    router.push("/login?cadastro=ok");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <h1 className="text-2xl font-bold mb-1">Criar conta</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Entrar
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nome completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Senha"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <textarea
            className="bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Bio (opcional)"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
          <div className="flex gap-3">
            <input
              className="flex-1 bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Cidade"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
            <input
              className="w-24 bg-zinc-800 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="UF"
              maxLength={2}
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            />
          </div>

          {/* Seleção de nichos */}
          <div>
            <p className="text-sm text-zinc-400 mb-2">
              Seus nichos artísticos:
            </p>
            <div className="flex flex-wrap gap-2">
              {NICHOS.map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => toggleNicho(n)}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    nichos.includes(n)
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {NICHO_LABEL[n]}
                </button>
              ))}
            </div>
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg py-3 font-semibold transition"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
    </main>
  );
}