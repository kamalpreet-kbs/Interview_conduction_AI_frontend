'use client'

import { Search, Zap, Cpu, Key } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: "Resume Parsing",
      desc: "Intelligent extraction of skills and experience from your PDFs."
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: "Fast Analysis",
      desc: "Get your matching results and feedback in milliseconds."
    },
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: "Smart Matching",
      desc: "Advanced AI algorithms to match your profile with job requirements."
    },
    {
      icon: <Key className="w-6 h-6 text-accent" />,
      title: "Keyword Detection",
      desc: "Identify missing keywords to optimize your resume for ATS."
    }
  ]

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-white">Advanced Features</h2>
          <p className="text-white/40 max-w-lg mx-auto">Powered by next-gen AI to give you a competitive edge.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-8 space-y-4 hover:translate-y-[-8px] transition-transform duration-500">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold text-white">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { FileText } from 'lucide-react'
