import React, { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { awsConfig } from "./aws-config";

import { storage } from "./utils/storage";
import RoleSelect from "./pages/RoleSelect";
import JobBoard from "./pages/JobBoard";
import JobDetail from "./pages/JobDetail";
import Apply from "./pages/Apply";
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateJob from "./pages/CreateJob";
import ApplicationsView from "./pages/ApplicationsView";

Amplify.configure(awsConfig);

// ─── Shared Navbar ──────────────────────────────────────────────────────────
function Navbar({ email, role, view, onBoardClick, signOut }) {
  return (
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
    }}>
      <button onClick={onBoardClick} style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontFamily: "'Caveat', cursive",
        fontSize: "26px",
        fontWeight: "700",
        color: "#1a1a1a",
      }}>
        <span style={{
          display: "inline-block",
          background: "#fff9c4",
          padding: "2px 8px 4px",
          borderRadius: "2px",
          transform: "rotate(-2deg)",
          boxShadow: "2px 2px 4px rgba(0,0,0,0.10)",
        }}>📌</span>
        Post-Its
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {role && (
          <span style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "20px",
            background: role === "employer" ? "#fff9c4" : "#cce5ff",
            color: "#444",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            {role === "employer" ? "Hiring" : "Job seeker"}
          </span>
        )}
        <span style={{ fontSize: "13px", color: "#888" }}>{email}</span>
        <button onClick={signOut} style={{
          fontSize: "13px",
          padding: "7px 16px",
          borderRadius: "8px",
          border: "1.5px solid #e0e0e0",
          background: "#fff",
          color: "#444",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
        }}>Sign out</button>
      </div>
    </nav>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
function PostItsApp({ user, signOut }) {
  const email = user?.signInDetails?.loginId || user?.attributes?.email || user?.username || "";

  const [role, setRole] = useState(null);
  const [view, setView] = useState("home"); // home | jobDetail | apply | createJob | applications
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState(null);

  useEffect(() => {
    const saved = storage.getUserRole(email);
    if (saved) setRole(saved);
  }, [email]);

  const handleRoleSelected = (r) => {
    setRole(r);
    setView("home");
  };

  const handleSelectJob = (job, index) => {
    setSelectedJob(job);
    setSelectedJobIndex(index);
    setView("jobDetail");
  };

  const handleViewApplications = (job) => {
    setViewingApplicationsFor(job);
    setView("applications");
  };

  const goHome = () => {
    setView("home");
    setSelectedJob(null);
    setViewingApplicationsFor(null);
  };

  if (!role) {
    return <RoleSelect email={email} onRoleSelected={handleRoleSelected} />;
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <Navbar
        email={email}
        role={role}
        view={view}
        onBoardClick={goHome}
        signOut={signOut}
      />

      {/* Seeker views */}
      {role === "seeker" && view === "home" && (
        <JobBoard onSelectJob={(job, i) => handleSelectJob(job, i)} />
      )}
      {role === "seeker" && view === "jobDetail" && selectedJob && (
        <JobDetail
          job={selectedJob}
          jobIndex={selectedJobIndex}
          onApply={() => setView("apply")}
          onBack={goHome}
        />
      )}
      {role === "seeker" && view === "apply" && selectedJob && (
        <Apply
          job={selectedJob}
          userEmail={email}
          onBack={() => setView("jobDetail")}
          onSubmitted={goHome}
        />
      )}

      {/* Employer views */}
      {role === "employer" && view === "home" && (
        <EmployerDashboard
          employerEmail={email}
          onCreateJob={() => setView("createJob")}
          onViewApplications={handleViewApplications}
        />
      )}
      {role === "employer" && view === "createJob" && (
        <CreateJob
          employerEmail={email}
          onSaved={goHome}
          onCancel={goHome}
        />
      )}
      {role === "employer" && view === "applications" && viewingApplicationsFor && (
        <ApplicationsView
          job={viewingApplicationsFor}
          onBack={goHome}
        />
      )}
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <PostItsApp user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}