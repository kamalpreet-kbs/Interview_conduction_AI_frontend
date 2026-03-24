import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, thread_id } = body

    const BACKEND_API_URL = process.env.BACKEND_API_URL

    const API_KEY = process.env.BACKED_API_KEY

    if (!BACKEND_API_URL) {
      console.error("BACKEND_API_URL environment variable is not set")
      return NextResponse.json(
        { error: "Backend API URL is not configured. Please set BACKEND_API_URL in environment variables." },
        { status: 500 },
      )
    }

    console.log("[v0] Calling backend API:", BACKEND_API_URL)
    console.log("[v0] Request body:", { text, thread_id })

    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
      },
      body: JSON.stringify({
        text,
        thread_id,
      }),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error:", errorText)
      throw new Error(`Backend API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Backend response data:", data)

    return NextResponse.json({
      user_text: data.user_text,
      ai_text: data.ai_text,
      audio_base64: data.audio_base64,
    })
  } catch (error) {
    console.error("[v0] API Route Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to communicate with backend API" },
      { status: 500 },
    )
  }
}
