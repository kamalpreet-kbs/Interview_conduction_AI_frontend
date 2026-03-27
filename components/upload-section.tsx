'use client'

import { Button } from './ui/button'
import { Label } from './ui/label'
import { FileText, Upload, ArrowRight, X } from 'lucide-react'

interface UploadSectionProps {
  resumeFile: File | null
  setResumeFile: (file: File | null) => void
  jdFile: File | null
  setJdFile: (file: File | null) => void
  onAnalyze: () => void
  isInitializing: boolean
}

export function UploadSection({
  resumeFile,
  setResumeFile,
  jdFile,
  setJdFile,
  onAnalyze,
  isInitializing
}: UploadSectionProps) {
  return (
    <section id="upload" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Upload documents</h2>
          <p className="text-slate-500 max-w-md mx-auto">Provide your documents for AI-powered analysis and interview conduction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Box */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Resume (PDF)</Label>
            <div className={`relative group h-64 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center ${
              resumeFile ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
            }`}>
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              
              {resumeFile ? (
                <div className="space-y-4 relative z-20">
                  <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-200">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{resumeFile.name}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors flex items-center gap-1 mx-auto"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto transition-transform group-hover:scale-110 duration-500">
                    <Upload className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Choose File</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">or drag & drop</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* JD Box */}
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Job Description (PDF)</Label>
            <div className={`relative group h-64 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-8 text-center ${
              jdFile ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'
            }`}>
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              />
              
              {jdFile ? (
                <div className="space-y-4 relative z-20">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-indigo-200">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{jdFile.name}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setJdFile(null); }}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-slate-900 transition-colors flex items-center gap-1 mx-auto"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto transition-transform group-hover:scale-110 duration-500">
                    <Upload className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Choose File</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">or drag & drop</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
           <Button 
            size="lg" 
            onClick={onAnalyze}
            disabled={isInitializing || !resumeFile || !jdFile}
            className="h-16 px-12 rounded-full text-lg font-bold shadow-2xl shadow-primary/20 relative group overflow-hidden w-full md:w-auto min-w-[300px]"
          >
            {isInitializing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing documents...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Start interview
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
