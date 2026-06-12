import React, { useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { awsConfig } from "./aws-config";
import { GoogleGenerativeAI } from "@google/generative-ai";

Amplify.configure(awsConfig);

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Beltway Tech Solutions",
    location: "McLean, VA (Hybrid)",
    salary: "$145,000 – $175,000",
    commute: "~20 min from DC",
    type: "Hybrid",
    tags: ["React", "Node.js", "AWS"],
    description: "Build scalable web platforms for federal clients. 3 days remote, 2 days on-site.",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Capitol Creative Agency",
    location: "Washington, DC (On-site)",
    salary: "$90,000 – $115,000",
    commute: "Metro accessible",
    type: "On-site",
    tags: ["Figma", "User Research", "Design Systems"],
    description: "Shape digital experiences for policy and advocacy organizations across the district.",
  },
  {
    id: 3,
    title: "Product Manager",
    company: "RemoteFirst Inc.",
    location: "Fully Remote (US)",
    salary: "$130,000 – $160,000",
    commute: "No commute",
    type: "Remote",
    tags: ["Agile", "Roadmapping", "Stakeholder Management"],
    description: "Lead a fully distributed team of 12 building HR tech SaaS. Work from anywhere in the US.",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "NIH Contractor",
    location: "Bethesda, MD (Hybrid)",
    salary: "$85,000 – $105,000",
    commute: "~15 min from DC",
    type: "Hybrid",
    tags: ["Python", "SQL", "Tableau"],
    description: "Support health outcomes research with federal data. Short commute from most of DC.",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudGov Partners",
    location: "Reston, VA (Remote-first)",
    salary: "$155,000 – $185,000",
    commute: "Rare on-site travel",
    type: "Remote",
    tags: ["Kubernetes", "Terraform", "CI/CD"],
    description: "High-compensation role supporting government cloud infrastructure. Mostly remote with occasional DC travel.",
  },
  {
    id: 6,
    title: "Communications Coordinator",
    company: "Dupont Circle Nonprofit",
    location: "Washington, DC (On-site)",
    salary: "$55,000 – $68,000",
    commute: "Walkable / Metro",
    type: "On-site",
    tags: ["Content Writing", "Social Media", "Email Marketing"],
    description: "Tell the story of a mission-driven environmental nonprofit right in the heart of DC.",
  },
];

const CARD_COLORS = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];
const ROTATIONS = [-2.1, 1.8, -1.3, 2.4, -1.7, 1.2];

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const S = {
  app: {
    fontFamily: "'Inter', sans-serif",
    background: "#ffffff",
    minHeight: "100vh",
    color: "#1a1a1a",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: "64px",
    borderBottom: "1px solid #f0f0f0",
    background: "#ffffff",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Caveat', cursive",
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoPin: {
    display: "inline-block",
    background: "#fff9c4",
    padding: "2px 8px 4px",
    borderRadius: "2px",
    transform: "rotate(-2deg)",
    boxShadow: "2px 2px 4px rgba(0,0,0,0.10)",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  navEmail: {
    fontSize: "13px",
    color: "#888",
  },
  signOutBtn: {
    fontSize: "13px",
    padding: "7px 16px",
    borderRadius: "8px",
    border: "1.5px solid #e0e0e0",
    background: "#fff",
    color: "#444",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  hero: {
    textAlign: "center",
    padding: "72px 24px 48px",
  },
  heroTitle: {
    fontFamily: "'Caveat', cursive",
    fontSize: "clamp(36px, 6vw, 62px)",
    fontWeight: "700",
    margin: "0 0 10px",
    lineHeight: 1.15,
    color: "#1a1a1a",
  },
  heroSub: {
    fontSize: "15px",
    color: "#888",
    margin: "0 0 36px",
  },
  searchWrap: {
    display: "flex",
    maxWidth: "620px",
    margin: "0 auto",
    background: "#fff9c4",
    borderRadius: "12px",
    padding: "6px 6px 6px 20px",
    boxShadow: "3px 3px 0px #e8d84a, 0 4px 20px rgba(0,0,0,0.08)",
    alignItems: "center",
    gap: "8px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    fontSize: "15px",
    color: "#1a1a1a",
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    minWidth: 0,
  },
  searchBtn: {
    padding: "10px 22px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  },
  resultsSection: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "8px 24px 80px",
  },
  resultsLabel: {
    textAlign: "center",
    fontSize: "13px",
    color: "#aaa",
    marginBottom: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "36px",
    alignItems: "start",
  },
  card: {
    padding: "24px",
    borderRadius: "3px",
    position: "relative",
    cursor: "default",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  typePill: {
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
  },
  cardTitle: {
    fontFamily: "'Caveat', cursive",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 4px",
    paddingRight: "56px",
    color: "#1a1a1a",
  },
  cardCompany: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#555",
    margin: "0 0 14px",
  },
  cardMeta: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 4px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#555",
    lineHeight: 1.55,
    margin: "12px 0",
  },
  tagWrap: {
    marginTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  tag: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "20px",
    background: "rgba(0,0,0,0.08)",
    color: "#444",
    fontWeight: "500",
  },
  salary: {
    fontFamily: "'Caveat', cursive",
    fontSize: "19px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: "12px",
  },
  loading: {
    textAlign: "center",
    padding: "64px 24px",
    color: "#aaa",
    fontSize: "15px",
  },
  empty: {
    textAlign: "center",
    padding: "64px 24px",
  },
  emptyHeading: {
    fontFamily: "'Caveat', cursive",
    fontSize: "24px",
    color: "#bbb",
    margin: "12px 0 4px",
  },
  emptySub: {
    fontSize: "14px",
    color: "#ccc",
  },
};

/* ─── JobCard ─────────────────────────────────────────────────────────────── */

function JobCard({ job, index }) {
  const [hovered, setHovered] = useState(false);
  const bg = CARD_COLORS[index % CARD_COLORS.length];
  const rot = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      style={{
        ...S.card,
        background: bg,
        transform: hovered ? "rotate(0deg) translateY(-4px)" : `rotate(${rot}deg)`,
        boxShadow: hovered
          ? "6px 6px 20px rgba(0,0,0,0.16)"
          : "3px 3px 10px rgba(0,0,0,0.11)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={S.typePill}>{job.type}</div>
      <div style={S.cardTitle}>{job.title}</div>
      <div style={S.cardCompany}>{job.company}</div>
      <div style={S.cardMeta}>📍 {job.location}</div>
      <div style={S.cardMeta}>🚇 {job.commute}</div>
      <div style={S.cardDesc}>{job.description}</div>
      <div style={S.tagWrap}>
        {job.tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}
      </div>
      <div style={S.salary}>{job.salary}</div>
    </div>
  );
}

/* ─── JobSearchApp ────────────────────────────────────────────────────────── */

function JobSearchApp({ user, signOut }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const email =
    user?.signInDetails?.loginId ||
    user?.attributes?.email ||
    user?.username ||
    "";

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setSummary("");
    setResults([]);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a job-matching assistant for a platform called Post-Its.

User's search: "${query}"

Jobs available (JSON):
${JSON.stringify(MOCK_JOBS, null, 2)}

Return ONLY a valid JSON object with:
- "matchedIds": number[] — IDs of matching jobs, ordered by relevance (partial matches included)
- "summary": string — one friendly sentence describing what you found

No markdown, no explanation, just the JSON object.`;

      const geminiResult = await model.generateContent(prompt);
      const raw = geminiResult.response.text().trim().replace(/```json|```/g, "");
      const parsed = JSON.parse(raw);

      const matched = (parsed.matchedIds || [])
        .map((id) => MOCK_JOBS.find((j) => j.id === id))
        .filter(Boolean);

      setResults(matched);
      setSummary(parsed.summary || "");
    } catch (err) {
      console.error("Search error:", err);
      setSummary("Something went wrong — please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={S.app}>
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Navbar */}
      <nav style={S.navbar}>
        <div style={S.logo}>
          <span style={S.logoPin}>📌</span>
          Post-Its
        </div>
        <div style={S.navRight}>
          {email && <span style={S.navEmail}>{email}</span>}
          <button style={S.signOutBtn} onClick={signOut}>Sign out</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={S.hero}>
        <h1 style={S.heroTitle}>
          Find your next role,<br />the human way.
        </h1>
        <p style={S.heroSub}>
          Describe what you're looking for in plain English — we'll do the matching.
        </p>
        <div style={S.searchWrap}>
          <input
            style={S.searchInput}
            type="text"
            placeholder='e.g. "high paying remote job near DC with no commute"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            style={{ ...S.searchBtn, opacity: loading ? 0.6 : 1 }}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </section>

      {/* Results */}
      <section style={S.resultsSection}>
        {loading && (
          <div style={S.loading}>✨ Matching your query to the best roles…</div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={S.empty}>
            <div style={{ fontSize: "40px" }}>📋</div>
            <p style={S.emptyHeading}>No matching roles found.</p>
            <p style={S.emptySub}>Try rephrasing your search.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            {summary && <p style={S.resultsLabel}>{summary}</p>}
            <div style={S.grid}>
              {results.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <JobSearchApp user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}