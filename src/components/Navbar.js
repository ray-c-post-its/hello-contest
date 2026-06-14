import React, { useState } from "react";

export default function Navbar({ email, role, activeMode, onModeSwitch, onNavigate, onOpenChat, signOut }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: "64px",
        borderBottom: "1px solid #f0f0f0",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "flex", alignItems: "center", gap: "8px",
          fontFamily: "'Caveat', cursive", fontSize: "28px",
          fontWeight: "700", color: "#1a1a1a",
        }}>
          <span style={{
            display: "inline-block", background: "#fff9c4",
            padding: "2px 8px 4px", borderRadius: "2px",
            transform: "rotate(-2deg)", boxShadow: "2px 2px 4px rgba(0,0,0,0.10)",
          }}>📌</span>
          Post-Its
        </button>

        {/* Center nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {activeMode === "seeker" && (
            <>
              <NavLink onClick={() => onNavigate("home")}>Browse</NavLink>
              <NavLink onClick={() => onNavigate("swipe")}>🃏 Scout</NavLink>
              <NavLink onClick={() => onNavigate("about")}>About</NavLink>
              <button
                onClick={onOpenChat}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 16px", background: "#fff9c4", border: "none",
                  borderRadius: "20px", fontSize: "13px", fontWeight: "700",
                  cursor: "pointer", fontFamily: "'Inter', sans-serif",
                  color: "#1a1a1a", boxShadow: "2px 2px 0px #e8d84a",
                  transition: "all 0.15s ease", marginLeft: "4px",
                }}
              >
                ✨ Ask AI
              </button>
            </>
          )}
          {activeMode === "employer" && (
            <>
              <NavLink onClick={() => onNavigate("home")}>My Postings</NavLink>
              <NavLink onClick={() => onNavigate("createJob")}>+ New Job</NavLink>
              <NavLink onClick={() => onNavigate("about")}>About</NavLink>
            </>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {role && (
            <div style={{
              display: "flex", background: "#f5f5f5",
              borderRadius: "20px", padding: "3px", gap: "2px",
            }}>
              <ModeButton active={activeMode === "seeker"} onClick={() => onModeSwitch("seeker")}>
                🔍 Browse
              </ModeButton>
              <ModeButton active={activeMode === "employer"} onClick={() => onModeSwitch("employer")}>
                🏢 Hiring
              </ModeButton>
            </div>
          )}
          <span style={{
            fontSize: "13px", color: "#888", maxWidth: "160px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{email}</span>
          <button onClick={signOut} style={{
            fontSize: "13px", padding: "7px 16px", borderRadius: "8px",
            border: "1.5px solid #e0e0e0", background: "#fff", color: "#444",
            cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}>Sign out</button>
        </div>
      </nav>
    </>
  );
}

function NavLink({ onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f5f5f5" : "none", border: "none",
        cursor: "pointer", padding: "8px 16px", borderRadius: "8px",
        fontSize: "14px", fontWeight: "600",
        color: hovered ? "#1a1a1a" : "#555",
        fontFamily: "'Inter', sans-serif", transition: "all 0.15s ease",
      }}
    >{children}</button>
  );
}

function ModeButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "#1a1a1a" : "transparent",
      color: active ? "#fff" : "#666", border: "none",
      borderRadius: "16px", padding: "5px 14px", fontSize: "12px",
      fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', sans-serif",
      transition: "all 0.15s ease", whiteSpace: "nowrap",
    }}>{children}</button>
  );
}