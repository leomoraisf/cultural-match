"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, Star, Calendar, ExternalLink } from "lucide-react";
interface Match {
  id: string;
  score: number;
  edital: {
    id: string;
    titulo: string;
    orgao: string;
    tipo: string;
    valorMaximo: number | null;
    dataFechamento: string;
    linkOriginal: string;
    descricao: string;
    nichos: { nicho: string }[];
  };
}
const TIPO_LABEL: Record<string, string> = {
  BOLSA: "Bolsa",
  PATROCINIO: "Patrocinio",
  RESIDENCIA: "Residencia",
  PREMIO: "Premio",
  CAPACITACAO: "Capacitacao",
  OUTROS: "Outros",
};
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-400 bg-green-900" : score >= 50 ? "text-yellow-400 bg-yellow-900" : "text-red-400 bg-red-900";
  return <span className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}>{score.toFixed(0)}% match</span>;
}
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/matches").then((r) => r.json()).then((data) => { setMatches(Array.isArray(data) ? data : []); setLoading(false); });
    }
  }, [status]);
  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-purple-400 text-lg animate-pulse">Calculando seus matches...</div></div>;
  }
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-purple-400">Cultural</span>
          <span className="text-xl font-bold">Match</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Ola, {session?.user?.name?.split(" ")[0]}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
            <LogOut size={16} />Sair
          </button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Seus Matches</h1>
          <p className="text-zinc-400">{matches.length > 0 ? `${matches.length} oportunidades compativeis` : "Nenhum match encontrado ainda"}</p>
        </div>
        {matches.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <Star size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">Nenhum edital aberto no momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {matches.map((match) => (
              <div key={match.id} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-600 transition">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">{match.edital.titulo}</h2>
                    <p className="text-zinc-400 text-sm">{match.edital.orgao}</p>
                  </div>
                  <ScoreBadge score={match.score} />
                </div>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{match.edital.descricao}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                  <span className="px-2 py-1 bg-zinc-800 rounded-md">{TIPO_LABEL[match.edital.tipo] ?? match.edital.tipo}</span>
                  {match.edital.valorMaximo && <span>Ate R$ {match.edital.valorMaximo.toLocaleString("pt-BR")}</span>}
                  <span className="flex items-center gap-1"><Calendar size={12} />Fecha em {new Date(match.edital.dataFechamento).toLocaleDateString("pt-BR")}</span>
                  <a href={match.edital.linkOriginal} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 ml-auto"><ExternalLink size={12} />Ver edital</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}