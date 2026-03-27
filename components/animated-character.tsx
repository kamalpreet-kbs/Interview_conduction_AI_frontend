'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedCharacterProps {
  isSpeaking: boolean
  isListening: boolean
}

export function AnimatedCharacter({ isSpeaking, isListening }: AnimatedCharacterProps) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-[60px] transition-all duration-1000 ${
          isSpeaking ? 'bg-primary/30 scale-110' : 
          isListening ? 'bg-accent/30 scale-105' : 
          'bg-blue-400/10 scale-100'
        }`} 
      />

      {/* Avatar Image */}
      <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-900">
        <motion.img 
          src="/ai-avatar.png"
          alt="Elara"
          className="w-full h-full object-cover"
          animate={{
            scale: isSpeaking ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Speaking/Listening Glow Overlays */}
      {isSpeaking && (
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 z-20 rounded-full bg-primary/20 pointer-events-none"
        />
      )}
      {isListening && (
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 z-20 rounded-full bg-accent/20 pointer-events-none"
        />
      )}
      
      {/* Listening Waves */}
      {isListening && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1">
          {[1,2,3].map(i => (
            <div key={i} className="w-1 h-3 bg-accent rounded-full animate-voice" style={{ animationDelay: `${i*0.2}s` }} />
          ))}
        </div>
      )}
    </div>
  )
}
