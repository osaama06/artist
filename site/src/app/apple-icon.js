import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <div style={{ position: "relative", width: 100, height: 100, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#C89B3C",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -6,
              left: 34,
              width: 100,
              height: 100,
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
