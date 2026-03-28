# MindBridge - Hybrid Community Mental Health System
## Hack for Health Equity 2026 - Young AI Leaders

**Team:** Dr Victoria Thomas, Dr Nameera Banu, Dr Chidinma Ndiagwalu, Wafa Nakhuda

---

## Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env.local
```
Edit `.env.local` and fill in:
- `VITE_GEMINI_API_KEY` - free at aistudio.google.com/app/apikey
- `MONGODB_URI` - free at cloud.mongodb.com
- `JWT_SECRET` - any long random string

### 3. Seed the database (10 sample records each)
```bash
npm run seed
```
Demo credentials after seeding:
- Patient: patient@mindbridge.demo / Demo1234!
- Clinic:  clinic@mindbridge.demo / Demo1234!
- Admin:   admin@mindbridge.demo / Demo1234!

### 4. Run frontend + backend together
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend API
npm run server:dev
```

---

## Deploy to Railway

### Environment variables to set in Railway:
```
VITE_GEMINI_API_KEY    = your_gemini_key
MONGODB_URI            = mongodb+srv://...
JWT_SECRET             = your_random_secret
VITE_API_URL           = https://your-railway-url.railway.app/api
VITE_APP_URL           = https://your-railway-url.railway.app
```

### After deploying, seed the database once:
```bash
railway run npm run seed
```

---

## Architecture

```
Frontend (React + Vite + Tailwind)
    |
    +-- src/api.ts          → REST API client
    +-- src/agents/gemini.ts → 5 AI agents (Gemini 2.0 Flash)
    +-- src/components/      → UI components

Backend (Express + MongoDB)
    |
    +-- server/index.ts     → Express app
    +-- server/models.ts    → Mongoose schemas (User, Screening, Appointment, Doctor)
    +-- server/routes/
        +-- auth.ts         → POST /login, /register, GET /me
        +-- screening.ts    → POST /screenings, GET /my, /stats
        +-- appointments.ts → GET /doctors, POST /book, PATCH /status
        +-- dashboard.ts    → GET /clinic, /admin (real MongoDB aggregations)
```

## AI Agents

1. **TriageAgent** - Personalised warm welcome, references user's exact words
2. **RiskAgent** - PHQ-2 + GAD-2 + NLP sentiment, returns 0-100 score
3. **TherapyAgent** - CBT micro-interventions (breathing, grounding, activation)
4. **CareNavigatorAgent** - Personalised next steps based on risk and context
5. **FollowUpAgent** - 7/30/90-day check-in question generation

## Key Features

- Real MongoDB database with JWT authentication
- 3 role portals: Patient / Clinic / Admin
- Crisis case: immediate doctor connection with auto-generated video call link
- 10 real doctors across 10 countries (seeded)
- 195-country emergency + mental health hotline directory
- Anonymous peer community with trigger word detection
- Clinical resources: PHQ-9, GAD-7, MDI, PCL-5, DSM-5 criteria
- ChatGPT history extraction for richer screening context
- Persistent session (localStorage)
