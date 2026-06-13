import React, { useState, useEffect } from "react";
import { storage } from "../utils/storage";

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

export default function Apply({ job, userEmail, onBack, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({ name: "", email: userEmail || "", linkedin: "", resume: null });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          messages: [
            {
              role: "user",
              content: `You are a thoughtful hiring assistant for "${job.company}" hiring for "${job.title}".

Generate exactly 3 short personalized interview questions. Make them human, specific to the job, and help the employer understand the candidate's real experience and personality — not generic HR questions.

Job description: ${job.description}
Requirements: ${job.requirements || "Not specified"}
Skills: ${(job.tags || []).join(", ")}

Return ONLY a valid JSON array of 3 strings. No markdown, no explanation.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content[0].text.trim().replace(/```json|```/g, "");
      const parsed = JSON.parse(text);
      setQuestions(parsed);
    } catch (err) {
      console.error("Question generation error:", err);
      setQuestions([
        "What draws you to this specific role?",
        "Describe a relevant challenge you've navigated and what you learned.",
        "How do you stay sharp in your field?",
      ]);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Please fill in your name and email.");
    setSubmitting(true);

    const application = {
      id: Date.now().toString(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantName: form.name,
      applicantEmail: form.email,
      linkedin: form.linkedin,
      resumeFileName: form.resume?.name || null,
      answers: questions.map((q, i) => ({ question: q, answer: answers[i] || "" })),
      submittedAt: new Date().toISOString(),
    };

    storage.saveApplication(job.id, application);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>🎉</div>
        <h2 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "36px",
          fontWeight: "700",
          color: "#1a1a1a",
          margin: "0 0 12px",
        }}>Application sent!</h2>
        <p style={{ color: "#888", fontSize: "15px", marginBottom: "32px" }}>
          {job.company} will be in touch at {form.email}.
        </p>
        <button onClick={onSubmitted} style={{
          padding: "12px 28px",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}>Back to the board</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px", fontFamily: "'Inter', sans-serif" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "14px", color: "#888", marginBottom: "32px",
        padding: 0, fontFamily: "'Inter', sans-serif",
      }}>← Back to job</button>

      <div style={{ marginBottom: "36px" }}>
        <h1 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "36px",
          fontWeight: "700",
          margin: "0 0 6px",
          color: "#1a1a1a",
        }}>Apply — {job.title}</h1>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{job.company}</p>
      </div>

      {/* Contact info */}
      <section style={{ marginBottom: "36px" }}>
        <h2 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "24px",
          fontWeight: "700",
          margin: "0 0 16px",
          color: "#1a1a1a",
        }}>Your details</h2>

        {[
          { key: "name", label: "Full name", placeholder: "Jane Smith", required: true },
          { key: "email", label: "Email address", placeholder: "jane@example.com", required: true },
          { key: "linkedin", label: "LinkedIn profile", placeholder: "linkedin.com/in/janesmith", required: false },
        ].map(({ key, label, placeholder, required }) => (
          <div key={key} style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "6px",
            }}>
              {label} {required && <span style={{ color: "#e05" }}>*</span>}
            </label>
            <input
              type="text"
              placeholder={placeholder}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "8px",
                border: "1.5px solid #e0e0e0",
                fontSize: "14px",
                fontFamily: "'Inter', sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        {/* Resume upload */}
        <div>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#444",
            marginBottom: "6px",
          }}>
            Resume <span style={{ color: "#999", fontWeight: "400" }}>(PDF or Word)</span>
          </label>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "11px 14px",
            borderRadius: "8px",
            border: "1.5px dashed #ccc",
            cursor: "pointer",
            fontSize: "14px",
            color: form.resume ? "#1a1a1a" : "#aaa",
            background: "#fafafa",
          }}>
            📎 {form.resume ? form.resume.name : "Upload your resume"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={e => setForm(f => ({ ...f, resume: e.target.files[0] }))}
            />
          </label>
        </div>
      </section>

      {/* AI interview questions */}
      <section style={{ marginBottom: "36px" }}>
        <h2 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "24px",
          fontWeight: "700",
          margin: "0 0 6px",
          color: "#1a1a1a",
        }}>A few questions</h2>
        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 20px" }}>
          These are tailored to this specific role. Take your time.
        </p>

        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "32px",
            color: "#aaa",
            fontSize: "14px",
          }}>
            ✨ Crafting questions for this role…
          </div>
        ) : (
          questions.map((q, i) => (
            <div key={i} style={{
              background: ["#fff9c4", "#ffd1dc", "#cce5ff"][i % 3],
              borderRadius: "3px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
            }}>
              <div style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "18px",
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "12px",
              }}>
                {i + 1}. {q}
              </div>
              <textarea
                rows={4}
                placeholder="Your answer…"
                value={answers[i] || ""}
                onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1.5px solid rgba(0,0,0,0.12)",
                  background: "transparent",
                  fontSize: "14px",
                  fontFamily: "'Inter', sans-serif",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))
        )}
      </section>

      <button
        onClick={handleSubmit}
        disabled={submitting || loading}
        style={{
          width: "100%",
          padding: "16px",
          background: submitting ? "#888" : "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: submitting ? "not-allowed" : "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {submitting ? "Submitting…" : "Submit application →"}
      </button>
    </div>
  );
}