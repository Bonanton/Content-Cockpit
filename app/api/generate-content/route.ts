import { NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { auth } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const MAX_PROMPT_LENGTH = 4000

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
          return NextResponse.json({ error: "Devi effettuare l'accesso per generare contenuti." }, { status: 401 })
    }

  const rateLimit = checkRateLimit(session.user.id)
    if (!rateLimit.allowed) {
          return NextResponse.json(
            { error: 'Troppe richieste. Riprova tra qualche minuto.' },
            { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
                )
    }

  try {
        const body = await request.json()
        const { prompt, type = 'contenuto', niche, brand, channel, objective, model = DEFAULT_MODEL, research = true, withImage = false } = body
        if (!prompt || typeof prompt !== 'string') return NextResponse.json({ error: 'Brief richiesto' }, { status: 400 })
        if (prompt.length > MAX_PROMPT_LENGTH) {
                return NextResponse.json({ error: `Brief troppo lungo (max ${MAX_PROMPT_LENGTH} caratteri).` }, { status: 400 })
        }

      const context = [`Brand: ${brand || 'non specificato'}`, `Nicchia: ${niche || 'non specificata'}`, `Canale: ${channel || 'multi-canale'}`, `Obiettivo: ${objective || 'contenuto di valore'}`].join('\n')
        const researchInstruction = research ? 'Prima individua 3 angoli editoriali attuali e plausibili per questa nicchia, poi scegli quello più utile. Non inventare fonti o dati.' : 'Lavora solo sul brief fornito senza ricerca preliminare.'
        const system = `Sei Hermes, un research e content agent per brand italiani. Gestisci una pipeline editoriale completa: analisi del contesto, ricerca di angoli, brief, scrittura e controllo qualità.\n${context}\n${researchInstruction}\nScrivi in italiano, con tono competente, diretto e umano. Restituisci solo il contenuto finale pronto da usare, senza premesse o commenti sulla pipeline.`
        const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_GATEWAY_API_KEY}` }, body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: `Crea un ${type} per ${channel || 'il canale più adatto'} sul seguente brief:\n${prompt}` }], temperature: 0.75 }) })
        if (!response.ok) throw new Error(`AI gateway error: ${response.status}`)
        const data = await response.json()
        const text = data.choices?.[0]?.message?.content || ''
        let imageUrl = ''
        if (withImage) {
                fal.config({ credentials: process.env.FAL_KEY })
                const imageResult = await fal.subscribe('fal-ai/flux/schnell', { input: { prompt: `Editorial visual for ${brand || 'a modern brand'} in the niche ${niche || 'business'}, ${prompt}`, image_size: 'landscape_16_9', num_inference_steps: 4, num_images: 1 } })
                imageUrl = imageResult.data?.images?.[0]?.url || ''
        }
        return NextResponse.json({ text, imageUrl, model, pipeline: ['research', 'brief', 'creation', 'qa'] })
  } catch (error) {
        console.error('[v0] Hermes generation failed', error)
        return NextResponse.json({ error: 'La pipeline Hermes non è disponibile in questo momento.' }, { status: 500 })
  }
}
