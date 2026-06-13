import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import PostItCard from "../components/PostItCard";

export default function JobBoard({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setJobs(storage.getJobs());
  }, []);

  const types = ["All", "Remote", "Hybrid", "On-site"];
  const filtered = jobs.filter(j => {
    const matchesType = filter === "All" || j.type === filter;
    const matchesQuery = !query ||
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.location.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div style={{
        background: "#fff",
        padding: "56px 40px 48px",
        textAlign: "center",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <h1 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "clamp(36px, 6vw, 58px)",
          fontWeight: "700",
          margin: "0 0 10px",
          color: "#1a1a1a",
          lineHeight: 1.1,
        }}>
          Find your next role,<br />the human way.
        </h1>
        <p style={{ color: "#888", fontSize: "15px", margin: "0 0 32px" }}>
          Every post-it is a door. Find yours.
        </p>

        {/* Search bar */}
        <div style={{
          display: "flex",
          maxWidth: "560px",
          margin: "0 auto 28px",
          background: "#fff9c4",
          borderRadius: "12px",
          padding: "6px 6px 6px 20px",
          boxShadow: "3px 3px 0px #e8d84a, 0 4px 20px rgba(0,0,0,0.08)",
          alignItems: "center",
          gap: "8px",
        }}>
          <input
            type="text"
            placeholder='Search jobs, companies, locations...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: "15px",
              color: "#1a1a1a",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
              minWidth: 0,
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#888",
              padding: "0 4px",
            }}>✕</button>
          )}
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: "7px 18px",
                borderRadius: "20px",
                border: filter === t ? "2px solid #1a1a1a" : "1.5px solid #e0e0e0",
                background: filter === t ? "#1a1a1a" : "#fff",
                color: filter === t ? "#fff" : "#555",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.15s ease",
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Corkboard */}
      <div style={{
        background: `
          radial-gradient(ellipse at 20% 30%, #b8864e 0%, transparent 60%),
          radial-gradient(ellipse at 80% 70%, #8b5e3c 0%, transparent 60%),
          #c4935a
        `,
        minHeight: "600px",
        padding: "48px 40px 80px",
        position: "relative",
      }}>
        {/* Cork texture overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)
          `,
          backgroundSize: "12px 12px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <p style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "26px",
                color: "#fff",
                margin: "0 0 8px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              }}>No jobs found.</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                Try a different filter or check back soon.
              </p>
            </div>
          ) : (
            <>
              <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "13px",
                marginBottom: "32px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}>
                {filtered.length} {filtered.length === 1 ? "posting" : "postings"} on the board
              </p>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "48px 36px",
                paddingTop: "20px",
              }}>
                {filtered.map((job, i) => (
                  <PostItCard
                    key={job.id}
                    job={job}
                    index={i}
                    onClick={() => onSelectJob(job, i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}