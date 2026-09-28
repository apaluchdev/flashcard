import { ImageResponse } from "next/og"

import { getDeckForView } from "@/server/decks"

// Link-preview image for shared decks (Slack, Discord, iMessage, X…).
export const alt = "Flashcard deck"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const deck = await getDeckForView((await params).id)
  const title = deck ? truncate(deck.title, 90) : "Flashcards"
  const subtitle = deck
    ? `${deck.cardCount} ${deck.cardCount === 1 ? "card" : "cards"} · by ${truncate(deck.owner.name, 40)}`
    : "Create, study and share flashcard decks"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          position: "relative",
        }}
      >
        {/* Two offset cards behind the main one suggest a deck. */}
        <div
          style={{
            position: "absolute",
            width: 960,
            height: 440,
            borderRadius: 32,
            background: "#e5e5e5",
            transform: "rotate(-4deg) translate(-18px, 22px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 960,
            height: 440,
            borderRadius: 32,
            background: "#ececec",
            transform: "rotate(2deg) translate(14px, 12px)",
          }}
        />
        <div
          style={{
            width: 960,
            height: 440,
            borderRadius: 32,
            background: "#ffffff",
            border: "2px solid #e5e5e5",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: "#737373", letterSpacing: 2 }}>
            FLASHCARDS
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 60 : 76,
              fontWeight: 700,
              color: "#0a0a0a",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#525252" }}>{subtitle}</div>
        </div>
      </div>
    ),
    size
  )
}
