'use client'

import { FileText, Map, Rocket, Sparkles, Upload } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Upload Resume",
      desc: "Upload your resume in PDF format."
    },
    {
      icon: <Upload className="w-8 h-8 text-accent" />,
      title: "Add Job Description",
      desc: "Provide the JD you're targeting."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Customized Prep",
      desc: "AI prepares a customized interview for you."
    },
    {
      icon: <Rocket className="w-8 h-8 text-accent" />,
      title: "Start Interview",
      desc: "Begin your personalized voice session."
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-blue-50/50 rounded-[3rem] mx-6 border border-blue-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-slate-900">How it works</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Get ready for your dream job in four simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-20 h-20 rounded-3xl bg-white border border-blue-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-xl group-hover:bg-blue-600 transition-all duration-500">
                <div className="group-hover:text-white transition-colors">
                   {step.icon}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
