import React from "react";

const CARD_COLORS = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];

export default function JobDetail({ job, jobIndex, onApply, onBack }) {
  const bg = CARD_COLORS[jobIndex % CARD_COLORS.length];

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px 80px", fontFamily: "'Inter', sans-serif" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "14px", color: "#888", marginBottom: "32px",
        padding: 0, fontFamily: "'Inter', sans-serif",
        display: "flex", alignItems: "center", gap: "6px",
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
          position: "absolute", top: "-12px", left: "50%",
          transform: "translateX(-50%)", width: "20px", height: "20px",
          borderRadius: "50%", background: "rgba(0,0,0,0.22)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }} />

        {job.imageUrl && (
          <img src={job.imageUrl} alt={job.company} style={{
            width: "100%", height: "220px", objectFit: "cover",
            borderRadius: "2px", marginBottom: "24px",
          }} />
        )}

        <div style={{
          display: "inline-block", fontSize: "11px", padding: "3px 10px",
          borderRadius: "20px", background: "rgba(0,0,0,0.09)", color: "#333",
          fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase",
          marginBottom: "16px",
        }}>{job.type}</div>

        <h1 style={{
          fontFamily: "'Caveat', cursive", fontSize: "42px", fontWeight: "700",
          margin: "0 0 8px", color: "#1a1a1a", lineHeight: 1.1,
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
              fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
              background: "rgba(0,0,0,0.08)", color: "#444", fontWeight: "500",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* About the role */}
      <Section title="About the role" color="#fff9c4">
        <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, margin: 0 }}>
          {job.description}
        </p>
      </Section>

      {/* Requirements */}
      {job.requirements && (
        <Section title="What we're looking for" color="#cce5ff">
          <ul style={{ padding: "0 0 0 20px", margin: 0 }}>
            {job.requirements.split("\n").filter(Boolean).map((r, i) => (
              <li key={i} style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, marginBottom: "6px" }}>
                {r}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Work environment */}
      {job.environment && (
        <Section title="🏢 Work environment" color="#d4edda">
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, margin: 0 }}>
            {job.environment}
          </p>
        </Section>
      )}

      {/* Team culture */}
      {job.culture && (
        <Section title="🤝 Team culture" color="#ffd1dc">
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, margin: 0 }}>
            {job.culture}
          </p>
        </Section>
      )}

      {/* Meet the team */}
      {job.teamBios && (
        <Section title="👋 Meet the team" color="#fff9c4">
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.7, margin: 0 }}>
            {job.teamBios}
          </p>
        </Section>
      )}

      {/* Gallery */}
      {job.galleryUrls && job.galleryUrls.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "26px", fontWeight: "700",
            margin: "0 0 16px", color: "#1a1a1a",
          }}>📸 Life at {job.company}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {job.galleryUrls.map((url, i) => (
              <img key={i} src={url} alt={`${job.company} ${i + 1}`} style={{
                width: "100%", height: "140px", objectFit: "cover", borderRadius: "4px",
              }} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onApply}
        style={{
          width: "100%", padding: "16px", background: "#1a1a1a", color: "#fff",
          border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600",
          cursor: "pointer", fontFamily: "'Inter', sans-serif", letterSpacing: "0.2px",
        }}
      >
        Apply for this role →
      </button>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div style={{
      background: color,
      borderRadius: "3px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: "-8px", left: "50%",
        transform: "translateX(-50%)", width: "12px", height: "12px",
        borderRadius: "50%", background: "rgba(0,0,0,0.2)",
      }} />
      <h2 style={{
        fontFamily: "'Caveat', cursive", fontSize: "22px", fontWeight: "700",
        margin: "0 0 12px", color: "#1a1a1a",
      }}>{title}</h2>
      {children}
    </div>
  );
}