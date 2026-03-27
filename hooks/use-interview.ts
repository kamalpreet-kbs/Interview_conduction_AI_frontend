'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export type InterviewStatus = 'idle' | 'active' | 'listening' | 'processing' | 'completed'

interface UseInterviewProps {
  resumeFile: File | null
  jdFile: File | null
  backendUrl?: string
  initialThreadId?: string
}

export function useInterview({ resumeFile, jdFile, backendUrl = 'http://localhost:8001', initialThreadId = '' }: UseInterviewProps) {
  const [status, setStatus] = useState<InterviewStatus>('idle')
  const [threadId, setThreadId] = useState<string>(initialThreadId)

  // Sync internal threadId with prop
  useEffect(() => {
    if (initialThreadId) {
      setThreadId(initialThreadId)
    }
  }, [initialThreadId])
  const [aiQuestion, setAiQuestion] = useState<string>('')
  const [userTranscript, setUserTranscript] = useState<string>('')
  const [liveTranscript, setLiveTranscript] = useState<string>('')
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [error, setError] = useState<string>('')
  const [isInitializing, setIsInitializing] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [browserSupported, setBrowserSupported] = useState<boolean>(true)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isInterviewActiveRef = useRef(false)
  const micStreamRef = useRef<MediaStream | null>(null)
  const isProcessingRef = useRef(false)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastTranscriptRef = useRef<string>('')

  // Initialize Audio Element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Check Browser Support
  useEffect(() => {
    const checkBrowserSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Microphone access is not supported in this browser.')
        setBrowserSupported(false)
        setMicPermission('denied')
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser.')
        setBrowserSupported(false)
        return
      }

      setBrowserSupported(true)
    }

    checkBrowserSupport()
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isAudioPlaying && !isProcessingRef.current) {
      setStatus('listening')
      setError('')
      try {
        recognitionRef.current.start()
      } catch (err) {
        if (!(err as Error).message?.includes('already started')) {
          console.error('Error starting recognition:', err)
        }
      }
    }
  }, [isAudioPlaying])

  const playAudio = useCallback(async (base64Audio: string) => {
    try {
      setIsAudioPlaying(true)
      const binaryString = atob(base64Audio)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)

      if (!audioRef.current) return

      audioRef.current.src = url
      audioRef.current.onended = () => {
        URL.revokeObjectURL(url)
        setIsAudioPlaying(false)
        isProcessingRef.current = false
        lastTranscriptRef.current = ''
        setUserTranscript('')
        setLiveTranscript('')
        if (isInterviewActiveRef.current) {
          setTimeout(startListening, 400)
        }
      }

      await audioRef.current.play()
      
      // Return a promise that resolves when audio ends
      return new Promise<void>((resolve) => {
        const checkEnded = () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener('ended', checkEnded)
          }
          resolve()
        }
        if (audioRef.current) {
          audioRef.current.addEventListener('ended', checkEnded)
        }
      })
    } catch (err) {
      console.error(err)
      setIsAudioPlaying(false)
      isProcessingRef.current = false
    }
  }, [startListening])

  const sendToBackend = useCallback(async (text: string, currentThreadId: string) => {
    if (isProcessingRef.current) return
    
    isProcessingRef.current = true
    setStatus('processing')
    stopListening()
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    try {
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
        },
        body: JSON.stringify({
          text,
          thread_id: currentThreadId,
        }),
      })

      if (!response.ok) throw new Error('Backend API error')

      const data = await response.json()
      setAiQuestion(data.ai_text)
      
      if (data.interview_complete) {
        isInterviewActiveRef.current = false
        if (data.audio_base64) {
          await playAudio(data.audio_base64)
        }
        setStatus('completed')
        setFeedback(data.evaluation)
        isProcessingRef.current = false
        return
      }
      
      // Fallback text check (legacy)
      if (data.ai_text.toLowerCase().includes('interview completed') || 
          data.ai_text.toLowerCase().includes('thank you for your time')) {
        isInterviewActiveRef.current = false
        if (data.audio_base64) {
          await playAudio(data.audio_base64)
        }
        setStatus('completed')
        isProcessingRef.current = false
        return
      }
      
      setStatus('active')
      if (data.audio_base64) {
        await playAudio(data.audio_base64)
      } else {
        isProcessingRef.current = false
        if (isInterviewActiveRef.current) {
          setTimeout(() => startListening(), 500)
        }
      }
    } catch (err) {
      console.error('Backend error:', err)
      setError('Communication failed. Check API connection.')
      setStatus('idle')
      isInterviewActiveRef.current = false
      isProcessingRef.current = false
    }
  }, [backendUrl, playAudio, startListening, stopListening])

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        
        recognition.onresult = (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) finalTranscript += transcript
            else interimTranscript += transcript
          }
          
          if (interimTranscript) setLiveTranscript(interimTranscript)
          
          if (finalTranscript && isInterviewActiveRef.current) {
            const fullTranscript = (lastTranscriptRef.current + ' ' + finalTranscript).trim()
            lastTranscriptRef.current = fullTranscript
            setUserTranscript(fullTranscript)
            setLiveTranscript('')
            
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
            
            silenceTimerRef.current = setTimeout(() => {
              if (isInterviewActiveRef.current && !isProcessingRef.current && fullTranscript.trim()) {
                sendToBackend(fullTranscript, threadId)
                lastTranscriptRef.current = ''
              }
            }, 5000)
          }
        }
        
        recognition.onerror = (event: any) => {
          if (event.error === 'not-allowed') {
            setError('Microphone access denied.')
            setMicPermission('denied')
          }
        }

        recognition.onend = () => {
          if (isInterviewActiveRef.current && !isProcessingRef.current && !isAudioPlaying) {
            setTimeout(() => {
                try { recognition.start() } catch (err) {}
            }, 100)
          }
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [sendToBackend, threadId, isAudioPlaying])

  const startInterview = useCallback(async () => {
    setError('')
    if (!browserSupported) return
    if (!resumeFile || !jdFile) {
      setError('Please upload both files.')
      return
    }

    setIsInitializing(true)
    setStatus('processing')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (stream) {
        setMicPermission('granted')
        micStreamRef.current = stream
      }
    } catch (err) {
      setError('Microphone permission denied. Please enable microphone access to start the interview.')
      setMicPermission('denied')
      setIsInitializing(false)
      setStatus('idle')
      return
    }

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('job_description', jdFile)

      let currentThreadId = threadId || initialThreadId;
      
      if (!currentThreadId) {
        const initResponse = await fetch(`${backendUrl}/init`, {
          method: 'POST',
          body: formData,
        })

        if (!initResponse.ok) {
          const errorData = await initResponse.json().catch(() => ({}))
          throw new Error(errorData.detail || 'Failed to initialize session.')
        }

        const initData = await initResponse.json()
        currentThreadId = initData.thread_id
        setThreadId(currentThreadId)
      }

      // Start the conversation
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
        },
        body: JSON.stringify({
          text: 'start',
          thread_id: currentThreadId,
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch the first question from AI.')

      const data = await response.json()
      setAiQuestion(data.ai_text)
      
      if (data.interview_complete) {
        isInterviewActiveRef.current = false
        if (data.audio_base64) {
          await playAudio(data.audio_base64)
        }
        setStatus('completed')
        setFeedback(data.evaluation)
      } else if (data.ai_text?.toLowerCase().includes('interview completed')) {
        isInterviewActiveRef.current = false
        if (data.audio_base64) {
          await playAudio(data.audio_base64)
        }
        setStatus('completed')
      } else {
        setStatus('active')
        isInterviewActiveRef.current = true
        if (data.audio_base64) {
          await playAudio(data.audio_base64)
        } else {
          setTimeout(() => startListening(), 500)
        }
      }
    } catch (err) {
        console.error('Start interview error:', err)
        setError(err instanceof Error ? err.message : 'Failed to start interview.')
        setStatus('idle')
    } finally {
        setIsInitializing(false)
    }
  }, [browserSupported, resumeFile, jdFile, threadId, initialThreadId, backendUrl, playAudio, startListening])

  const stopInterview = () => {
    isInterviewActiveRef.current = false
    isProcessingRef.current = false
    stopListening()
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop())
      micStreamRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setStatus('idle')
    setAiQuestion('')
    setUserTranscript('')
    setLiveTranscript('')
    lastTranscriptRef.current = ''
    setIsAudioPlaying(false)
  }

  return {
    status,
    threadId,
    aiQuestion,
    userTranscript,
    liveTranscript,
    isAudioPlaying,
    error,
    isInitializing,
    feedback,
    micPermission,
    browserSupported,
    startInterview,
    stopInterview
  }
}
