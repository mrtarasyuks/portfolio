import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same "ST" monogram as `icon.tsx`, scaled up for iOS home-screen/touch icons (which iOS renders
 * with its own rounded-square mask, so no border-radius needed here — a flat edge-to-edge fill). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #ffe066, #ffd21f 55%, #e9c524)",
        }}
      >
        <span
          style={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: -3,
            color: "#151300",
            fontFamily: "sans-serif",
          }}
        >
          ST
        </span>
      </div>
    ),
    { ...size }
  );
}
