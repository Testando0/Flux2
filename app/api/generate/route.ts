import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return NextResponse.json({ error: "HF_TOKEN não configurado na Vercel" }, { status: 500 });
    }

    // Passo 1: Enviar o prompt para o Space
    const response = await fetch("https://multimodalart-flux-2-dev-turbo.hf.space/call/infer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_TOKEN}`,
      },
      body: JSON.stringify({
        data: [prompt, 0, true, 512, 512, 3.5, 4],
      }),
    });

    const eventData = await response.json();
    const eventId = eventData.event_id;

    // Passo 2: Buscar o resultado final usando o Event ID
    const resultResponse = await fetch(`https://multimodalart-flux-2-dev-turbo.hf.space/call/infer/${eventId}`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${HF_TOKEN}` }
    });

    const text = await resultResponse.text();
    
    // O Gradio retorna uma stream de texto. Vamos buscar a linha que contém o JSON da imagem.
    const lines = text.split('\n');
    const dataLine = lines.find(l => l.startsWith('data: '));
    
    if (dataLine) {
      const json = JSON.parse(dataLine.replace('data: ', ''));
      // O URL da imagem fica em json[0][0].image.url
      const finalUrl = json[0][0].image.url;
      return NextResponse.json({ url: finalUrl });
    }

    throw new Error("Não foi possível extrair o URL da imagem");

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
