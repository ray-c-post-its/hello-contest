import React, { useState } from "react";

const CARD_COLORS = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];
const ROTATIONS = [-2.1, 1.8, -1.3, 2.4, -1.7, 1.2];

export default function PostItCard({ job, index, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const bg = CARD_COLORS[index % CARD_COLORS.length];
  const rot = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        borderRadius: "3px",
        padding: "24px",
        cursor: onClick ? "pointer" : "default",
        transform: hovered ? "rotate(0deg) translateY(-6px) scale(1.02)" : `rotate(${rot}deg)`,
        boxShadow: hovered
          ? "8px 8px 24px rgba(0,0,0,0.18)"
          : "3px 3px 10px rgba(0,0,0,0.12)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Pin */}
      <div style={{
        position: "absolute",
        top: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.25)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }} />

      {/* Type pill */}
      <div style={{
        position: "absolute",
        top: "14px",
        right: "14px",
        fontSize: "10px",
        padding: "3px 9px",
        borderRadius: "20px",
        background: "rgba(0,0,0,0.09)",
        color: "#333",
        fontWeight: "600",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
      }}>
        {job.type}
      </div>

      {/* Company image */}
      {job.imageUrl && (
        <img
          src={job.imageUrl}
          alt={job.company}
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            borderRadius: "2px",
            marginBottom: "12px",
          }}
        />
      )}

      <div style={{
        fontFamily: "'Caveat', cursive",
        fontSize: "21px",
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: "4px",
        paddingRight: "48px",
      }}>
        {job.title}
      </div>

      <div style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "10px" }}>
        {job.company}
      </div>

      <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>📍 {job.location}</div>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>💰 {job.salary}</div>

      <div style={{ fontSize: "12px", color: "#555", lineHeight: 1.5, marginBottom: "12px" }}>
        {job.description?.slice(0, 100)}{job.description?.length > 100 ? "…" : ""}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {(job.tags || []).slice(0, 3).map(t => (
          <span key={t} style={{
            fontSize: "11px",
            padding: "2px 8px",
            borderRadius: "20px",
            background: "rgba(0,0,0,0.08)",
            color: "#444",
            fontWeight: "500",
          }}>{t}</span>
        ))}
      </div>

      {onDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(job.id); }}
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "rgba(0,0,0,0.1)",
            border: "none",
            borderRadius: "50%",
            width: "26px",
            height: "26px",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >✕</button>
      )}
    </div>
  );
}