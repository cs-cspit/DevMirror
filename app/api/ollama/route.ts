import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'llama2' } = await req.json()
    const ollamaUrl = `http://localhost:11434/api/generate`
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Ollama server error' }, { status: 500 })
    }
    const data = await response.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Internal error', details: e }, { status: 500 })
  }
}
