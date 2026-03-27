'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, TrendingUp, Award, RefreshCw, LogOut } from 'lucide-react'

interface FeedbackBoardProps {
  feedback: {
    score: number
    summary: string
    strengths: string[]
    weaknesses: string[]
    detailed_feedback: string
  }
  onRestart: () => void
}

export function FeedbackBoard({ feedback, onRestart }: FeedbackBoardProps) {
  if (!feedback) return null

  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-in fade-in duration-1000">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Award className="w-4 h-4" />
            Interview Summary Report
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Performance <span className="text-primary tracking-normal">Analysis</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Based on your responses during the technical assessment, here is your comprehensive feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Score Card */}
          <Card className="lg:col-span-4 p-8 glass-card bg-gradient-to-br from-white to-blue-50/50 border-blue-100 flex flex-col items-center justify-center space-y-6">
             <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-blue-50" />
                <circle 
                  cx="96" 
                  cy="96" 
                  r="88" 
                  stroke="currentColor" 
                  strokeWidth="16" 
                  fill="transparent" 
                  strokeDasharray={552.9} 
                  strokeDashoffset={552.9 * (1 - feedback.score / 100)} 
                  className="text-primary transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{feedback.score}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Score</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-black text-slate-900 uppercase text-sm tracking-widest">Ranking Status</h3>
              <p className="text-xs font-bold text-slate-500 uppercase">
                {feedback.score >= 80 ? 'Exceptional Candidate' : feedback.score >= 60 ? 'Strong Potential' : 'Needs Development'}
              </p>
            </div>
          </Card>

          {/* Detailed Feedback */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="p-8 glass-card space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Executive Summary
                </h3>
                <p className="text-lg font-bold text-slate-800 leading-tight">
                  {feedback.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Growth Areas
                  </h4>
                  <ul className="space-y-2">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8 glass-card bg-slate-900 border-none">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Detailed Evaluation</h3>
              <p className="text-sm text-white/80 leading-relaxed font-medium italic">
                "{feedback.detailed_feedback}"
              </p>
            </Card>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            onClick={onRestart}
            variant="outline"
            className="h-12 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-slate-200 hover:bg-slate-50 gap-2 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            New Assessment
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            className="h-12 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 gap-2 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            Exit Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
