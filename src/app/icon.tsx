import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

/** Simple "ST" monogram favicon — bright signal-yellow background (this project's fixed accent
 * token, `--signal` in globals.css) with dark ink text, since a light background reads more
 * legibly than white-on-dark at browser-tab favicon sizes. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          background: "linear-gradient(155deg, #ffe066, #ffd21f 55%, #e9c524)",
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: -1,
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
