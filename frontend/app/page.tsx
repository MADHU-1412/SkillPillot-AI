"use client"

import { useState } from "react"
import {
  ResumeUpload,
  ScanAnimation,
  SkillGapDashboard,
  RoadmapTimeline,
  InterviewPrepPage,
  ChatWindow,
} from "@/components/skillpilot"
import { Button } from "@/components/ui/button"
import { ChevronLeft, FileText, BarChart3, Map, MessageSquare } from "lucide-react"
import { uploadResume, extractSkills, analyzeGap, generateRoadmap, generateQuestions } from "@/lib/api"

type AppView = "upload" | "scanning" | "dashboard" | "roadmap" | "interview"

export default function SkillPilotApp() {
  const [currentView, setCurrentView] = useState<AppView>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [role, setRole] = useState("")
  const [userSkills, setUserSkills] = useState<string[]>([])
  const [resumeText, setResumeText] = useState("")
  
  // Stored Data
  const [analysis, setAnalysis] = useState<any>(null)
  const [roadmap, setRoadmap] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])

  const handleAnalyzeStart = async (selectedFile: File | null, selectedRole: string, currentSkills: string[]) => {
    setRole(selectedRole)
    setUserSkills(currentSkills)
    setCurrentView("scanning")

    try {
      let text = ""
      let skills = currentSkills

      if (selectedFile) {
        setFile(selectedFile)
        const uploadRes = await uploadResume(selectedFile)
        text = uploadRes.resume_text
        setResumeText(text)
        
        if (skills.length === 0) {
           const extractRes = await extractSkills(text)
           skills = extractRes.skills
           setUserSkills(skills)
        }
      }

      const analysisRes = await analyzeGap(skills, selectedRole)
      setAnalysis(analysisRes)
    } catch (error) {
      console.error("Analysis Failed:", error)
      setCurrentView("upload")
    }
  }

  const handleScanComplete = () => {
    setCurrentView("dashboard")
  }

  const handleGenerateRoadmap = async () => {
    if (!analysis) return
    setCurrentView("scanning")
    try {
      const roadmapRes = await generateRoadmap(
        analysis.missing_skills.map((m: any) => m.skill),
        analysis.missing_skills.slice(0, 3).map((m: any) => m.skill),
        role,
        analysis.trending_skills
      )
      setRoadmap(roadmapRes.roadmap)
      setCurrentView("roadmap")
    } catch (error) {
      console.error("Roadmap Failed:", error)
      setCurrentView("dashboard")
    }
  }

  const handleStartInterview = async () => {
    if (!analysis) return
    setCurrentView("scanning")
    try {
      const questionsRes = await generateQuestions(
        role,
        analysis.missing_skills.map((m: any) => m.skill),
        analysis.missing_skills.slice(0, 3).map((m: any) => m.skill)
      )
      setQuestions(questionsRes.questions)
      setCurrentView("interview")
    } catch (error) {
      console.error("Interview Prep Failed:", error)
      setCurrentView("roadmap")
    }
  }

  const navItems = [
    { id: "upload", label: "Upload", icon: FileText },
    { id: "dashboard", label: "Analysis", icon: BarChart3 },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "interview", label: "Interview", icon: MessageSquare },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SP</span>
            </div>
            <span className="text-xl font-bold">SkillPilot</span>
          </div>

          {analysis && (
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id
                return (
                   <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentView(item.id as AppView)}
                    className={`gap-2 ${isActive ? "bg-secondary" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          )}

          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {(currentView === "roadmap" || currentView === "interview") && (
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("dashboard")} className="mb-6 gap-2">
            <ChevronLeft className="w-4 h-4" /> Back to Analysis
          </Button>
        )}

        {currentView === "upload" && (
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Discover Your Career <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Intelligence</span></h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Analyze your resume against 12,000+ job postings. Get personalized skill gap reports, learning roadmaps, and interview prep tailored to your target role.</p>
          </div>
        )}

        <div className="relative">
          {currentView === "upload" && (
            <ResumeUpload 
              onAnalyze={handleAnalyzeStart} 
              initialSkills={userSkills}
              onRoleSelect={setRole}
            />
          )}

          {currentView === "scanning" && <ScanAnimation onComplete={handleScanComplete} />}

          {currentView === "dashboard" && analysis && (
            <SkillGapDashboard 
              onGenerateRoadmap={handleGenerateRoadmap}
              matchScore={analysis.match_score}
              matchedSkills={analysis.matched_skills}
              priorityGaps={analysis.missing_skills.slice(0, 3)}
              otherGaps={analysis.missing_skills.slice(3).map((m: any) => m.skill)}
              targetRole={role}
              marketIntel={analysis.market_intel}
            />
          )}

          {currentView === "roadmap" && (
            <RoadmapTimeline roadmap={roadmap} onStartInterview={handleStartInterview} />
          )}

          {currentView === "interview" && (
            <InterviewPrepPage questions={questions} />
          )}
        </div>
      </main>

      {analysis && <ChatWindow />}
    </div>
  )
}
