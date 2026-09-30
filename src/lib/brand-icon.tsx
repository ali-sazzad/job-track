import { ImageResponse } from "next/og";

// The JT mark from app/icon2.svg (light-mode colours), rendered to PNG for
// PWA icons and share previews. `inset` shrinks the artwork into the maskable
// safe zone so Android's circle/squircle crops don't clip it.
export function brandIcon(size: number, inset = 0) {
  const art = size * (1 - inset * 2);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171717",
        }}
      >
        <svg width={art} height={art} viewBox="0 0 32 32">
          <g fill="none" stroke="#fafafa" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 9.5V18.5a3.5 3.5 0 0 1-7 0" />
            <path d="M17.5 9.5h9M22 9.5v13" />
          </g>
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
