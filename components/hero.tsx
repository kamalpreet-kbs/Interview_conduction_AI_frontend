'use client'

import { Button } from './ui/button'
import { ArrowRight, PlayCircle } from 'lucide-react'

export function Hero() {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative pt-32 pb-20">
      <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          Next-Gen AI Resume Matching
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-normal text-slate-900 leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase px-4 text-center">
          ELARA <br /> <span className="bg-gradient-text italic pr-8 pb-4 inline-block">AI</span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Conduct a <span className="text-blue-600 font-bold underline decoration-blue-200 decoration-4 underline-offset-4">mock interview with AI</span> and practice for a personalized experience tailored specifically to your resume and job description.
        </p>

        <div className="relative w-full max-w-3xl mx-auto py-12 animate-in zoom-in duration-1000 delay-300">
           <img src="/tech.png" alt="AI Logic" className="w-full h-auto drop-shadow-[0_0_50px_rgba(88,80,236,0.5)] opacity-80" />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Button 
            size="lg" 
            onClick={scrollToUpload}
            className="h-16 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/40 group overflow-hidden"
          >
            Try Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
