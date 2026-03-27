'use client'

import { Github, Mail, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-20 border-t border-blue-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 max-w-sm text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-900">ELARA AI</span>
            </div>
            <p className="text-sm text-slate-500">
              The world's most advanced AI-powered resume analysis and interview rehearsal platform.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
              <a href="#" className="p-3 rounded-full bg-blue-50 border border-blue-100 text-slate-400 hover:text-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 rounded-full bg-blue-50 border border-blue-100 text-slate-400 hover:text-blue-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
              Check your preparation with ELARA AI
            </p>
          </div>
          
          <div className="text-center md:text-right space-y-4">
             <h4 className="font-bold text-slate-900 text-sm">Quick Links</h4>
             <ul className="space-y-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
               <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
             </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
