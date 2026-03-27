'use client'

import { Button } from './ui/button'
import { CheckCircle2, XCircle, Sparkles, Play, ArrowRight } from 'lucide-react'

interface ResultsSectionProps {
  onStartInterview: () => void
  skills: string[]
  summary: string
  score: number
}

export function ResultsSection({ onStartInterview, skills, summary, score }: ResultsSectionProps) {
  // Simulated match data (since backend doesn't provide it yet)
  const matchedSkills = skills.length > 0 ? skills : ['Analyzing...']
  const missingSkills = ['AWS Lambda', 'GraphQL', 'Docker']

  return (
    <section id="results" className="py-24 bg-blue-50/50 rounded-[3rem] mx-6 border border-blue-100">
      <div className="container mx-auto px-6 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Interview Preparation</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Customized Session Ready
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Match Score */}
          <div className="glass-card p-10 flex flex-col items-center justify-center space-y-4 text-center bg-white shadow-xl shadow-blue-100/50">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-50" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - score / 100)} className="text-blue-600 transition-all duration-1000 ease-out" />
              </svg>
              <span className="absolute text-3xl font-black text-slate-900 tracking-tighter">{score}%</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Match Score</p>
          </div>

          {/* Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Professional Summary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {summary}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Matched Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <span key={skill} className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Ready for the next step?</h3>
            <p className="text-sm text-slate-500">Launch a tailored ELARA AI session based on your profile and the JD.</p>
          </div>
          
          <Button 
            size="lg" 
            onClick={onStartInterview}
            className="h-16 px-12 rounded-full text-lg font-bold shadow-2xl shadow-blue-200 relative group overflow-hidden w-full md:w-auto"
          >
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Play className="w-5 h-5 fill-current" />
              Start Voice Interview
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </Button>
        </div>
      </div>
    </section>
  )
}
