import React, { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { awsConfig } from "./aws-config";

import { storage } from "./utils/storage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChat from "./components/AIChat";
import RoleSelect from "./pages/RoleSelect";
import JobBoard from "./pages/JobBoard";
import JobDetail from "./pages/JobDetail";
import Apply from "./pages/Apply";
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateJob from "./pages/CreateJob";
import ApplicationsView from "./pages/ApplicationsView";

Amplify.configure(awsConfig);

function PostItsApp({ user, signOut }) {
  const email = user?.signInDetails?.loginId || user?.attributes?.email || user?.username || "";

  const [role, setRole] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const [view, setView] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const saved = storage.getUserRole(email);
    if (saved) {
      setRole(saved);
      setActiveMode(saved);
    }
    setAllJobs(storage.getJobs());
  }, [email]);

  const handleRoleSelected = (r) => {
    setRole(r);
    setActiveMode(r);
    setView("home");
  };

  const handleModeSwitch = (mode) => {
    setActiveMode(mode);
    setView("home");
    setSelectedJob(null);
    setViewingApplicationsFor(null);
    setChatOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSelectJob = (job, index) => {
    setSelectedJob(job);
    setSelectedJobIndex(index);
    setView("jobDetail");
    setChatOpen(false);
  };

  const handleNavigate = (dest) => {
    setView(dest);
    setSelectedJob(null);
    setViewingApplicationsFor(null);
    window.scrollTo(0, 0);
  };

  const goHome = () => handleNavigate("home");

  if (!role) {
    return <RoleSelect email={email} onRoleSelected={handleRoleSelected} />;
  }

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <Navbar
        email={email}
        role={role}
        activeMode={activeMode}
        onModeSwitch={handleModeSwitch}
        onNavigate={handleNavigate}
        onOpenChat={() => setChatOpen(true)}
        signOut={signOut}
      />

      {/* AI Chat overlay */}
      <AIChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        jobs={allJobs}
        onSelectJob={handleSelectJob}
        userEmail={email}
      />

      <div style={{ flex: 1 }}>
        {/* Seeker views */}
        {activeMode === "seeker" && view === "home" && (
          <JobBoard
            onSelectJob={handleSelectJob}
            userEmail={email}
          />
        )}
        {activeMode === "seeker" && view === "jobDetail" && selectedJob && (
          <JobDetail
            job={selectedJob}
            jobIndex={selectedJobIndex}
            onApply={() => setView("apply")}
            onBack={goHome}
          />
        )}
        {activeMode === "seeker" && view === "apply" && selectedJob && (
          <Apply
            job={selectedJob}
            userEmail={email}
            onBack={() => setView("jobDetail")}
            onSubmitted={goHome}
          />
        )}

        {/* Employer views */}
        {activeMode === "employer" && view === "home" && (
          <EmployerDashboard
            employerEmail={email}
            onCreateJob={() => handleNavigate("createJob")}
            onViewApplications={(job) => {
              setViewingApplicationsFor(job);
              setView("applications");
            }}
          />
        )}
        {activeMode === "employer" && view === "createJob" && (
          <CreateJob
            employerEmail={email}
            onSaved={goHome}
            onCancel={goHome}
          />
        )}
        {activeMode === "employer" && view === "applications" && viewingApplicationsFor && (
          <ApplicationsView
            job={viewingApplicationsFor}
            onBack={goHome}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <PostItsApp user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}