import Link from "next/link";
import { Music, Theater, Film, Palette, Trophy } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-purple-400">Cultural</span>
          <span className="text-2xl font-bold text-white">Match</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition"
          >
            Criar conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-32 gap-6">
        <span className="px-4 py-1 text-xs bg-purple-900 text-purple-300 rounded-full">
          O LinkedIn da Cultura
        </span>
        <h1 className="text-5xl font-bold max-w-2xl leading-tight">
          Conecte seu talento às{" "}
          <span className="text-purple-400">oportunidades certas</span>
        </h1>
        <p className="text-zinc-400 max-w-xl text-lg">
          Nossa IA cruza o seu perfil artístico com editais e oportunidades
          culturais, calculando um score de compatibilidade em tempo real.
        </p>
        <div className="flex gap-4 mt-4">
          <Link
            href="/cadastro"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition"
          >
            Começar agora — é grátis
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-zinc-700 hover:border-zinc-500 rounded-xl transition"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Nichos */}
      <section className="px-8 py-16 border-t border-zinc-800">
        <h2 className="text-center text-2xl font-bold mb-12 text-zinc-300">
          Para todos os nichos da cultura
        </h2>
        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          {[
            { icon: Music, label: "Música" },
            { icon: Theater, label: "Teatro" },
            { icon: Film, label: "Audiovisual" },
            { icon: Palette, label: "Artes Visuais" },
            { icon: Trophy, label: "Prêmios" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-6 py-4 bg-zinc-900 rounded-xl border border-zinc-800"
            >
              <Icon className="text-purple-400" size={28} />
              <span className="text-sm text-zinc-300">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}