'use client'

import { Sparkles } from 'lucide-react'

export function Navbar() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-blue-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">ELARA AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'How it Works'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollTo(item.toLowerCase().replace(/\s+/g, '-'))}
              className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {item}
            </button>
          ))}
          <Button 
            variant="outline" 
            className="border-blue-200 text-slate-900 hover:bg-blue-50 rounded-full px-6 font-bold"
            onClick={() => scrollTo('upload')}
          >
            Try Now
          </Button>
        </div>
      </div>
    </nav>
  )
}

import { Button } from './ui/button'
