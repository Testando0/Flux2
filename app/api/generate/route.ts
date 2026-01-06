import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.HF_TOKEN) {
      return NextResponse.json({ error: "HF_TOKEN não configurado" }, { status: 500 });
    }

    // Chamada ao Space via Gradio API do Hugging Face
    const response = await fetch("https://multimodalart-flux-2-dev-turbo.hf.space/call/infer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
      },
      body: JSON.stringify({
        data: [prompt, 0, true, 512, 512, 3.5, 4],
      }),
    });

    const { event_id } = await response.json();

    // Polling para obter o resultado final (o Turbo é tão rápido que um fetch costuma bastar)
    const resultResponse = await fetch(`https://multimodalart-flux-2-dev-turbo.hf.space/call/infer/${event_id}`, {
      headers: { "Authorization": `Bearer ${process.env.HF_TOKEN}` },
    });

    const resultText = await resultResponse.text();
    
    // Extrair o URL da imagem da stream de eventos do Gradio
    const lines = resultText.split('\n');
    const dataLine = lines.find(l => l.startsWith('data: '));
    
    if (dataLine) {
      const data = JSON.parse(dataLine.slice(6));
      return NextResponse.json({ imageUrl: data[0][0].image.url });
    }

    return NextResponse.json({ error: "Falha ao gerar imagem" }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
