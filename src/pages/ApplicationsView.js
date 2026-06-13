import React from "react";
import { storage } from "../utils/storage";

export default function ApplicationsView({ job, onBack }) {
  const applications = storage.getApplications(job.id);

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 24px 80px", fontFamily: "'Inter', sans-serif" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "14px", color: "#888", marginBottom: "32px",
        padding: 0, fontFamily: "'Inter', sans-serif",
      }}>← Back to dashboard</button>

      <h1 style={{
        fontFamily: "'Caveat', cursive",
        fontSize: "36px",
        fontWeight: "700",
        margin: "0 0 6px",
        color: "#1a1a1a",
      }}>Applicants</h1>
      <p style={{ color: "#888", fontSize: "14px", margin: "0 0 36px" }}>
        {job.title} · {job.company} · {applications.length} {applications.length === 1 ? "application" : "applications"}
      </p>

      {applications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", color: "#bbb" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", margin: "0 0 6px" }}>No applications yet.</p>
          <p style={{ fontSize: "14px" }}>Share your posting to start receiving candidates.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {applications.map((app, i) => {
            const colors = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];
            return (
              <div key={app.id} style={{
                background: colors[i % colors.length],
                borderRadius: "3px",
                padding: "28px",
                boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
                position: "relative",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                }}>
                  <div>
                    <div style={{
                      fontFamily: "'Caveat', cursive",
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "#1a1a1a",
                    }}>{app.applicantName}</div>
                    <div style={{ fontSize: "13px", color: "#555" }}>
                      <a href={`mailto:${app.applicantEmail}`} style={{ color: "#555" }}>{app.applicantEmail}</a>
                      {app.linkedin && <> · <a href={`https://${app.linkedin}`} target="_blank" rel="noreferrer" style={{ color: "#555" }}>{app.linkedin}</a></>}
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {new Date(app.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>

                {app.resumeFileName && (
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    background: "rgba(0,0,0,0.08)",
                    borderRadius: "20px",
                    fontSize: "12px",
                    color: "#444",
                    fontWeight: "500",
                    marginBottom: "16px",
                  }}>
                    📎 {app.resumeFileName}
                  </div>
                )}

                {app.answers?.map((a, j) => (
                  <div key={j} style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px" }}>
                      {a.question}
                    </div>
                    <div style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
                      {a.answer || <span style={{ color: "#bbb" }}>No answer provided</span>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}