import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";

const CARD_COLORS = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];
const ROTATIONS = [-2.1, 1.8, -1.3, 2.4, -1.7, 1.2];

export default function SwipeJobs({ userEmail, onSelectJob, onBack }) {
  const [jobs, setJobs] = useState([]);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [passed, setPassed] = useState([]);
  const [animating, setAnimating] = useState(null); // 'left' | 'right' | null
  const [done, setDone] = useState(false);

  useEffect(() => {
    const hidden = storage.getHidden(userEmail);
    const bookmarks = storage.getBookmarks(userEmail);
    const all = storage.getJobs().filter(j =>
      !hidden.includes(j.id) && !bookmarks.includes(j.id)
    );
    setJobs(all);
  }, [userEmail]);

  const current = jobs[index];
  const bg = CARD_COLORS[index % CARD_COLORS.length];
  const rot = ROTATIONS[index % ROTATIONS.length];

  const handleSwipe = (direction) => {
    if (animating) return;
    setAnimating(direction);

    setTimeout(() => {
      if (direction === "right") {
        storage.toggleBookmark(userEmail, current.id);
        setLiked(prev => [...prev, current]);
      } else {
        storage.hideJob(userEmail, current.id);
        setPassed(prev => [...prev, current]);
      }

      if (index + 1 >= jobs.length) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
      }
      setAnimating(null);
    }, 300);
  };

  if (jobs.length === 0) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", padding: "40px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
        <p style={{
          fontFamily: "'Caveat', cursive", fontSize: "28px",
          color: "#bbb", margin: "0 0 8px",
        }}>No jobs to swipe!</p>
        <p style={{ fontSize: "14px", color: "#ccc", marginBottom: "24px" }}>
          You've seen everything. Check your saved jobs.
        </p>
        <button onClick={onBack} style={{
          padding: "12px 24px", background: "#1a1a1a", color: "#fff",
          border: "none", borderRadius: "8px", fontSize: "14px",
          fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif",
        }}>Back to board</button>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", padding: "40px 24px", textAlign: "center",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎉</div>
        <h2 style={{
          fontFamily: "'Caveat', cursive", fontSize: "36px",
          fontWeight: "700", color: "#1a1a1a", margin: "0 0 12px",
        }}>You've seen them all!</h2>
        <p style={{ color: "#888", fontSize: "15px", marginBottom: "8px" }}>
          ✅ Saved: {liked.length} jobs
        </p>
        <p style={{ color: "#888", fontSize: "15px", marginBottom: "32px" }}>
          ❌ Passed: {passed.length} jobs
        </p>
        <button onClick={onBack} style={{
          padding: "12px 28px", background: "#1a1a1a", color: "#fff",
          border: "none", borderRadius: "8px", fontSize: "14px",
          fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif",
        }}>View saved jobs →</button>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      background: "#fff",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "40px 24px 24px",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <h1 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "36px",
          fontWeight: "700",
          margin: "0 0 8px",
          color: "#1a1a1a",
        }}>Scout Jobs</h1>
        <p style={{ color: "#888", fontSize: "14px", margin: "0 0 16px" }}>
          Swipe right to save, left to pass · {index + 1} of {jobs.length}
        </p>

        {/* Progress bar */}
        <div style={{
          maxWidth: "300px",
          margin: "0 auto",
          height: "4px",
          background: "#f0f0f0",
          borderRadius: "2px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${((index) / jobs.length) * 100}%`,
            background: "#1a1a1a",
            borderRadius: "2px",
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Card */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: bg,
          borderRadius: "3px",
          padding: "32px",
          boxShadow: animating === "right"
            ? "12px 12px 30px rgba(0,200,0,0.2)"
            : animating === "left"
              ? "12px 12px 30px rgba(200,0,0,0.2)"
              : "4px 4px 16px rgba(0,0,0,0.12)",
          transform: animating === "right"
            ? "rotate(8deg) translateX(60px) translateY(-20px)"
            : animating === "left"
              ? "rotate(-8deg) translateX(-60px) translateY(-20px)"
              : `rotate(${rot}deg)`,
          transition: animating ? "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease" : "none",
          opacity: animating ? 0 : 1,
          position: "relative",
          cursor: "pointer",
        }}
          onClick={() => onSelectJob(current, index)}
        >
          {/* Pin */}
          <div style={{
            position: "absolute", top: "-12px", left: "50%",
            transform: "translateX(-50%)", width: "20px", height: "20px",
            borderRadius: "50%", background: "rgba(0,0,0,0.22)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />

          {current.imageUrl && (
            <img src={current.imageUrl} alt={current.company} style={{
              width: "100%", height: "140px", objectFit: "cover",
              borderRadius: "2px", marginBottom: "16px",
            }} />
          )}

          <div style={{
            display: "inline-block", fontSize: "10px", padding: "3px 9px",
            borderRadius: "20px", background: "rgba(0,0,0,0.09)", color: "#333",
            fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase",
            marginBottom: "12px",
          }}>{current.type}</div>

          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: "28px",
            fontWeight: "700", color: "#1a1a1a", marginBottom: "6px",
          }}>{current.title}</div>

          <div style={{ fontSize: "14px", fontWeight: "600", color: "#555", marginBottom: "14px" }}>
            {current.company}
          </div>

          <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>📍 {current.location}</div>
          <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>💰 {current.salary}</div>
          {current.commute && (
            <div style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>🚇 {current.commute}</div>
          )}

          <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.6, marginBottom: "14px" }}>
            {current.description?.slice(0, 120)}{current.description?.length > 120 ? "…" : ""}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {(current.tags || []).slice(0, 4).map(t => (
              <span key={t} style={{
                fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                background: "rgba(0,0,0,0.08)", color: "#444", fontWeight: "500",
              }}>{t}</span>
            ))}
          </div>

          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: "20px",
            fontWeight: "700", color: "#1a1a1a", marginTop: "14px",
          }}>{current.salary}</div>

          <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "16px", marginBottom: 0 }}>
            Tap card to view full details
          </p>
        </div>

        {/* Swipe buttons */}
        <div style={{
          display: "flex",
          gap: "32px",
          marginTop: "40px",
          alignItems: "center",
        }}>
          <button
            onClick={() => handleSwipe("left")}
            style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "#fff", border: "2px solid #ffd1dc",
              fontSize: "24px", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            ✕
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#bbb", marginBottom: "4px" }}>pass / save</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "#ccc" }}>← pass</span>
              <span style={{ fontSize: "11px", color: "#ccc" }}>save →</span>
            </div>
          </div>

          <button
            onClick={() => handleSwipe("right")}
            style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "#fff", border: "2px solid #d4edda",
              fontSize: "24px", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            🔖
          </button>
        </div>

        {/* Keyboard hint */}
        <p style={{ fontSize: "12px", color: "#ccc", marginTop: "16px" }}>
          You can also use ← → arrow keys
        </p>
      </div>
useEffect(() => {
  const handleKey = (e) => {
    if (e.key === "ArrowRight") handleSwipe("right");
    if (e.key === "ArrowLeft") handleSwipe("left");
  };
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [index, animating, jobs]);
    </div>
  );
}