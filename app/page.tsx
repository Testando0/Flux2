"use client";
import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";

export default function FluxPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.imageUrl) setImage(data.imageUrl);
    } catch (e) {
      alert("Erro ao gerar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">FLUX.2 Turbo <span className="text-blue-500">Vercel</span></h1>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva sua imagem..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
            Gerar
          </button>
        </div>

        <div className="aspect-square w-full max-w-md mx-auto border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden bg-slate-900/50">
          {image ? (
            <img src={image} alt="AI Generated" className="w-full h-full object-cover animate-in fade-in duration-700" />
          ) : (
            <p className="text-slate-500 text-sm">Sua imagem aparecerá aqui</p>
          )}
        </div>
      </div>
    </main>
  );
}
