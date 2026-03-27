'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { FileText, Upload, Sparkles, ArrowRight } from 'lucide-react'

interface OnboardingProps {
  resumeFile: File | null
  setResumeFile: (file: File | null) => void
  jdFile: File | null
  setJdFile: (file: File | null) => void
  onStart: () => void
  isInitializing: boolean
}

export function Onboarding({
  resumeFile,
  setResumeFile,
  jdFile,
  setJdFile,
  onStart,
  isInitializing
}: OnboardingProps) {
  return (
    <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Hero Section */}
      <div className="space-y-8 animate-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          ELARA AI
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tight leading-[1.1] text-white">
            Land your <span className="text-primary italic">dream job</span> with AI precision.
          </h1>
          <p className="text-xl text-white/60 max-w-lg leading-relaxed">
            Practice with an advanced voice-first AI that analyzes your resume and the job description to provide the most realistic interview experience possible.
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-white/40">
            Trusted by <span className="text-white font-semibold">2,000+</span> candidates weekly
          </p>
        </div>
      </div>

      {/* Action Card */}
      <Card className="glass-card p-10 space-y-8 relative overflow-hidden">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Get Started</h2>
          <p className="text-white/40 text-sm">Upload your documents to initialize your personalized AI agent.</p>
        </div>

        <div className="space-y-6">
          {/* Resume Upload */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-white/50">Your Resume (PDF)</Label>
            <label className={`block cursor-pointer transition-all duration-300 ${resumeFile ? 'bg-primary/20 border-primary/40' : 'bg-white/5 hover:bg-white/10 border-white/10'} border-2 border-dashed rounded-2xl p-6 group`}>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${resumeFile ? 'bg-primary text-white' : 'bg-white/10 text-white/40 group-hover:text-white'} transition-colors`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {resumeFile ? resumeFile.name : 'Choose Resume'}
                  </p>
                  <p className="text-xs text-white/30">PDF format only, max 5MB</p>
                </div>
                {!resumeFile && <Upload className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />}
              </div>
            </label>
          </div>

          {/* JD Upload */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-widest text-white/50">Job Description (PDF)</Label>
            <label className={`block cursor-pointer transition-all duration-300 ${jdFile ? 'bg-accent/20 border-accent/40' : 'bg-white/5 hover:bg-white/10 border-white/10'} border-2 border-dashed rounded-2xl p-6 group`}>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              />
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${jdFile ? 'bg-accent text-white' : 'bg-white/10 text-white/40 group-hover:text-white'} transition-colors`}>
                  <Upload className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {jdFile ? jdFile.name : 'Choose Job Description'}
                  </p>
                  <p className="text-xs text-white/30">Copy/Paste or PDF upload</p>
                </div>
                {!jdFile && <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />}
              </div>
            </label>
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={onStart}
          disabled={isInitializing || !resumeFile || !jdFile}
          className="w-full h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 relative group overflow-hidden"
        >
          {isInitializing ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Initializing AI Session...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Start Your Interview
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </Card>
    </div>
  )
}
