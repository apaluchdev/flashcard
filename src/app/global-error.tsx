"use client"

// Last-resort error page for failures in the root layout itself (for example
// the header's session lookup). It replaces the whole document, so it can't
// rely on the layout, fonts or theme and uses minimal inline styling.
// retry() re-fetches server data (reset() would only re-render the client).
export default function GlobalError({ retry }: { error: Error; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 16,
        }}
      >
        <title>Something went wrong · Flashcards</title>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: "#737373", marginBottom: 16 }}>
            The app couldn&apos;t load. Please try again in a moment.
          </p>
          <button
            onClick={() => retry()}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #d4d4d4", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
