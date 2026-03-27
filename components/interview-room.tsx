'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Square, Mic, Volume2, AlertCircle, Sparkles } from 'lucide-react'
import { VoiceVisualizer } from './voice-visualizer'

interface InterviewRoomProps {
  status: string
  aiQuestion: string
  userTranscript: string
  liveTranscript: string
  isAudioPlaying: boolean
  error: string
  onStop: () => void
}

import { AnimatedCharacter } from './animated-character'

export function InterviewRoom({
  status,
  aiQuestion,
  userTranscript,
  liveTranscript,
  isAudioPlaying,
  error,
  onStop
}: InterviewRoomProps) {
  return (
    <div className="w-full max-w-4xl space-y-8">
      
      {/* AI Interviewer Visualization */}
      <div className="relative flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          {/* Avatar Frame - Now with Animated Character */}
          <div className="w-64 h-64 rounded-full transition-colors duration-500 overflow-hidden flex items-center justify-center">
             <AnimatedCharacter isSpeaking={isAudioPlaying} isListening={status === 'listening'} />
          </div>
          
          {/* Status Badge */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass border border-white/20 flex items-center gap-2 shadow-xl whitespace-nowrap">
            <div className={`w-2 h-2 rounded-full ${
              status === 'listening' ? 'bg-accent animate-pulse' : 
              isAudioPlaying ? 'bg-primary animate-bounce' : 'bg-white/20'
            }`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {status === 'listening' ? 'Listening' : 
               isAudioPlaying ? 'Speaking' : 
               status === 'processing' ? 'Processing' : 'Standby'}
            </span>
          </div>
        </div>

        <VoiceVisualizer isListening={status === 'listening'} isSpeaking={isAudioPlaying} />
      </div>

      <Card className="glass-card overflow-hidden transition-all duration-500">
        <div className="p-8 space-y-8">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Interaction Area */}
          <div className="min-h-[200px] flex flex-col justify-center space-y-8">
            {aiQuestion && (
              <div className="space-y-3 animate-in fade-in slide-in-from-left duration-500">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black">
                  <Sparkles className="w-3 h-3" />
                  AI Interviewer
                </div>
                <p className="text-2xl font-medium leading-relaxed text-black text-pretty">
                  "{aiQuestion}"
                </p>
              </div>
            )}

            {(liveTranscript || userTranscript) && (
              <div className="space-y-3 animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-black">
                  <Mic className="w-3 h-3" />
                  Your Response
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className={`text-lg leading-relaxed ${liveTranscript ? 'text-black italic' : 'text-black/80'}`}>
                    {liveTranscript || userTranscript}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Control Bar */}
        <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
               <Volume2 className="w-3 h-3" />
               Audio Enhanced
             </div>
          </div>
          <Button 
            variant="destructive"
            onClick={onStop}
            className="rounded-xl px-6 font-bold uppercase tracking-wider text-xs h-10 shadow-lg shadow-destructive/20"
          >
            <Square className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </div>
      </Card>
    </div>
  )
}
