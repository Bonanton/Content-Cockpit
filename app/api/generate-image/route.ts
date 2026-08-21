import { NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    if (!prompt || typeof prompt !== 'string') return NextResponse.json({ error: 'Prompt richiesto' }, { status: 400 })
    fal.config({ credentials: process.env.FAL_KEY })
    const result = await fal.subscribe('fal-ai/flux/schnell', { input: { prompt: `Editorial marketing visual, premium modern design, ${prompt}`, image_size: 'landscape_4_3', num_inference_steps: 4, num_images: 1 } })
    const imageUrl = result.data?.images?.[0]?.url
    if (!imageUrl) throw new Error('No image generated')
    return NextResponse.json({ imageUrl })
  } catch (error) { console.error('[v0] image generation failed', error); return NextResponse.json({ error: 'Generazione immagine non disponibile' }, { status: 500 }) }
}
