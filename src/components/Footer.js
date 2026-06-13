import React from "react";

export default function Footer() {
  return (
    <footer style={{
      background: "#1a1a1a",
      color: "#fff",
      padding: "40px",
      marginTop: "80px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
      }}>
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "24px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{
            display: "inline-block",
            background: "#fff9c4",
            padding: "2px 8px 4px",
            borderRadius: "2px",
            transform: "rotate(-2deg)",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}>📌</span>
          Post-Its
        </div>
        <div style={{ fontSize: "13px", color: "#888" }}>
          Find your next role, the human way.
        </div>
        <div style={{ fontSize: "12px", color: "#555" }}>
          © 2026 Post-Its. Built with AWS Amplify & Gemini AI.
        </div>
      </div>
    </footer>
  );
}