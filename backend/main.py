from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

from modules.parser import extract_text_from_pdf
from modules.llm_service import extract_skills, generate_roadmap, generate_questions, chat_response
from modules.gap_analyzer import analyze_gap
from modules.rag_engine import retrieve_jd_insights
from modules.market_intelligence import get_market_intel

app = FastAPI(title="SkillPilot API")

# Simple session storage (In-memory)
sessions = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkillsRequest(BaseModel):
    resume_text: str

class GapRequest(BaseModel):
    user_skills: List[str]
    target_role: str

class RoadmapRequest(BaseModel):
    missing_skills: List[str]
    priority_skills: List[str]
    target_role: str
    market_trends: List[str] = []

class QuestionsRequest(BaseModel):
    target_role: str
    missing_skills: List[str]
    priority_skills: List[str] = []

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []



@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SkillPilot AI Intelligence Engine",
        "documentation": "/docs",
        "version": "1.0.0-winner"
    }


@app.post("/api/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text_from_pdf(content)
    return {"resume_text": text, "char_count": len(text)}


@app.post("/api/extract-skills")
async def extract_skills_route(req: SkillsRequest):
    skills = await extract_skills(req.resume_text)
    return {"skills": skills}


@app.post("/api/analyze-gap")
async def analyze_gap_route(req: GapRequest):
    insights = retrieve_jd_insights(req.target_role)
    market = get_market_intel(req.target_role)
    result = analyze_gap(req.user_skills, insights["required_skills"])
    return {**result, "market_intel": market, "trending_skills": insights["trending_skills"]}


@app.post("/api/generate-roadmap")
async def generate_roadmap_route(req: RoadmapRequest):
    roadmap = await generate_roadmap(
        req.missing_skills, req.priority_skills, req.target_role, req.market_trends
    )
    return {"roadmap": roadmap}


@app.post("/api/generate-questions")
async def generate_questions_route(req: QuestionsRequest):
    questions = await generate_questions(req.target_role, req.missing_skills, req.priority_skills)
    return {"questions": questions}


@app.post("/api/chat")
async def chat_route(req: ChatRequest):
    reply = await chat_response(req.message, req.history)
    return {"reply": reply}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
