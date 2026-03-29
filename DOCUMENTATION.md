# SkillPilot AI — Documentation & User Guide

Welcome to **SkillPilot AI**, the high-impact career intelligence platform designed to bridge the gap between your current skills and your dream job.

## 🚀 Quick Start
SkillPilot analysis is driven by real-time market data. To get the best results, follow these steps:

1.  **Upload Resume**: Drag and drop your professional resume.
    *   **Accepted File Type**: PDF only (`.pdf`)
    *   **Max File Size**: 5MB
2.  **Select Target Role**: Choose from market-validated roles like ML Engineer, Full Stack Developer, etc.
3.  **Analyze**: Let the AI scan 12,000+ job postings to find your specific gaps.

---

## 🛠️ Core Features

### 1. Smart Resume Parsing
Our backend uses `PDFPlumber` and LLM-powered semantic extraction to identify not just keywords, but the **depth** of your experience.

### 2. Weighted Skill Gap Analysis
We don't just list what's missing. We prioritize gaps based on **Market Importance Scores (1-10)**. 
*   **Critical**: Skills required by >80% of current job postings.
*   **High/Medium**: Skills that provide a competitive edge.

### 3. AI-Powered Roadmaps
Generates a custom 4-week learning path.
*   **Resources**: Direct links to documentation, tutorials, and platforms like Kaggle or PyTorch.
*   **Project Ideas**: Every week includes a "Hands-on Project" to prove your new skills.
*   **Progress Tracking**: Mark weeks as done to see your Career Readiness score grow.

### 4. Tailored Interview Prep
Generates 6 realistic interview questions (Easy, Medium, Hard) specifically targeting the gaps identified in your analysis.

### 5. SkillPilot Coach
A streaming AI career coach available 24/7 to answer questions like:
*   "How do I justify my salary expectations for this role?"
*   "What are the best open-source projects to contribute to?"

---

## 💻 Technical Specifications

### Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Recharts, Lucide React.
- **Backend**: FastAPI (Python), Groq (Llama 3.3 70B), PDFPlumber, FAISS (Vector Store).
- **Inference**: Ultra-fast inference via Groq Cloud.

### API Endpoints
- `POST /api/upload-resume`: Extracts text from PDF.
- `POST /api/extract-skills`: Semantically identifies technical skills.
- `POST /api/analyze-gap`: Compares user skills against market RAG data.
- `POST /api/generate-roadmap`: Creates the 4-week learning path.
- `POST /api/chat`: Connects to the Career Coach.

---

## 🌐 Deployment Logic

### Backend (Standard)
Deploy via Railway or Render using the included `Procfile`.
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Required Env**: `GROQ_API_KEY`, `ANTHROPIC_API_KEY`.

### Frontend (Static/Hydrated)
Deploy via Vercel.
- **Root Directory**: `frontend`
- **Build Command**: `next build`
- **Required Env**: `NEXT_PUBLIC_API_URL` (Point to your live backend).

---
*Created with ❤️ by the SkillPilot AI Team.*
