'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mic, MicOff, Volume2, Play, Square, AlertCircle, FileText, Upload } from 'lucide-react'

type InterviewStatus = 'idle' | 'active' | 'listening' | 'processing' | 'completed'

export default function InterviewApp() {
  const [status, setStatus] = useState<InterviewStatus>('idle')
  const [threadId, setThreadId] = useState<string>('')
  const [aiQuestion, setAiQuestion] = useState<string>('')
  const [userTranscript, setUserTranscript] = useState<string>('')
  const [liveTranscript, setLiveTranscript] = useState<string>('')
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [error, setError] = useState<string>('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jdFile, setJdFile] = useState<File | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt')
  const [browserSupported, setBrowserSupported] = useState<boolean>(true)
  
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const isInterviewActiveRef = useRef(false)
  const micStreamRef = useRef<MediaStream | null>(null)
  const isProcessingRef = useRef(false)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastTranscriptRef = useRef<string>('')

  useEffect(() => {
    const checkBrowserSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Microphone access is not supported in this browser. Please use Chrome, Edge, or Safari.')
        setBrowserSupported(false)
        setMicPermission('denied')
        return
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
        setBrowserSupported(false)
        return
      }

      setBrowserSupported(true)
    }

    checkBrowserSupport()
  }, [])

  const sendToBackend = useCallback(async (text: string) => {
    if (isProcessingRef.current) {
      return
    }
    
    isProcessingRef.current = true
    setStatus('processing')
    stopListening()
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
    try {
      const response = await fetch(`http://localhost:8001/ask`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
        },
        body: JSON.stringify({
          text,
          thread_id: threadId,
        }),
      })

      if (!response.ok) {
        throw new Error('Backend API error')
      }

      const data = await response.json()
      
      setAiQuestion(data.ai_text)
      
      if (data.ai_text.toLowerCase().includes('interview completed') || 
          data.ai_text.toLowerCase().includes('thank you for your time')) {
        setStatus('completed')
        isInterviewActiveRef.current = false
        if (data.audio_base64) {
          await playAudio(data.audio_base64)
        }
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
      setError('Failed to communicate with backend. Please check your API connection.')
      setStatus('idle')
      isInterviewActiveRef.current = false
      isProcessingRef.current = false
    }
  }, [threadId])

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
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }
          
          if (interimTranscript) {
            setLiveTranscript(interimTranscript)
          }
          
          if (finalTranscript && isInterviewActiveRef.current) {
            const fullTranscript = (lastTranscriptRef.current + ' ' + finalTranscript).trim()
            lastTranscriptRef.current = fullTranscript
            setUserTranscript(fullTranscript)
            setLiveTranscript('')
            
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current)
            }
            
            silenceTimerRef.current = setTimeout(() => {
              if (isInterviewActiveRef.current && !isProcessingRef.current && fullTranscript.trim()) {
                sendToBackend(fullTranscript)
                lastTranscriptRef.current = ''
              }
            }, 4000)
          }
        }
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'no-speech') {
            if (isInterviewActiveRef.current && !isProcessingRef.current) {
              setTimeout(() => {
                try {
                  recognition.start()
                } catch (err) {
                  // Ignore if already started
                }
              }, 500)
            }
          } else if (event.error === 'not-allowed') {
            setError('Microphone access denied. Please allow microphone access and try again.')
            setMicPermission('denied')
            stopInterview()
          } else if (event.error !== 'aborted') {
            if (isInterviewActiveRef.current && !isProcessingRef.current) {
              setTimeout(() => {
                try {
                  recognition.start()
                } catch (err) {
                  // Ignore if already started
                }
              }, 500)
            }
          }
        }
        
        recognition.onend = () => {
          if (isInterviewActiveRef.current && !isProcessingRef.current) {
            setTimeout(() => {
              try {
                recognition.start()
              } catch (err) {
                // Ignore if already started
              }
            }, 100)
          }
        }
        
        recognitionRef.current = recognition
      }
    }
  }, [sendToBackend])

  const generateThreadId = () => {
    return `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const playAudio = async (base64Audio: string) => {
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
  } catch (err) {
    console.error(err)
    setIsAudioPlaying(false)
    isProcessingRef.current = false
  }
}

  const startListening = () => {
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
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
    }
  }

  const startInterview = async () => {
    setError('')
    
    if (!browserSupported) {
      setError('Your browser does not support the features required for this app. Please use Chrome, Edge, or Safari.')
      return
    }
    
    if (!resumeFile || !jdFile) {
      setError('Please upload both your resume and the job description to start.')
      return
    }

    setIsInitializing(true)
    setStatus('processing')

    try {
      let stream: MediaStream | null = null
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true 
        })
      } catch (err) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          })
        } catch (err2) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const audioInputs = devices.filter(device => device.kind === 'audioinput')
          
          if (audioInputs.length > 0) {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                deviceId: audioInputs[0].deviceId ? { exact: audioInputs[0].deviceId } : undefined
              }
            })
          } else {
            throw new Error('No audio input devices found')
          }
        }
      }
      
      if (stream) {
        setMicPermission('granted')
        micStreamRef.current = stream
      }
      
    } catch (err) {
      console.error('Microphone permission error:', err)
      setIsInitializing(false)
      setStatus('idle')
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      if (errorMessage.includes('not found') || errorMessage.includes('NotFoundError')) {
        setError('No microphone device found. Please check if your microphone is properly connected and not being used by another application.')
      } else if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError('Microphone access was denied. Please allow microphone access in your browser settings and try again.')
      } else {
        setError(`Microphone error: ${errorMessage}. Please ensure your microphone is connected and not being used by another application.`)
      }
      
      setMicPermission('denied')
      return
    }

    // Call /init first
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8001'
    let currentThreadId = ''

    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('job_description', jdFile)

      const initResponse = await fetch(`${backendUrl}/init`, {
        method: 'POST',
        body: formData,
      })

      if (!initResponse.ok) {
        const errorData = await initResponse.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to initialize interview.')
      }

      const initData = await initResponse.json()
      currentThreadId = initData.thread_id
      setThreadId(currentThreadId)
    } catch (err) {
      console.error('Error in /init:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize interview session.')
      setIsInitializing(false)
      setStatus('idle')
      return
    }
    
    setAiQuestion('')
    setUserTranscript('')
    setLiveTranscript('')
    lastTranscriptRef.current = ''
    isInterviewActiveRef.current = true
    isProcessingRef.current = false
    
    try {
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
        },
        body: JSON.stringify({
          text: 'start',
          thread_id: currentThreadId,
        }),
      })

      if (!response.ok) {
        throw new Error('Backend API error')
      }

      const data = await response.json()
      setAiQuestion(data.ai_text)
      const isInterviewComplete =
        data.ai_text?.toLowerCase().includes('interview completed') ||
        data.ai_text?.toLowerCase().includes('thank you for your time')

      if (isInterviewComplete) {
        setStatus('completed')
        isInterviewActiveRef.current = false
      } else {
        setStatus('active')
      }
      if (data.audio_base64) {
        await playAudio(data.audio_base64)
      } else {
        setTimeout(() => startListening(), 500)
      }
      
    } catch (err) {
      console.error('Error starting interview:', err)
      setError('Failed to start interview conversation. Please check your API connection.')
      setStatus('idle')
      isInterviewActiveRef.current = false
      isProcessingRef.current = false
    } finally {
      setIsInitializing(false)
    }
  }

  const stopInterview = () => {
    isInterviewActiveRef.current = false
    isProcessingRef.current = false
    stopListening()
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    
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

  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            AI Interview Assistant
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Experience a seamless, hands-free voice interview powered by AI
          </p>
        </div>

        {(!browserSupported || micPermission === 'denied') && (
          <Card className="p-6 bg-accent/10 border-accent">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-accent-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-accent-foreground">
                  {!browserSupported ? 'Browser Not Supported' : 'Microphone Permission Required'}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {!browserSupported 
                    ? 'This app requires microphone and speech recognition support. Please use Chrome, Edge, or Safari.'
                    : 'Microphone access is required to conduct voice interviews. Click "Start Interview" to grant permission.'}
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-8 space-y-6 bg-card border-2">
          <div className="flex items-center justify-center">
            <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
              status === 'listening' ? 'bg-accent pulse-glow' : 
              status === 'active' || status === 'processing' ? 'bg-primary' : 
              'bg-muted'
            } transition-all duration-300`}>
              {status === 'listening' ? (
                <Mic className="w-16 h-16 text-accent-foreground" />
              ) : status === 'active' || status === 'processing' ? (
                isAudioPlaying ? (
                  <Volume2 className="w-16 h-16 text-primary-foreground" />
                ) : (
                  <MicOff className="w-16 h-16 text-primary-foreground" />
                )
              ) : (
                <MicOff className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              {status === 'idle' && 'Ready to start'}
              {status === 'active' && (isAudioPlaying ? 'AI is speaking...' : 'Waiting for response...')}
              {status === 'listening' && 'Listening to your answer...'}
              {status === 'processing' && 'Processing your response...'}
              {status === 'completed' && 'Interview completed!'}
            </div>
          </div>

          {aiQuestion && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                AI Question:
              </div>
              <div className="p-6 rounded-lg bg-secondary/50 border border-border">
                <p className="text-lg leading-relaxed text-pretty">{aiQuestion}</p>
              </div>
            </div>
          )}

          {liveTranscript && status === 'listening' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mic className="w-4 h-4 animate-pulse" />
                Speaking now...
              </div>
              <div className="p-6 rounded-lg bg-accent/20 border border-accent/50">
                <p className="text-lg leading-relaxed text-pretty italic">{liveTranscript}</p>
              </div>
            </div>
          )}

          {userTranscript && !liveTranscript && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mic className="w-4 h-4" />
                Your Response:
              </div>
              <div className="p-6 rounded-lg bg-accent/10 border border-accent">
                <p className="text-lg leading-relaxed text-pretty">{userTranscript}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 justify-center pt-4">
            {(status === 'idle' || status === 'completed') && (
              <div className="w-full max-w-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resume-upload" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Resume (PDF)
                    </Label>
                    <div className="relative">
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jd-upload" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Job Description (PDF)
                    </Label>
                    <div className="relative">
                      <Input
                        id="jd-upload"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    size="lg" 
                    onClick={startInterview}
                    disabled={isInitializing}
                    className="px-8"
                  >
                    {isInitializing ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        {status === 'completed' ? 'Start New Interview' : 'Start Interview'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {status !== 'idle' && status !== 'completed' && (
              <Button 
                size="lg" 
                variant="destructive"
                onClick={stopInterview}
                className="px-8"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Interview
              </Button>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">How it works:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>1. Click Start Interview and grant microphone permission</li>
            <li>2. The AI will ask you a question (audio will play automatically)</li>
            <li>3. Speak your answer clearly - you'll see your words appear in real-time</li>
            <li>4. After 4 seconds of silence, your answer is sent to the AI automatically</li>
            <li>5. The AI will respond with the next question</li>
            <li>6. This continues until the interview is complete or you click Stop</li>
          </ol>
        </Card>

        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  )
}
