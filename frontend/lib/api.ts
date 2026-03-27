const API_BASE = "http://localhost:8000";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload-resume`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function extractSkills(resumeText: string) {
  const res = await fetch(`${API_BASE}/api/extract-skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text: resumeText }),
  });
  return res.json();
}

export async function analyzeGap(userSkills: string[], targetRole: string) {
  const res = await fetch(`${API_BASE}/api/analyze-gap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_skills: userSkills, target_role: targetRole }),
  });
  return res.json();
}

export async function generateRoadmap(
  missingSkills: string[],
  prioritySkills: string[],
  targetRole: string,
  marketTrends: string[]
) {
  const res = await fetch(`${API_BASE}/api/generate-roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      missing_skills: missingSkills,
      priority_skills: prioritySkills,
      target_role: targetRole,
      market_trends: marketTrends,
    }),
  });
  return res.json();
}

export async function generateQuestions(
  targetRole: string,
  missingSkills: string[],
  prioritySkills: string[]
) {
  const res = await fetch(`${API_BASE}/api/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target_role: targetRole,
      missing_skills: missingSkills,
      priority_skills: prioritySkills,
    }),
  });
  return res.json();
}

export async function chatWithAI(message: string, history: any[]) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.map(h => ({ role: h.role === "ai" ? "assistant" : "user", content: h.content }))
    }),
  });
  return res.json();
}
