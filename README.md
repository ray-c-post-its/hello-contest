# 📌 Post-Its — Find Your Next Role, the Human Way

**Live URL:** https://main.d2t96z6nefmwc8.amplifyapp.com  
**GitHub:** https://github.com/ray-c-post-its/hello-contest  
**Built by:** Corey Ray — Catholic University of America, AI Vibe Coding Competition 2026

---

## The Problem

Job searching is broken. 96% of LinkedIn applications receive no response. 36% of new hires leave within 90 days due to an expectations mismatch. 43% of candidates say job ads don't give them enough information to make a good decision. 80% of hiring managers have admitted to ghosting candidates. Traditional job boards treat both candidates and employers as commodities — matching on keywords instead of fit, values, and culture.

When you apply to college, you tour campuses, meet faculty, visit dorms, and talk to current students — all before committing four years and $100,000+ of your life. A job demands the same commitment: 40+ hours a week, for years. Post-Its changes that.

---

## The Solution

Post-Its is an AI-powered recruitment platform that takes a "dating app for jobs" approach. Each job posting becomes a mini-website with work environment descriptions, team bios, culture previews, and transparent salary information. Our AI matches candidates to roles based on values and fit — not just keywords — so both sides spend less time and get better results.

---

## Our Philosophy: AI Assists, Humans Decide

Post-Its uses AI to help job seekers find the right opportunities — but we believe the hiring decision itself should always be made by a human. Employers on Post-Its read every application personally. There is no algorithmic screening, no automated rejection, and no AI scoring candidates. 

We use AI to reduce noise and surface better matches, so that when a recruiter does sit down to read an application, it's worth their time. The final call — always — belongs to a person.

This matters because hiring is one of the most consequential decisions a company makes, and one of the most important moments in a person's career. We think both deserve more than an algorithm.

---

## Live Features

### For Job Seekers
- **Natural language search** — describe what you want in plain English, Claude AI matches and ranks results semantically
- **Scout mode** — swipe right to save jobs, left to pass, just like a dating app. Keyboard arrow keys supported
- **AI chat assistant** — full conversation with job recommendations shown inline as post-it cards; strictly constrained to job search topics only
- **Bookmark & hide** — save interesting jobs, hide ones you're not interested in, restore hidden jobs anytime
- **Personalized applications** — Claude generates 3 role-specific interview questions per job on the fly
- **Rich job detail pages** — work environment, team culture, meet the team, salary, requirements, and skills

### For Employers
- **Post jobs** — title, description, salary, location, work type, requirements, skills tags
- **Culture fields** — work environment description, team culture narrative, team bios
- **View applicants** — see every application with AI-generated question answers, resume, LinkedIn, and contact info
- **Mode toggle** — switch between browsing and hiring without a separate account

---

## Screenshots

https://cdn.corenexis.com/f/D4JpXkn5zN6.png


## The Numbers Behind Post-Its

| Stat | Source |
|---|---|
| 96% of LinkedIn applications receive no response | Higher Education Inquirer, 2025 |
| 80% of hiring managers have admitted to ghosting | RecruitBPM, 2026 |
| 53% of job seekers have been ghosted by employers | RecruitBPM, 2026 |
| 61% have been ghosted after an in-person interview | RecruitBPM, 2026 |
| 43% say job ads don't give enough info to decide | RecruitBPM, 2026 |
| 36% of new hires leave within 90 days | RecruitBPM, 2026 |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Authentication | AWS Cognito + Amplify Authenticator |
| Hosting | AWS Amplify (auto-deploys on git push) |
| AI | Anthropic Claude API (claude-haiku-4-5-20251001) |
| AI Proxy | AWS Lambda (keeps API key server-side) |
| Search | Fuse.js (client-side pre-filter) + Claude semantic ranking |
| Prompt Caching | Anthropic beta prompt caching |
| Data | localStorage with 100 seeded East Coast jobs |

---

## Architecture
React App (AWS Amplify)

↓

AWS Lambda Proxy (postits-ai-proxy)

↓

Anthropic Claude API

The Lambda proxy keeps the Anthropic API key secure on the server. The React app never sees the key. CORS is configured at the Function URL level.

### Two-stage AI search
1. **Fuse.js** instantly pre-filters all jobs in the browser in milliseconds (scales to thousands of jobs)
2. **Claude** semantically ranks the top 25 candidates by relevance to the user's natural language query

---

## AI Features

- **Semantic job search** — natural language queries matched and ranked against job listings
- **AI chat assistant** — full conversation with job recommendations shown as post-it cards; strictly constrained to job search only; refuses off-topic questions
- **Personalized interview questions** — 3 role-specific questions generated per application by Claude
- **Prompt caching** — reduces API costs ~90% on repeated searches via `anthropic-beta: prompt-caching-2024-07-31` header

---

## Key Technical Decisions

- **React + AWS Amplify over Laravel** — faster iteration, seamless Cognito integration, better fit for a single-page AI-powered application
- **AWS Lambda proxy** — Anthropic API key stored server-side; swap the Lambda URL to point at any backend without touching the React code
- **Fuse.js + Claude two-stage search** — Fuse handles instant pre-filtering at scale; Claude handles semantic understanding and ranking
- **Prompt caching** — system prompt with job listings cached for 5 minutes, dramatically reducing latency and cost on repeated searches
- **localStorage** — intentional choice for the contest; production version would use DynamoDB + AWS AppSync

---

## Environment Variables

### Local development
Create a `.env` file in the project root:
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key

Then in `src/pages/JobBoard.js` and `src/pages/Apply.js`, replace the Lambda URL with a direct Anthropic call and add the `anthropic-dangerous-direct-browser-access: true` header.

### Production (AWS Amplify + Lambda)
The Anthropic API key is stored in AWS Lambda environment variables:
- Key: `ANTHROPIC_API_KEY`
- Never committed to the repository
- CORS restricted to the Amplify domain only

---

## Running Locally

```bash
git clone https://github.com/ray-c-post-its/hello-contest
cd hello-contest
npm install
npm start
```

Open http://localhost:3000

Note: AI features require either the Lambda proxy or a direct Anthropic API key in your `.env`.

---

## Project Structure
src/

├── components/

│   ├── Navbar.js            # Navigation, mode toggle, Ask AI button

│   ├── Footer.js            # Site footer

│   ├── PostItCard.js        # Reusable post-it card with bookmark/hide actions

│   └── AIChat.js            # Constrained AI chat assistant with inline job cards

├── pages/

│   ├── RoleSelect.js        # First-time role picker (seeker vs employer)

│   ├── JobBoard.js          # Main corkboard with AI search and filters

│   ├── JobDetail.js         # Full job page with culture, environment, team sections

│   ├── Apply.js             # AI-powered application with personalized interview questions

│   ├── SwipeJobs.js         # Tinder-style job scouting with keyboard support

│   ├── About.js             # Mission, research stats, and story

│   ├── EmployerDashboard.js # Employer's posting manager with applicant counts

│   ├── CreateJob.js         # Job creation with culture and environment fields

│   └── ApplicationsView.js  # Employer view of all applicants per job

└── utils/

└── storage.js           # localStorage layer with 100 seed jobs

---

## Seed Data

The app ships with 100 realistic job postings across the East Coast:
- ~65 DMV area jobs (Washington DC, Northern Virginia, Maryland suburbs)
- ~10 fully remote positions
- ~25 spread across NYC, Boston, Philadelphia, Atlanta, Charlotte, Miami, and Connecticut

Jobs span a wide range of industries, salary ranges ($50k–$225k), and work types (Remote / Hybrid / On-site).

---

## Security

- Anthropic API key stored in AWS Lambda environment variables — never in client code or repository
- AWS Cognito handles authentication with hashed passwords and secure token-based sessions
- Lambda CORS restricted to the Amplify domain only (`https://main.d2t96z6nefmwc8.amplifyapp.com`)
- No secrets in repository history
- MIT License

---

## What's Next (Production Roadmap)

- **DynamoDB + AWS AppSync** — replace localStorage with a real persistent database
- **AWS OpenSearch** — production-scale search across thousands of jobs
- **Employer verification** — verify company email domains before allowing job posts
- **Resume parsing** — extract skills from uploaded resumes for better AI matching
- **Email notifications** — notify applicants and employers via AWS SES
- **Job image gallery** — multiple workplace photos per posting
- **Video previews** — short culture videos embedded in job detail pages

---

## References

- RecruitBPM — Candidate Experience Statistics Every Recruiter Must Know in 2026
- SelectSoftware Reviews — 100+ Recruitment Statistics Every HR Should Know in 2026
- Higher Education Inquirer — Screen Time 2025
- MeeBoss — Pioneers First Chat-Based Hiring Platform
- SF Federal Reserve — Slow Job Growth in a Strong Economy

---

## License

MIT License — see [LICENSE](LICENSE) file
