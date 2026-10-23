import { ImageResponse } from "next/og";
export const alt = "Luiz Moura — Software Engineering Student · PUC Minas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#10120f", color: "#f4f5ef", fontFamily: "sans-serif" }}>
    <div style={{ color: "#c4f16a", fontSize: 23, letterSpacing: 5 }}>PORTFOLIO / PUC MINAS</div>
    <div style={{ display: "flex", fontSize: 102, fontWeight: 700, marginTop: 40 }}>Luiz Moura<span style={{ color: "#c4f16a" }}>.</span></div>
    <div style={{ fontSize: 32, color: "#b5b9ac", marginTop: 25 }}>Software Engineering Student</div>
  </div>, size);
}
