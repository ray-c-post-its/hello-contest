// Storage layer — swappable for DynamoDB later
const KEYS = {
  jobs: "postits_jobs",
  applications: "postits_applications",
  userRoles: "postits_user_roles",
};

export const storage = {
  // Jobs
  getJobs() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.jobs) || "[]");
    } catch { return []; }
  },
  saveJob(job) {
    const jobs = this.getJobs();
    const existing = jobs.findIndex(j => j.id === job.id);
    if (existing >= 0) jobs[existing] = job;
    else jobs.push(job);
    localStorage.setItem(KEYS.jobs, JSON.stringify(jobs));
  },
  deleteJob(jobId) {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    localStorage.setItem(KEYS.jobs, JSON.stringify(jobs));
  },

  // Applications
  getApplications(jobId) {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.applications) || "{}");
      return jobId ? (all[jobId] || []) : all;
    } catch { return jobId ? [] : {}; }
  },
  saveApplication(jobId, application) {
    const all = this.getApplications();
    if (!all[jobId]) all[jobId] = [];
    all[jobId].push(application);
    localStorage.setItem(KEYS.applications, JSON.stringify(all));
  },

  // User roles
  getUserRole(email) {
    try {
      const roles = JSON.parse(localStorage.getItem(KEYS.userRoles) || "{}");
      return roles[email] || null;
    } catch { return null; }
  },
  saveUserRole(email, role) {
    const roles = JSON.parse(localStorage.getItem(KEYS.userRoles) || "{}");
    roles[email] = role;
    localStorage.setItem(KEYS.userRoles, JSON.stringify(roles));
  },
};