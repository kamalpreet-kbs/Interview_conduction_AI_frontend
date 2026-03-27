'use client'

import { useState, useEffect } from 'react'
import { useInterview } from '@/hooks/use-interview'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Footer } from '@/components/footer'
import { UploadSection } from '@/components/upload-section'
import { ResultsSection } from '@/components/results-section'
import { InterviewRoom } from '@/components/interview-room'
import { BackgroundAnimation } from '@/components/background-animation'
import { FeedbackBoard } from '@/components/feedback-board'

export default function LandingPage() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [analysisData, setAnalysisData] = useState<{ skills: string[], summary: string, score: number } | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const {
    status,
    aiQuestion,
    userTranscript,
    liveTranscript,
    isAudioPlaying,
    error,
    isInitializing,
    feedback,
    startInterview,
    stopInterview
  } = useInterview({ resumeFile, jdFile, initialThreadId: threadId || '' })


  const handleAnalyze = async () => {
    if (!resumeFile || !jdFile) return
    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('job_description', jdFile)

      const response = await fetch('http://localhost:8001/init', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to initialize interview')

      const result = await response.json()
      setThreadId(result.thread_id)
      setAnalysisData({
        skills: result.analysis.skills || [],
        summary: result.analysis.summary || '',
        score: 85 // Mock score for now until backend provides it
      })
      
      setShowResults(true)
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (err) {
      console.error(err)
      alert("Error analyzing documents. Please make sure the backend is running.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleStartInterview = () => {
    startInterview()
  }

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden font-sans selection:bg-primary/20 text-slate-900">
      
      <BackgroundAnimation />


      <Navbar />
      
      {status === 'idle' || (status === 'completed' && !feedback) ? (
        <div className="space-y-12 pb-20">
          <Hero />
          <HowItWorks />
          <UploadSection 
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            jdFile={jdFile}
            setJdFile={setJdFile}
            onAnalyze={handleAnalyze}
            isInitializing={isAnalyzing}
          />
          {error && status === 'idle' && (
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in fade-in slide-in-from-top-4">
                <div className="w-5 h-5 flex-shrink-0 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">!</span>
                </div>
                <div className="flex-1 font-bold uppercase tracking-wider text-[10px]">
                  {error}
                </div>
              </div>
            </div>
          )}
          {showResults && analysisData && (
            <ResultsSection 
              onStartInterview={handleStartInterview} 
              skills={analysisData.skills}
              summary={analysisData.summary}
              score={analysisData.score}
            />
          )}
          <Footer />
        </div>
      ) : status === 'completed' && feedback ? (
        <div className="pt-20 pb-32">
          <FeedbackBoard 
            feedback={feedback} 
            onRestart={() => {
              stopInterview()
              setShowResults(false)
              setAnalysisData(null)
              setThreadId(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full h-full py-12 flex items-center justify-center">
            <InterviewRoom 
              status={status}
              aiQuestion={aiQuestion}
              userTranscript={userTranscript}
              liveTranscript={liveTranscript}
              isAudioPlaying={isAudioPlaying}
              error={error}
              onStop={() => {
                stopInterview()
                setShowResults(false)
              }}
            />
          </div>
        </div>
      )}
    </main>
  )
}
