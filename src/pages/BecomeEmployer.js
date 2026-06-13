import React from "react";
import { storage } from "../utils/storage";

export default function BecomeEmployer({ email, onConfirm, onBack }) {
  const handleSwitch = () => {
    storage.saveUserRole(email, "employer");
    onConfirm();
  };

  return (
    <div style={{
      maxWidth: "560px",
      margin: "80px auto",
      padding: "0 24px",
      fontFamily: "'Inter', sans-serif",
      textAlign: "center",
    }}>
      <div style={{
        background: "#fff9c4",
        borderRadius: "3px",
        padding: "48px 40px",
        boxShadow: "4px 4px 16px rgba(0,0,0,0.12)",
        transform: "rotate(-1deg)",
        marginBottom: "32px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.22)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }} />
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
        <h1 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "36px",
          fontWeight: "700",
          color: "#1a1a1a",
          margin: "0 0 12px",
        }}>Start hiring on Post-Its</h1>
        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.6, margin: "0 0 8px" }}>
          Switch to an employer account to post jobs, review applications, and find your next great hire.
        </p>
        <p style={{
          fontSize: "13px",
          color: "#888",
          margin: 0,
        }}>
          Note: switching will change your account to employer mode.
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={onBack} style={{
          padding: "12px 24px",
          background: "#fff",
          border: "1.5px solid #e0e0e0",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          color: "#444",
        }}>
          Back to jobs
        </button>
        <button onClick={handleSwitch} style={{
          padding: "12px 24px",
          background: "#1a1a1a",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          color: "#fff",
        }}>
          Switch to employer →
        </button>
      </div>
    </div>
  );
}