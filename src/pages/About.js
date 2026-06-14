import React from "react";

export default function About({ onBack }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        textAlign: "center",
        padding: "72px 40px 56px",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <div style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: "700",
          color: "#1a1a1a",
          lineHeight: 1.1,
          marginBottom: "20px",
        }}>
          Job searching is broken.<br />
          <span style={{
            background: "#fff9c4",
            padding: "0 8px",
            borderRadius: "2px",
            display: "inline-block",
            transform: "rotate(-1deg)",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.08)",
          }}>We're fixing it.</span>
        </div>
        <p style={{
          fontSize: "16px",
          color: "#777",
          maxWidth: "560px",
          margin: "0 auto",
          lineHeight: 1.7,
        }}>
          Post-Its is a recruitment platform built around a radical idea: that finding a job should feel as informed and personal as choosing a college.
        </p>
      </div>

      {/* Stats section */}
      <div style={{ background: "#1a1a1a", padding: "56px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "32px",
            fontWeight: "700",
            color: "#fff",
            textAlign: "center",
            marginBottom: "40px",
          }}>The numbers don't lie</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "24px",
          }}>
            {[
              { stat: "96%", label: "of LinkedIn applications receive no response", color: "#fff9c4", rot: "-1.5deg" },
              { stat: "36%", label: "of new hires leave within 90 days due to expectations mismatch", color: "#ffd1dc", rot: "1.8deg" },
              { stat: "43%", label: "of candidates say job ads don't give enough info", color: "#cce5ff", rot: "-1.2deg" },
              { stat: "80%", label: "of hiring managers have admitted to ghosting candidates", color: "#d4edda", rot: "2.1deg" },
              { stat: "53%", label: "of job seekers have been ghosted by employers", color: "#fff9c4", rot: "-1.7deg" },
              { stat: "61%", label: "have been ghosted after an in-person interview", color: "#ffd1dc", rot: "1.3deg" },
            ].map(({ stat, label, color, rot }) => (
              <div key={stat} style={{
                background: color,
                borderRadius: "3px",
                padding: "24px",
                boxShadow: "3px 3px 10px rgba(0,0,0,0.2)",
                transform: `rotate(${rot})`,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: "-8px", left: "50%",
                  transform: "translateX(-50%)", width: "14px", height: "14px",
                  borderRadius: "50%", background: "rgba(0,0,0,0.2)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }} />
                <div style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "48px",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}>{stat}</div>
                <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.5 }}>{label}</div>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: "12px",
            color: "#666",
            textAlign: "center",
            marginTop: "32px",
          }}>
            Sources: RecruitBPM 2026 · SelectSoftware Reviews 2026 · Higher Education Inquirer 2025
          </p>
        </div>
      </div>

      {/* Mission cards */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "72px 40px" }}>

        {/* Why we built this */}
        <div style={{
          background: "#fff9c4",
          borderRadius: "3px",
          padding: "40px",
          boxShadow: "4px 4px 16px rgba(0,0,0,0.1)",
          marginBottom: "32px",
          position: "relative",
          transform: "rotate(-0.8deg)",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "50%",
            transform: "translateX(-50%)", width: "20px", height: "20px",
            borderRadius: "50%", background: "rgba(0,0,0,0.2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "28px",
            fontWeight: "700", margin: "0 0 16px", color: "#1a1a1a",
          }}>Why we built this</h2>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.8, margin: 0 }}>
            When you apply to college, you tour campuses, meet faculty, visit dorms, and talk to current students — all before committing four years and $100,000+ of your life. A job demands the same commitment: 40+ hours a week, for years. So why do we accept a two-paragraph job description and a logo as enough information to make that decision? Post-Its changes that.
          </p>
        </div>

        {/* Our approach */}
        <div style={{
          background: "#cce5ff",
          borderRadius: "3px",
          padding: "40px",
          boxShadow: "4px 4px 16px rgba(0,0,0,0.1)",
          marginBottom: "32px",
          position: "relative",
          transform: "rotate(0.8deg)",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "50%",
            transform: "translateX(-50%)", width: "20px", height: "20px",
            borderRadius: "50%", background: "rgba(0,0,0,0.2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "28px",
            fontWeight: "700", margin: "0 0 16px", color: "#1a1a1a",
          }}>Our approach</h2>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.8, margin: 0 }}>
            Post-Its takes a "dating app for jobs" approach. Each job posting becomes a mini-website: photos of the work environment, team bios, culture previews, and honest salary information. Our AI matches candidates to roles based on values and fit — not just keywords. The result is fewer applications, better matches, and less ghosting for everyone.
          </p>
        </div>

        {/* AI assists, humans decide */}
        <div style={{
          background: "#ffd1dc",
          borderRadius: "3px",
          padding: "40px",
          boxShadow: "4px 4px 16px rgba(0,0,0,0.1)",
          marginBottom: "32px",
          position: "relative",
          transform: "rotate(-0.5deg)",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "50%",
            transform: "translateX(-50%)", width: "20px", height: "20px",
            borderRadius: "50%", background: "rgba(0,0,0,0.2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "28px",
            fontWeight: "700", margin: "0 0 16px", color: "#1a1a1a",
          }}>AI assists. Humans decide.</h2>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.8, margin: 0 }}>
            Post-Its uses AI to help job seekers find the right opportunities — but every application on this platform is read by a real person. No algorithmic screening. No automated rejections. No AI scoring candidates. We believe hiring is one of the most consequential decisions a company makes, and one of the most important moments in a person's career. Both deserve a human on the other side.
          </p>
        </div>

        {/* Built by */}
        <div style={{
          background: "#d4edda",
          borderRadius: "3px",
          padding: "40px",
          boxShadow: "4px 4px 16px rgba(0,0,0,0.1)",
          marginBottom: "32px",
          position: "relative",
          transform: "rotate(0.6deg)",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "50%",
            transform: "translateX(-50%)", width: "20px", height: "20px",
            borderRadius: "50%", background: "rgba(0,0,0,0.2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "28px",
            fontWeight: "700", margin: "0 0 16px", color: "#1a1a1a",
          }}>Built by</h2>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 1.8, margin: 0 }}>
            <strong>Corey Ray</strong> — Catholic University of America, AI Vibe Coding Competition 2026.
            Built with React, AWS Amplify, AWS Cognito, AWS Lambda, Claude AI (Anthropic), Fuse.js, and a lot of sticky notes. 📌
          </p>
        </div>

        {/* What's next */}
        <div style={{
          background: "#fff9c4",
          borderRadius: "3px",
          padding: "40px",
          boxShadow: "4px 4px 16px rgba(0,0,0,0.1)",
          position: "relative",
          transform: "rotate(-0.4deg)",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "50%",
            transform: "translateX(-50%)", width: "20px", height: "20px",
            borderRadius: "50%", background: "rgba(0,0,0,0.2)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }} />
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: "28px",
            fontWeight: "700", margin: "0 0 16px", color: "#1a1a1a",
          }}>What's next</h2>
          <ul style={{ fontSize: "15px", color: "#444", lineHeight: 2, margin: 0, paddingLeft: "20px" }}>
            <li>Real database with DynamoDB + AWS AppSync</li>
            <li>Employer verification by company email domain</li>
            <li>Resume parsing for better AI matching</li>
            <li>Video culture previews embedded in job pages</li>
            <li>Email notifications via AWS SES</li>
            <li>Mobile app</li>
          </ul>
        </div>
      </div>
    </div>
  );
}