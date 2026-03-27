'use client'

interface VoiceVisualizerProps {
  isListening: boolean
  isSpeaking: boolean
}

export function VoiceVisualizer({ isListening, isSpeaking }: VoiceVisualizerProps) {
  const bars = Array.from({ length: 40 }, (_, i) => i)

  return (
    <div className="flex items-center justify-center gap-[3px] h-16 w-full max-w-[300px]">
      {bars.map((i) => {
        // Create a wave pattern
        const delay = (i * 0.05).toFixed(2)
        const height = 20 + Math.sin(i * 0.5) * 15
        
        return (
          <div
            key={i}
            className={`w-[4px] rounded-full transition-all duration-500 ${
              isListening ? 'bg-accent' : 
              isSpeaking ? 'bg-primary' : 
              'bg-white/10'
            } ${ (isListening || isSpeaking) ? 'animate-voice' : ''}`}
            style={{
              height: (isListening || isSpeaking) ? '100%' : `${height}%`,
              animationDelay: `${delay}s`,
              opacity: (isListening || isSpeaking) ? 1 : 0.3
            }}
          />
        )
      })}
    </div>
  )
}
