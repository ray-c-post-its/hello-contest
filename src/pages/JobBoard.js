import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import PostItCard from "../components/PostItCard";

export default function JobBoard({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setJobs(storage.getJobs());
  }, []);

  const types = ["All", "Remote", "Hybrid", "On-site"];
  const filtered = filter === "All" ? jobs : jobs.filter(j => j.type === filter);

  return (
    <div style={{ padding: "40px 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "36px",
          fontWeight: "700",
          margin: "0 0 8px",
          color: "#1a1a1a",
        }}>
          The Board
        </h2>
        <p style={{ color: "#888", fontSize: "15px", margin: "0 0 24px" }}>
          Every post-it is a door. Find yours.
        </p>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "26px",
            color: "#bbb",
            margin: "0 0 8px",
          }}>No postings yet.</p>
          <p style={{ fontSize: "14px", color: "#ccc" }}>Check back soon — jobs are on the way.</p>
        </div>
      ) : (
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
              onClick={() => onSelectJob(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}