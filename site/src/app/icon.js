import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// A simple gold crescent on the "ليالي الدرعية" dark ground — night/spotlight
// motif from the identity, drawn as shapes (not Arabic type) so it renders
// reliably through the OG image renderer regardless of font/script support.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1C1512",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 18, height: 18, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#C89B3C",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -1,
              left: 6,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#1C1512",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
