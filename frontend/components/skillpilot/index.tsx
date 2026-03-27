"use client"

import { useState, useEffect, useRef } from "react"
import {
  Upload,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Send,
  Minus,
  TrendingUp,
  Clock,
  Building2,
  DollarSign,
  BarChart3,
  Check,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { chatWithAI } from "@/lib/api"

// ============== RESUME UPLOAD ==============
export function ResumeUpload({ 
  onAnalyze,
  onFileSelect,
  onRoleSelect,
  onSkillsChange,
  initialSkills = []
}: { 
  onAnalyze: (file: File | null, role: string, skills: string[]) => void,
  onFileSelect?: (file: File) => void,
  onRoleSelect?: (role: string) => void,
  onSkillsChange?: (skills: string[]) => void,
  initialSkills?: string[]
}) {
  const [file, setFile] = useState<File | null>(null)
  const [skills, setSkills] = useState<string[]>(initialSkills.length > 0 ? initialSkills : [])
  const [newSkill, setNewSkill] = useState("")
  const [role, setRole] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
      onFileSelect?.(droppedFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile)
      onFileSelect?.(selectedFile)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()]
      setSkills(updated)
      onSkillsChange?.(updated)
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove)
    setSkills(updated)
    onSkillsChange?.(updated)
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary hover:bg-primary/5"} ${file ? "border-green-500 bg-green-50" : ""}`}
      >
        <input type="file" accept=".pdf" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">PDF analyzed</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Drop your resume</h3>
            <p className="text-sm text-muted-foreground">PDF up to 5MB</p>
          </>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Extracting skills...</label>
        <div className="flex gap-2">
          <Input placeholder="Add a skill manually" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} className="flex-1" />
          <Button onClick={addSkill} variant="secondary">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} className="bg-primary text-primary-foreground px-3 py-1 text-sm gap-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1 hover:bg-primary-foreground/20 rounded-full"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Target role</label>
        <Select value={role} onValueChange={(r) => { setRole(r); onRoleSelect?.(r); }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ML Engineer">ML Engineer</SelectItem>
            <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
            <SelectItem value="Data Scientist">Data Scientist</SelectItem>
            <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
            <SelectItem value="AI Engineer">AI Engineer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={() => onAnalyze(file, role, skills)} className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90" disabled={!role}>
        Analyze My Skills <ChevronRight className="w-5 h-5 ml-1" />
      </Button>
    </div>
  )
}

// ============== SCAN ANIMATION ==============
const scanSteps = [
  "Scanning 12,487 job postings...",
  "Extracting market skill signals...",
  "Running semantic skill alignment...",
  "Calculating demand-weighted gap score...",
  "Generating intelligence report...",
]

export function ScanAnimation({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev))
    }, 700)
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2.5 : 100))
    }, 100)
    const completeTimeout = setTimeout(() => { onComplete?.() }, 4500)
    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8 py-12">
      <div className="relative w-16 h-16 mx-auto"><div className="absolute inset-0 rounded-full border-4 border-primary/20" /><div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>
      <div className="space-y-3 text-left">
        {scanSteps.map((step, index) => (
          <div key={index} className={`flex items-center gap-3 transition-opacity duration-300 ${index > currentStep ? "opacity-40" : ""}`}>
            {index < currentStep ? <Check className="w-4 h-4 text-green-600" /> : index === currentStep ? <ChevronRight className="w-4 h-4" /> : <div className="w-4 h-4" />}
            <span className={`text-sm ${index < currentStep ? "text-green-600" : index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
          </div>
        ))}
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  )
}

// ============== SKILL GAP DASHBOARD ==============
export function SkillGapDashboard({ 
  onGenerateRoadmap,
  matchScore,
  matchedSkills,
  priorityGaps,
  otherGaps,
  targetRole,
  marketIntel
}: { 
  onGenerateRoadmap: () => void,
  matchScore: number,
  matchedSkills: string[],
  priorityGaps: any[],
  otherGaps: string[],
  targetRole: string,
  marketIntel: any
}) {
  const skillChartData = [...matchedSkills.map(s => ({ skill: s, importance: 10 })), ...priorityGaps.map(g => ({ skill: g.skill, importance: g.importance }))].slice(0, 8)

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Your Skill Analysis</h2>
            <Badge className="bg-primary text-primary-foreground px-3 py-1">{Math.round(matchScore)}% Match</Badge>
          </div>
          <p className="text-sm text-muted-foreground -mt-4">Based on market data for {targetRole}</p>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" />Matched Skills</CardTitle></CardHeader>
            <CardContent><div className="flex flex-wrap gap-2">{matchedSkills.map(s => (<Badge key={s} variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1"><Check className="w-3 h-3 mr-1" />{s}</Badge>))}</div></CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" />Priority Gaps</CardTitle></CardHeader>
            <CardContent className="space-y-3">{priorityGaps.map(gap => (
              <div key={gap.skill} className="p-3 bg-secondary/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between"><span className="font-medium">{gap.skill}</span><Badge className={gap.priority === "CRITICAL" ? "bg-red-50 text-red-700 border-red-200" : "bg-orange-50 text-orange-700 border-orange-200"}>{gap.priority}</Badge></div>
                <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full ${gap.priority === "CRITICAL" ? "bg-red-500" : "bg-orange-500"}`} style={{ width: `${gap.importance * 10}%` }} /></div><span className="text-xs text-muted-foreground">Importance: {gap.importance}/10</span></div>
              </div>
            ))}</CardContent>
          </Card>

          {otherGaps.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Other Gaps</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-2">{otherGaps.map(s => (<Badge key={s} variant="secondary" className="px-3 py-1">{s}</Badge>))}</div></CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Top Required Skills</CardTitle></CardHeader>
            <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={skillChartData} layout="vertical" margin={{ top: 0, right: 20, left: 70, bottom: 0 }}><XAxis type="number" domain={[0, 10]} hide /><YAxis type="category" dataKey="skill" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} /><Bar dataKey="importance" radius={[0, 4, 4, 0]}>{skillChartData.map((e, i) => (<Cell key={`cell-${i}`} fill={e.importance >= 9 ? "#ef4444" : "#f97316"} />))}</Bar></BarChart></ResponsiveContainer></div></CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-xl">{targetRole}</CardTitle><p className="text-sm text-muted-foreground">Market Intelligence</p></div><Badge className="bg-green-50 text-green-700 border-green-200">{marketIntel.demand_score}/100 Demand</Badge></div></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary/50 rounded-lg"><DollarSign className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-semibold">{marketIntel.salary_range}</p><p className="text-xs text-muted-foreground">Avg Salary</p></div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg"><BarChart3 className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-semibold">{marketIntel.demand_score}</p><p className="text-xs text-muted-foreground">Demand Score</p></div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg"><TrendingUp className="w-5 h-5 mx-auto mb-1 text-muted-foreground" /><p className="text-lg font-semibold text-green-600">{marketIntel.growth}</p><p className="text-xs text-muted-foreground">YoY Growth</p></div>
            </div>
            <div className="space-y-3"><h4 className="text-sm font-medium">Trending Skills</h4><div className="flex flex-wrap gap-2">{marketIntel.trending_skills?.map((s: string) => (<Badge key={s} className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1"><TrendingUp className="w-3 h-3 mr-1" />{s}</Badge>))}</div></div>
            <div className="space-y-3"><h4 className="text-sm font-medium flex items-center gap-2"><Building2 className="w-4 h-4" />Top Companies</h4><div className="flex flex-wrap gap-2">{marketIntel.top_companies?.map((c: string) => (<Badge key={c} variant="outline" className="px-3 py-1">{c}</Badge>))}</div></div>
            <Button onClick={onGenerateRoadmap} className="w-full h-12 text-base font-semibold rounded-xl">Generate Roadmap <ChevronRight className="w-5 h-5 ml-1" /></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============== ROADMAP TIMELINE ==============
export function RoadmapTimeline({ roadmap, onStartInterview }: { roadmap: any[], onStartInterview: () => void }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8"><h2 className="text-2xl font-bold">Your Learning Roadmap</h2><p className="text-muted-foreground mt-1">AI-Powered Career Transformation</p></div>
      <div className="relative"><div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" /><div className="space-y-6">{roadmap.map((item, index) => (
        <div key={index} className="relative flex gap-6">
          <div className="relative z-10 flex-shrink-0"><div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">W{item.week}</div></div>
          <Card className="flex-1 hover:shadow-lg transition-shadow"><CardContent className="p-4">
            <div className="flex items-start justify-between mb-2"><h3 className="font-semibold">{item.topic}</h3><Badge className={item.priority === "critical" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"}>{item.priority.toUpperCase()}</Badge></div>
            <div className="text-sm text-primary flex items-center gap-1 mb-2">{item.resource} <ExternalLink className="w-3 h-3" /></div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> ~{item.hours} hrs</div>
          </CardContent></Card>
        </div>
      ))}</div></div>
      <div className="mt-8 text-center"><Button onClick={onStartInterview} className="h-12 px-8 text-base font-semibold rounded-xl">Start Interview Prep <ChevronRight className="w-5 h-5 ml-1" /></Button></div>
    </div>
  )
}

// ============== INTERVIEW PREP PAGE ==============
export function InterviewPrepPage({ questions }: { questions: any[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const toggle = (i: number) => { const n = new Set(revealed); n.has(i) ? n.delete(i) : n.add(i); setRevealed(n); }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center"><h2 className="text-2xl font-bold">Interview Prep</h2><p className="text-muted-foreground mt-1">Tailored for your specific gaps</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{questions.map((q, i) => (
        <Card key={i} className="hover:border-primary transition-colors cursor-pointer" onClick={() => toggle(i)}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between"><Badge className={q.difficulty === "hard" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"}>{q.difficulty}</Badge><Badge variant="secondary">{q.topic}</Badge></div>
            <p className="font-medium">{q.question}</p>
            {revealed.has(i) && <div className="bg-primary/5 rounded-lg p-3 text-sm text-muted-foreground">Focus on practical application and trade-offs. Be specific about your technical approach.</div>}
          </CardContent>
        </Card>
      ))}</div>
    </div>
  )
}

// ============== CHAT WINDOW ==============
export function ChatWindow() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, isTyping])

  const send = async (txt: string) => {
    if (!txt.trim()) return
    setMessages(p => [...p, { role: "user", content: txt }])
    setInput(""); setIsTyping(true)
    try {
      const res = await chatWithAI(txt, messages)
      setMessages(p => [...p, { role: "ai", content: res.reply }])
    } catch (e) {
      setMessages(p => [...p, { role: "ai", content: "I'm having trouble connecting right now. Try again in a second!" }])
    } finally { setIsTyping(false) }
  }

  if (!isExpanded) return <button onClick={() => setIsExpanded(true)} className="fixed bottom-6 right-6 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg z-50 animate-bounce"><Sparkles className="w-5 h-5" /><span className="font-medium">Ask Coach</span></button>

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-card border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between font-semibold"><div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> SkillPilot Coach</div><button onClick={() => setIsExpanded(false)}><Minus className="w-5 h-5" /></button></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (<div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary rounded-bl-sm"}`}>{m.content}</div></div>))}
        {isTyping && <Badge variant="secondary" className="animate-pulse">Coach is thinking...</Badge>}
        <div ref={endRef} />
      </div>
      <div className="p-4 border-t flex gap-2"><Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask anything..." /><Button onClick={() => send(input)} size="icon"><Send className="w-4 h-4" /></Button></div>
    </div>
  )
}
