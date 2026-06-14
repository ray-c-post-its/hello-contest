import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { storage } from "../utils/storage";
import PostItCard from "../components/PostItCard";

const LAMBDA_URL = "https://qoofy2efipnxelwsd4xz7ithfu0tdlkh.lambda-url.us-east-1.on.aws/";

export default function JobBoard({ onSelectJob, userEmail }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [hidden, setHidden] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const fuseRef = useRef(null);

  useEffect(() => {
    const allJobs = storage.getJobs();
    setJobs(allJobs);
    setBookmarks(storage.getBookmarks(userEmail));
    setHidden(storage.getHidden(userEmail));

    fuseRef.current = new Fuse(allJobs, {
      keys: [
        { name: "title", weight: 0.3 },
        { name: "location", weight: 0.25 },
        { name: "tags", weight: 0.2 },
        { name: "description", weight: 0.1 },
        { name: "type", weight: 0.1 },
        { name: "company", weight: 0.05 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
  }, [userEmail]);

  const handleBookmark = (jobId) => {
    const updated = storage.toggleBookmark(userEmail, jobId);
    setBookmarks([...updated]);
  };

  const handleHide = (jobId) => {
    storage.hideJob(userEmail, jobId);
    setHidden(prev => [...prev, jobId]);
  };

  const handleUnhideAll = () => {
    storage.clearHidden(userEmail);
    setHidden([]);
    setShowHidden(false);
  };

  const types = ["All", "Remote", "Hybrid", "On-site"];

  const visibleJobs = jobs.filter(j => {
    if (showHidden) return hidden.includes(j.id);
    if (hidden.includes(j.id)) return false;
    if (showBookmarked) return bookmarks.includes(j.id);
    if (filter !== "All" && j.type !== filter) return false;
    return true;
  });

  const displayJobs = searched
    ? results.filter(j => !hidden.includes(j.id))
    : visibleJobs;

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setSearched(true);
    setShowBookmarked(false);
    setShowHidden(false);
    setSummary("");
    setResults([]);

    try {
      // Step 1: Fuse.js pre-filter
      let candidates = [];
      if (fuseRef.current) {
        const fuseResults = fuseRef.current.search(query);
        candidates = fuseResults.map(r => r.item);

        // If fewer than 10 results, also search word by word
        if (candidates.length < 10) {
          const words = query.split(" ").filter(w => w.length > 2);
          const seen = new Set(candidates.map(j => j.id));
          words.forEach(word => {
            fuseRef.current.search(word).forEach(r => {
              if (!seen.has(r.item.id)) {
                seen.add(r.item.id);
                candidates.push(r.item);
              }
            });
          });
        }

        candidates = candidates.slice(0, 25);
      } else {
        candidates = jobs.slice(0, 25);
      }

      // Step 2: Claude semantic ranking
      const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: `You are an expert job matching assistant for Post-Its.

User's search: "${query}"

Pre-filtered candidate jobs (rank these by relevance):
${JSON.stringify(candidates.map(j => ({
  id: j.id,
  title: j.title,
  company: j.company,
  location: j.location,
  salary: j.salary,
  commute: j.commute,
  type: j.type,
  tags: j.tags,
})), null, 0)}

Return ONLY valid JSON:
{"matchedIds": ["id1", "id2"], "summary": "one friendly sentence about what you found"}

Order by best match first. Include all relevant results.`,
          }],
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message);
      if (!data.content?.[0]) throw new Error("No response");

      const text = data.content[0].text.trim().replace(/```json|```/g, "");
      const parsed = JSON.parse(text);

      const matched = (parsed.matchedIds || [])
        .map(id => jobs.find(j => j.id === id))
        .filter(Boolean);

      // If Claude returned nothing, fall back to Fuse results
      setResults(matched.length > 0 ? matched : candidates);
      setSummary(parsed.summary || "");
    } catch (err) {
      console.error("Search error:", err);
      setSummary("Search ran into an issue — showing closest matches.");
      // Fallback to Fuse results
      if (fuseRef.current) {
        setResults(fuseRef.current.search(query).slice(0, 15).map(r => r.item));
      }
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
            placeholder='e.g. "remote Python job with good pay near DC"'
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
              background: "none", border: "none", cursor: "pointer",
              fontSize: "16px", color: "#888", padding: "0 4px", flexShrink: 0,
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
            }}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        {/* Filter pills */}
        {!searched && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {types.map(t => (
              <button key={t} onClick={() => {
                setFilter(t);
                setShowBookmarked(false);
                setShowHidden(false);
              }} style={{
                padding: "7px 18px",
                borderRadius: "20px",
                border: filter === t && !showBookmarked && !showHidden
                  ? "2px solid #1a1a1a" : "1.5px solid #e0e0e0",
                background: filter === t && !showBookmarked && !showHidden
                  ? "#1a1a1a" : "#fff",
                color: filter === t && !showBookmarked && !showHidden ? "#fff" : "#555",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.15s ease",
              }}>{t}</button>
            ))}
            <button onClick={() => {
              setShowBookmarked(!showBookmarked);
              setShowHidden(false);
              setFilter("All");
            }} style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border: showBookmarked ? "2px solid #1a1a1a" : "1.5px solid #e0e0e0",
              background: showBookmarked ? "#fff9c4" : "#fff",
              color: "#555",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
            }}>🔖 Saved ({bookmarks.length})</button>
            {hidden.length > 0 && (
              <button onClick={() => {
                setShowHidden(!showHidden);
                setShowBookmarked(false);
              }} style={{
                padding: "7px 18px",
                borderRadius: "20px",
                border: showHidden ? "2px solid #1a1a1a" : "1.5px solid #e0e0e0",
                background: showHidden ? "#ffd1dc" : "#fff",
                color: "#555",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}>🙈 Hidden ({hidden.length})</button>
            )}
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
              textAlign: "center", padding: "80px 24px",
              background: "rgba(255,255,255,0.15)", borderRadius: "12px",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "16px" }}>✨</div>
              <p style={{
                fontFamily: "'Caveat', cursive", fontSize: "24px",
                color: "#fff", textShadow: "1px 1px 3px rgba(0,0,0,0.2)", margin: 0,
              }}>Searching {jobs.length} jobs…</p>
            </div>
          )}

          {!loading && displayJobs.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 24px",
              background: "rgba(255,255,255,0.15)", borderRadius: "12px",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                {showBookmarked ? "🔖" : showHidden ? "🙈" : "📋"}
              </div>
              <p style={{
                fontFamily: "'Caveat', cursive", fontSize: "26px",
                color: "#fff", margin: "0 0 8px",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              }}>
                {showBookmarked ? "No saved jobs yet."
                  : showHidden ? "No hidden jobs."
                  : "No jobs found."}
              </p>
              {showHidden && hidden.length > 0 && (
                <button onClick={handleUnhideAll} style={{
                  marginTop: "16px", padding: "10px 24px",
                  background: "#fff", border: "none", borderRadius: "8px",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer",
                  fontFamily: "'Inter', sans-serif", color: "#1a1a1a",
                }}>Restore all hidden jobs</button>
              )}
            </div>
          )}

          {!loading && displayJobs.length > 0 && (
            <>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "32px", flexWrap: "wrap", gap: "8px",
              }}>
                <p style={{
                  color: "rgba(255,255,255,0.85)", fontSize: "13px",
                  margin: 0, textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}>
                  {searched
                    ? summary || `${displayJobs.length} matches for "${query}"`
                    : showBookmarked
                      ? `${displayJobs.length} saved job${displayJobs.length !== 1 ? "s" : ""}`
                      : showHidden
                        ? `${displayJobs.length} hidden job${displayJobs.length !== 1 ? "s" : ""}`
                        : `${displayJobs.length} posting${displayJobs.length !== 1 ? "s" : ""} on the board`
                  }
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {showHidden && (
                    <button onClick={handleUnhideAll} style={{
                      padding: "6px 14px",
                      background: "rgba(255,255,255,0.9)",
                      border: "none", borderRadius: "20px",
                      fontSize: "12px", fontWeight: "600",
                      cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      color: "#1a1a1a",
                    }}>Restore all</button>
                  )}
                  {searched && (
                    <button onClick={handleClear} style={{
                      padding: "6px 14px",
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.4)",
                      borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                      cursor: "pointer", fontFamily: "'Inter', sans-serif",
                      color: "#fff",
                    }}>✕ Clear search</button>
                  )}
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "48px 36px",
                paddingTop: "20px",
              }}>
                {displayJobs.map((job, i) => (
                  <PostItCard
                    key={job.id}
                    job={job}
                    index={i}
                    onClick={() => onSelectJob(job, i)}
                    isBookmarked={bookmarks.includes(job.id)}
                    onBookmark={handleBookmark}
                    onHide={showHidden ? null : handleHide}
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