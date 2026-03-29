import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Climbing Random";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 24 }}>🧗</div>
        <div style={{ fontSize: 72, fontWeight: "bold" }}>Climbing Random</div>
        <div style={{ fontSize: 36, marginTop: 16, opacity: 0.8 }}>
          오늘의 클라이밍 장소를 게임으로 결정하세요!
        </div>
      </div>
    ),
    { ...size }
  );
}
