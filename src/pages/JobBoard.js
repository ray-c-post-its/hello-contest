import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";
import PostItCard from "../components/PostItCard";

const LAMBDA_URL = "https://qoofy2efipnxelwsd4xz7ithfu0tdlkh.lambda-url.us-east-1.on.aws/";

export default function JobBoard({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setJobs(storage.getJobs());
  }, []);

  const types = ["All", "Remote", "Hybrid", "On-site"];

  const displayJobs = searched
    ? results
    : jobs.filter(j => filter === "All" || j.type === filter);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setSearched(true);
    setSummary("");
    setResults([]);

    try {
      const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `You are an expert job matching assistant for a recruitment platform called Post-Its.

A job seeker has described what they're looking for:
"${query}"

Here are all available jobs:
${JSON.stringify(jobs.map(j => ({
  id: j.id,
  title: j.title,
  company: j.company,
  location: j.location,
  salary: j.salary,
  commute: j.commute,
  type: j.type,
  tags: j.tags,
  description: j.description,
  requirements: j.requirements,
})), null, 2)}

Deeply understand what the person is looking for — even if they don't use exact keywords. Consider:
- Skills and tools mentioned (e.g. "Excel" → finance, analyst, operations roles)
- Location preferences (e.g. "short commute to DC" → DC Metro, Arlington, McLean, Bethesda)
- Work style (remote, hybrid, on-site)
- Salary expectations if mentioned
- Industry or role type preferences
- Lifestyle factors (work-life balance, no commute, fast-paced)

Return ONLY a valid JSON object with no markdown:
- "matchedIds": string[] — IDs ordered by relevance, best match first, at least 6 up to 20
- "summary": string — one friendly specific sentence describing what you found`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text.trim().replace(/```json|```/g, "");
      const parsed = JSON.parse(text);

      const matched = (parsed.matchedIds || [])
        .map(id => jobs.find(j => j.id === id))
        .filter(Boolean);

      setResults(matched);
      setSummary(parsed.summary || "");
    } catch (err) {
      console.error("Search error:", err);
      setSummary("Search ran into an issue — try again.");
      setResults([]);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setQuery("");
    setSearched(false);
    setResults([]);
    setSummary("");
  };

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
          Describe what you're looking for in plain English — our AI does the matching.
        </p>

        {/* Search bar */}
        <div style={{
          display: "flex",
          maxWidth: "680px",
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
            placeholder='e.g. "I want a job near DC that uses Excel with a short commute"'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                handleSearch();
              }
            }}
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
          {searched && (
            <button onClick={handleClear} style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#888",
              padding: "0 4px",
              flexShrink: 0,
            }}>✕</button>
          )}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "10px 22px",
              background: loading ? "#888" : "#1a1a1a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Inter', sans-serif",
              flexShrink: 0,
              transition: "background 0.15s ease",
            }}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Filter pills */}
        {!searched && (
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
        )}
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
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)`,
          backgroundSize: "12px 12px",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          {loading && (
            <div style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>✨</div>
              <p style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "24px",
                color: "#fff",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
                margin: 0,
              }}>Reading your mind…</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "8px" }}>
                Matching your query against {jobs.length} jobs
              </p>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
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
              }}>No matches found.</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "20px" }}>
                Try describing what you're looking for differently.
              </p>
              <button onClick={handleClear} style={{
                padding: "10px 24px",
                background: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                color: "#1a1a1a",
              }}>Browse all jobs</button>
            </div>
          )}

          {!loading && displayJobs.length > 0 && (
            <>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <p style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "13px",
                  margin: 0,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}>
                  {searched
                    ? summary || `${results.length} matches for "${query}"`
                    : `${displayJobs.length} ${filter === "All" ? "" : filter + " "}${displayJobs.length === 1 ? "posting" : "postings"} on the board`
                  }
                </p>
                {searched && (
                  <button onClick={handleClear} style={{
                    padding: "6px 14px",
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    color: "#fff",
                  }}>✕ Clear search</button>
                )}
              </div>

              <div