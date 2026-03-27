'use client'

import React from 'react'

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none bg-white">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px] animate-mesh" />
        <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-50 blur-[100px] animate-mesh delay-700" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-blue-50 blur-[150px] animate-mesh delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-cyan-50/50 blur-[80px] animate-mesh delay-300" />
      </div>

      {/* Subtle Animated Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating Blobs (Blue and White) */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[130px] animate-blob animation-delay-2000" />
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[100px]" />
    </div>
  )
}
