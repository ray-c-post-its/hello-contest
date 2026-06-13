import React, { useState } from "react";
import { storage } from "../utils/storage";

export default function CreateJob({ employerEmail, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: "", company: "", imageUrl: "", location: "",
    commute: "", salary: "", type: "Remote",
    description: "", requirements: "", tags: "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.title || !form.company || !form.description) {
      return alert("Please fill in title, company, and description.");
    }
    setSaving(true);

    const job = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      id: Date.now().toString(),
      employerEmail,
      postedAt: new Date().toISOString(),
    };

    storage.saveJob(job);
    setSaving(false);
    onSaved(job);
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e0e0e0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "16px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "6px",
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px", fontFamily: "'Inter', sans-serif" }}>
      <button onClick={onCancel} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "14px", color: "#888", marginBottom: "32px",
        padding: 0, fontFamily: "'Inter', sans-serif",
      }}>← Back to dashboard</button>

      <h1 style={{
        fontFamily: "'Caveat', cursive",
        fontSize: "36px",
        fontWeight: "700",
        margin: "0 0 32px",
        color: "#1a1a1a",
      }}>Post a new job</h1>

      <label style={labelStyle}>Job title <span style={{ color: "#e05" }}>*</span></label>
      <input style={inputStyle} placeholder="e.g. Senior Product Designer" value={form.title} onChange={e => set("title", e.target.value)} />

      <label style={labelStyle}>Company name <span style={{ color: "#e05" }}>*</span></label>
      <input style={inputStyle} placeholder="e.g. Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} />

      <label style={labelStyle}>Company image URL <span style={{ color: "#999", fontWeight: "400" }}>(optional)</span></label>
      <input style={inputStyle} placeholder="https://..." value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Location</label>
          <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. Washington, DC" value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Commute info</label>
          <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. Metro accessible" value={form.commute} onChange={e => set("commute", e.target.value)} />
        </div>
      </div>
      <div style={{ height: "16px" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Salary range</label>
          <input style={{ ...inputStyle, marginBottom: 0 }} placeholder="e.g. $90k – $120k" value={form.salary} onChange={e => set("salary", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Work type</label>
          <select
            value={form.type}
            onChange={e => set("type", e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          >
            {["Remote", "Hybrid", "On-site"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ height: "16px" }} />

      <label style={labelStyle}>Job description <span style={{ color: "#e05" }}>*</span></label>
      <textarea
        rows={5}
        placeholder="Describe the role, team, and what success looks like…"
        value={form.description}
        onChange={e => set("description", e.target.value)}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label style={labelStyle}>Requirements <span style={{ color: "#999", fontWeight: "400" }}>(one per line)</span></label>
      <textarea
        rows={4}
        placeholder={"3+ years of relevant experience\nStrong communication skills\n..."}
        value={form.requirements}
        onChange={e => set("requirements", e.target.value)}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label style={labelStyle}>Skills / tags <span style={{ color: "#999", fontWeight: "400" }}>(comma separated)</span></label>
      <input style={inputStyle} placeholder="React, Node.js, Figma" value={form.tags} onChange={e => set("tags", e.target.value)} />

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "16px",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {saving ? "Posting…" : "Post job →"}
      </button>
    </div>
  );
}