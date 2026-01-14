import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            JT
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>JobTrack</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>
              Job Application Tracker (Frontend-only)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.05 }}>
            Track your job pipeline
            <br />
            like a real tool.
          </div>
          <div style={{ fontSize: 20, opacity: 0.75, maxWidth: 900 }}>
            CRUD • Filters • Insights • Local persistence • Accessible UI
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["Next.js", "TypeScript", "Tailwind", "shadcn/ui"].map((t) => (
            <div
              key={t}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.12)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}