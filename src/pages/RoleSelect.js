import React from "react";
import { storage } from "../utils/storage";

export default function RoleSelect({ email, onRoleSelected }) {
  const choose = (role) => {
    storage.saveUserRole(email, role);
    onRoleSelected(role);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "48px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "12px",
        }}>
          <span style={{
            background: "#fff9c4",
            padding: "4px 12px 6px",
            borderRadius: "2px",
            transform: "rotate(-2deg)",
            display: "inline-block",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
          }}>📌</span>
          Post-Its
        </div>
        <p style={{ color: "#888", fontSize: "16px", margin: 0 }}>
          First, tell us how you'll be using Post-Its.
        </p>
      </div>

      <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          {
            role: "employer",
            emoji: "🏢",
            title: "I'm hiring",
            sub: "Post jobs and review applicants",
            color: "#fff9c4",
            rot: "-2deg",
          },
          {
            role: "seeker",
            emoji: "🔍",
            title: "I'm job seeking",
            sub: "Browse openings and apply",
            color: "#cce5ff",
            rot: "1.5deg",
          },
        ].map(({ role, emoji, title, sub, color, rot }) => (
          <button
            key={role}
            onClick={() => choose(role)}
            style={{
              background: color,
              border: "none",
              borderRadius: "3px",
              padding: "40px 48px",
              cursor: "pointer",
              transform: `rotate(${rot})`,
              boxShadow: "4px 4px 12px rgba(0,0,0,0.12)",
              textAlign: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              fontFamily: "'Inter', sans-serif",
              width: "240px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "rotate(0deg) translateY(-6px)";
              e.currentTarget.style.boxShadow = "8px 8px 24px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = `rotate(${rot})`;
              e.currentTarget.style.boxShadow = "4px 4px 12px rgba(0,0,0,0.12)";
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>{emoji}</div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "26px",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "6px",
            }}>{title}</div>
            <div style={{ fontSize: "13px", color: "#666" }}>{sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}