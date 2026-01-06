"use client";
import { useState } from "react";
import { Wand2, Loader2, Image as ImageIcon } from "lucide-react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.url) setImage(data.url);
      else alert("Erro na resposta do modelo");
    } catch (e) {
      alert("Erro ao conectar com a API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-500">FLUX.2 Turbo</h1>
          <p className="text-slate-400">Gere imagens em segundos usando Hugging Face</p>
        </div>

        <div className="flex gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-white outline-none"
            placeholder="Um astronauta montado num cavalo em Marte..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
          />
          <button
            onClick={generate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            Gerar
          </button>
        </div>

        <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/50 flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt="Gerada" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="text-slate-600 flex flex-col items-center gap-2">
              <ImageIcon size={48} strokeWidth={1} />
              <p>Aguardando seu prompt...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
