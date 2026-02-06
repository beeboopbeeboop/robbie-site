import { NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  email: string
  message: string
  website?: string
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ContactPayload>

    const name = (payload.name ?? '').trim()
    const email = (payload.email ?? '').trim()
    const message = (payload.message ?? '').trim()
    const website = (payload.website ?? '').trim()

    if (website.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (message.length < 8 || message.length > 2000) {
      return NextResponse.json({ ok: false, error: 'Message length is invalid.' }, { status: 400 })
    }

    console.log('[contact] booking inquiry', {
      name,
      email,
      message,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to process request.' }, { status: 500 })
  }
}
