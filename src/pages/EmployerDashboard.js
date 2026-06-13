import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import PostItCard from "../components/PostItCard";

export default function EmployerDashboard({ employerEmail, onCreateJob, onViewApplications }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const all = storage.getJobs();
    setJobs(all.filter(j => j.employerEmail === employerEmail));
  }, [employerEmail]);

  const handleDelete = (jobId) => {
    if (!window.confirm("Delete this posting?")) return;
    storage.deleteJob(jobId);
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const allApplications = storage.getApplications();
  const getAppCount = (jobId) => (allApplications[jobId] || []).length;

  return (
    <div style={{ padding: "40px 40px 80px", maxWidth: "1200px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "36px",
            fontWeight: "700",
            margin: "0 0 6px",
            color: "#1a1a1a",
          }}>Your postings</h2>
          <p style={{ color: "#888", fontSize: "15px", margin: 0 }}>
            {jobs.length} active {jobs.length === 1 ? "job" : "jobs"}
          </p>
        </div>
        <button
          onClick={onCreateJob}
          style={{
            padding: "12px 24px",
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
          }}
        >+ Post a job</button>
      </div>

      {jobs.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 24px",
          background: "#fafafa",
          borderRadius: "12px",
          border: "2px dashed #e0e0e0",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📌</div>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "26px",
            color: "#bbb",
            margin: "0 0 8px",
          }}>No postings yet.</p>
          <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "24px" }}>
            Pin your first job to the board.
          </p>
          <button
            onClick={onCreateJob}
            style={{
              padding: "12px 24px",
              background: "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}
          >Post your first job</button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "48px 36px",
          paddingTop: "20px",
        }}>
          {jobs.map((job, i) => (
            <div key={job.id} style={{ position: "relative" }}>
              <PostItCard
                job={job}
                index={i}
                onDelete={handleDelete}
              />
              {/* Applications badge */}
              <button
                onClick={() => onViewApplications(job)}
                style={{
                  marginTop: "16px",
                  width: "100%",
                  padding: "9px",
                  background: getAppCount(job.id) > 0 ? "#fff9c4" : "#f5f5f5",
                  border: "1.5px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  color: "#444",
                }}
              >
                {getAppCount(job.id)} {getAppCount(job.id) === 1 ? "applicant" : "applicants"} →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}