import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const token = process.env.HF_TOKEN;

    if (!token) return NextResponse.json({ error: "HF_TOKEN faltando" }, { status: 500 });

    const response = await fetch("https://multimodalart-flux-2-dev-turbo.hf.space/call/infer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: [prompt, 0, true, 512, 512, 3.5, 4],
      }),
    });

    const { event_id } = await response.json();

    const resultRes = await fetch(`https://multimodalart-flux-2-dev-turbo.hf.space/call/infer/${event_id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const text = await resultRes.text();
    const dataLine = text.split('\n').find(l => l.startsWith('data: '));
    
    if (!dataLine) throw new Error("Erro no processamento");

    const json = JSON.parse(dataLine.replace('data: ', ''));
    return NextResponse.json({ url: json[0][0].image.url });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
