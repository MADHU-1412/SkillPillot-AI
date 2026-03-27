# SkillPilot AI — High-Impact Career Coaching

SkillPilot AI is a professional, market-driven career coaching platform that uses RAG-driven intelligence to analyze your resume and tell you exactly what to learn to get hired.

## Features
- **Smart Resume Parsing**: Extracts technical skills and experience from PDF resumes.
- **Weighted Skill Gap Analysis**: Prioritizes gaps based on real-time market importance scores.
- **Market Intelligence**: Provides salary benchmarks, demand scores, and trending skills for target roles.
- **AI-Powered Roadmaps**: Generates 4-week accelerated learning paths front-loaded with critical gaps.
- **Tailored Interview Mock**: Creates realistic interview questions targeting your specific gaps.
- **Interactive AI Coach**: Streaming chat for personalized career advice.

## Tech Stack
- **Backend**: FastAPI, PDFPlumber, Anthropic Claude, FAISS, Sentence Transformers.
- **Frontend**: Next.js (App Router), Tailwind CSS v4, Recharts, Lucide React.

## Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Run the backend:
```bash
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
- **Backend**: Deploy to Railway or Render (use `Procfile` provided in backend if needed).
- **Frontend**: Deploy to Vercel (set `NEXT_PUBLIC_API_URL` to your backend URL).
