import React from "react";

const CARD_COLORS = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];

export default function JobDetail({ job, jobIndex, onApply, onBack }) {
  const bg = CARD_COLORS[jobIndex % CARD_COLORS.length];

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px 80px", fontFamily: "'Inter', sans-serif" }}>
      <button onClick={onBack} style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        color: "#888",
        marginBottom: "32px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "'Inter', sans-serif",
      }}>← Back to board</button>

      {/* Hero card */}
      <div style={{
        background: bg,
        borderRadius: "3px",
        padding: "40px",
        boxShadow: "4px 4px 16px rgba(0,0,0,0.12)",
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

        {job.imageUrl && (
          <img src={job.imageUrl} alt={job.company} style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "2px",
            marginBottom: "24px",
          }} />
        )}

        <div style={{
          display: "inline-block",
          fontSize: "11px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(0,0,0,0.09)",
          color: "#333",
          fontWeight: "600",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>{job.type}</div>

        <h1 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "42px",
          fontWeight: "700",
          margin: "0 0 8px",
          color: "#1a1a1a",
          lineHeight: 1.1,
        }}>{job.title}</h1>

        <div style={{ fontSize: "16px", fontWeight: "600", color: "#444", marginBottom: "20px" }}>
          {job.company}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
          {[
            { icon: "📍", label: job.location },
            { icon: "💰", label: job.salary },
            { icon: "🚇", label: job.commute },
          ].filter(m => m.label).map(m => (
            <div key={m.label} style={{ fontSize: "14px", color: "#555" }}>
              {m.icon} {m.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {(job.tags || []).map(t => (
            <span key={t} style={{
              fontSize: "12px",
              padding: "3px 10px",
              borderRadius: "20px",
              background: "rgba(0,0,0,0.08)",
              color: "#444",
              fontWeight: "500",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Details */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "26px",
          fontWeight: "700",
          margin: "0 0 12px",
          color: "#1a1a1a",
        }}>About the role</h2>
        <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, margin: 0 }}>
          {job.description}
        </p>
      </div>

      {job.requirements && (
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "26px",
            fontWeight: "700",
            margin: "0 0 12px",
            color: "#1a1a1a",
          }}>What we're looking for</h2>
          <ul style={{ padding: "0 0 0 20px", margin: 0 }}>
            {job.requirements.split("\n").filter(Boolean).map((r, i) => (
              <li key={i} style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, marginBottom: "6px" }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onApply}
        style={{
          width: "100%",
          padding: "16px",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.2px",
        }}
      >
        Apply for this role →
      </button>
    </div>
  );
}