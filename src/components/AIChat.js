import React, { useState, useRef, useEffect } from "react";
import PostItCard from "./PostItCard";

const LAMBDA_URL = "https://qoofy2efipnxelwsd4xz7ithfu0tdlkh.lambda-url.us-east-1.on.aws/";
const CARD_COLORS = ["#fff9c4", "#ffd1dc", "#cce5ff", "#d4edda"];

export default function AIChat({ isOpen, onClose, jobs, onSelectJob, userEmail }) {
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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
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
          system: `You are a friendly and helpful job search assistant for Post-Its, a recruitment platform. Your ONLY purpose is to help users find jobs that match their needs from the available listings.

STRICT RULES:
- You can ONLY discuss job search, careers, job matching, resume tips, and interview advice
- If asked about ANYTHING else (food, weather, sports, general knowledge, politics, etc.), respond with: "I'm only here to help with your job search! What kind of role are you looking for?"
- Never break character or discuss topics outside of job searching
- Be warm, encouraging, and specific in your recommendations

Available jobs on Post-Its:
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
})
), null, 2)}

When recommending jobs, always return a JSON response in this EXACT format:
{
  "message": "Your conversational response here",
  "recommendedIds": ["seed-1", "seed-5"]
}

If not recommending specific jobs, use:
{
  "message": "Your conversational response here", 
  "recommendedIds": []
}

ALWAYS return valid JSON. Never return plain text.`,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
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
      {/* Chat header */}
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
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", fontWeight: "700", color: "#1a1a1a" }}>
              Post-Its AI Assistant
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>Job search help only</div>
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

      {/* Messages + job results */}
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
            {/* Message bubble */}
            <div style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: msg.jobs?.length > 0 ? "16px" : "0",
            }}>
              <div style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#1a1a1a" : "#f5f5f5",
                color: msg.role === "user" ? "#fff" : "#1a1a1a",
                fontSize: "14px",
                lineHeight: 1.6,
              }}>
                {msg.content}
              </div>
            </div>

            {/* Recommended post-it cards */}
            {msg.jobs?.length > 0 && (
              <div>
                <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 12px", fontWeight: "600" }}>
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
              ✨ Thinking…
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