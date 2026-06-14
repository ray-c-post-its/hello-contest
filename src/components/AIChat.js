import React, { useState, useRef, useEffect } from "react";
import Fuse from "fuse.js";
import PostItCard from "./PostItCard";

const LAMBDA_URL = "https://qoofy2efipnxelwsd4xz7ithfu0tdlkh.lambda-url.us-east-1.on.aws/";

export default function AIChat({ isOpen, onClose, jobs, onSelectJob }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Post-Its job search assistant. Tell me what kind of role you're looking for — your skills, preferred location, work style, salary range — and I'll find the best matches for you. I'm only here to help with job search, so let's find you something great! 📌",
      jobs: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Build Fuse index once
  const fuse = useRef(null);
  useEffect(() => {
    fuse.current = new Fuse(jobs, {
      keys: [
        { name: "title", weight: 0.3 },
        { name: "company", weight: 0.1 },
        { name: "location", weight: 0.2 },
        { name: "tags", weight: 0.2 },
        { name: "description", weight: 0.1 },
        { name: "type", weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
  }, [jobs]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const preFilterJobs = (query) => {
    if (!fuse.current) return jobs.slice(0, 20);
    const results = fuse.current.search(query);
    if (results.length < 5) {
      // Fallback: also search individual words
      const words = query.split(" ").filter(w => w.length > 2);
      const wordResults = words.flatMap(w => fuse.current.search(w));
      const seen = new Set(results.map(r => r.item.id));
      wordResults.forEach(r => {
        if (!seen.has(r.item.id)) {
          seen.add(r.item.id);
          results.push(r);
        }
      });
    }
    return results.slice(0, 25).map(r => r.item);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      // Step 1: Fuse.js pre-filter
      const candidates = preFilterJobs(currentInput);

      // Step 2: Claude ranks and responds
      const conversationHistory = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: `You are a friendly job search assistant for Post-Its. Your ONLY purpose is to help users find jobs.

STRICT RULES:
- Only discuss job search, careers, job matching, resume tips, and interview advice
- If asked about ANYTHING else, say exactly: "I'm only here to help with your job search! What kind of role are you looking for?"
- Always return valid JSON — never plain text

These are the most relevant jobs for this query (pre-filtered for you):
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

Always respond in this EXACT JSON format:
{"message": "your friendly response here", "recommendedIds": ["id1", "id2"]}

If not recommending jobs: {"message": "your response", "recommendedIds": []}`,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "API error");
      if (!data.content?.[0]) throw new Error("No response from AI");

      const text = data.content[0].text.trim().replace(/```json|```/g, "");

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { message: text, recommendedIds: [] };
      }

      const recommendedJobs = (parsed.recommendedIds || [])
        .map(id => jobs.find(j => j.id === id))
        .filter(Boolean);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: parsed.message,
        jobs: recommendedJobs,
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again!",
        jobs: [],
      }]);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            background: "#fff9c4",
            padding: "4px 10px 6px",
            borderRadius: "2px",
            transform: "rotate(-2deg)",
            display: "inline-block",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontFamily: "'Caveat', cursive",
            fontSize: "20px",
            fontWeight: "700",
          }}>📌</span>
          <div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "22px",
              fontWeight: "700",
              color: "#1a1a1a",
            }}>
              Post-Its AI Assistant
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              Job search help only · {jobs.length} jobs indexed
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          color: "#888",
          padding: "4px 8px",
          borderRadius: "6px",
        }}>✕</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: msg.jobs?.length > 0 ? "16px" : "0",
            }}>
              <div style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: msg.role === "user"
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#1a1a1a" : "#f5f5f5",
                color: msg.role === "user" ? "#fff" : "#1a1a1a",
                fontSize: "14px",
                lineHeight: 1.6,
              }}>
                {msg.content}
              </div>
            </div>

            {msg.jobs?.length > 0 && (
              <div>
                <p style={{
                  fontSize: "12px",
                  color: "#aaa",
                  margin: "0 0 12px",
                  fontWeight: "600",
                }}>
                  RECOMMENDED ROLES
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "32px 24px",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                }}>
                  {msg.jobs.map((job, j) => (
                    <PostItCard
                      key={job.id}
                      job={job}
                      index={j}
                      onClick={() => {
                        onClose();
                        onSelectJob(job, j);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "12px 16px",
              borderRadius: "16px 16px 16px 4px",
              background: "#f5f5f5",
              color: "#888",
              fontSize: "14px",
            }}>
              ✨ Searching {jobs.length} jobs…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid #f0f0f0",
        background: "#fff",
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}>
        <input
          type="text"
          placeholder="Ask about jobs, salary, location, skills…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !loading) {
              e.preventDefault();
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "24px",
            border: "1.5px solid #e0e0e0",
            fontSize: "14px",
            fontFamily: "'Inter', sans-serif",
            outline: "none",
            background: "#fafafa",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 20px",
            background: loading || !input.trim() ? "#ccc" : "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Send →
        </button>
      </div>
    </div>
  );
}