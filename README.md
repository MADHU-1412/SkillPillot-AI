# 🚀 SkillPilot AI — High-Impact Career Coaching

SkillPilot AI is a market-driven, AI-powered career coaching platform that analyzes resumes using Retrieval-Augmented Generation (RAG) and provides precise, actionable learning paths to help users get hired faster.

---

## 🔗 Website

👉 https://madhu-1412.github.io/SkillPillot-AI/

---

## 🎥 Demo Video

https://github.com/user-attachments/assets/0993cdc2-3d29-4dfe-aaa4-6aa44524f5a3

---

## ✨ Key Features

### 📄 Smart Resume Parsing

Extracts technical skills, experience, and role alignment from PDF resumes with high accuracy.

### 📊 Weighted Skill Gap Analysis

Identifies missing skills and ranks them based on real-time market demand and importance.

### 📈 Market Intelligence

Provides:

* Salary benchmarks
* Demand scores
* Trending skills for target roles

### 🧠 AI-Powered Learning Roadmaps

Generates structured 4-week learning plans focused on high-impact skills.

### 🎯 Tailored Interview Mock

Creates personalized interview questions targeting your exact skill gaps.

### 💬 Interactive AI Coach

Real-time conversational assistant for:

* Career strategy
* Skill planning
* Interview preparation

---

## 🧠 Tech Stack

### 🔧 Backend

* FastAPI
* PDFPlumber
* Anthropic Claude
* FAISS (Vector Search)
* Sentence Transformers

### 🎨 Frontend

* Next.js (App Router)
* Tailwind CSS v4
* Recharts
* Lucide React

---

## 🏗️ System Architecture (High-Level)

```
Resume Upload → Resume Parsing → Skill Extraction
        ↓
Vector DB (FAISS) + Embeddings
        ↓
RAG Pipeline (Claude)
        ↓
Skill Gap Analysis + Market Data
        ↓
Roadmap + Interview Questions + AI Chat
```

---

## ⚙️ Getting Started

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

```bash
source venv/bin/activate      # Mac/Linux
venv\Scripts\activate         # Windows
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file in `backend`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Run backend:

```bash
python main.py
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🚀 Deployment

### 🌐 Frontend

* GitHub Pages (current live demo)
* OR Vercel

### ⚙️ Backend

* Railway
* Render

> ⚠️ Set environment variable:

```
NEXT_PUBLIC_API_URL=your_backend_url
```

---

## 💡 Why This Project Stands Out

* Combines **RAG + real-world market intelligence**
* Focuses on **outcome-driven coaching (getting hired)**
* Uses **vector search + LLM reasoning**
* Designed as a **practical, production-ready system**
* Solves a **real problem for job seekers**

---

## 📌 Use Cases

* Students preparing for placements
* Job switchers targeting new roles
* Developers identifying skill gaps
* Anyone looking for structured career growth

---

## 🔮 Future Enhancements

* Resume auto-improvement suggestions
* ATS score optimization
* Company-specific interview prep
* Job matching engine
* Personalized learning tracking dashboard

---

## 👩‍💻 Author

**Madhu Priya**

* Built as part of hackathon + portfolio project
* Focused on AI-powered career acceleration

---

## ⭐ Support

If you found this useful, consider giving it a ⭐ on GitHub!

---
