'use client'

import { Leaf } from 'lucide-react'

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#2E7D32] via-[#4CAF50] to-[#2E7D32] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" aria-hidden>
          <path
            fill="#ffffff"
            fillOpacity="0.3"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex size-32 items-center justify-center rounded-full bg-white shadow-2xl">
          <Leaf className="size-16 text-[#2E7D32]" strokeWidth={2.5} />
        </div>
        <h1 className="text-white text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-center">
          Kandhan Coconuts
        </h1>
        <h2 className="text-white text-2xl sm:text-3xl font-semibold mb-4 tamil text-center">
          கந்தன் தென்னை
        </h2>
        <p className="text-white/90 text-lg sm:text-xl tracking-wide">
          Farm Management Simplified
        </p>
      </div>

      <div className="absolute bottom-20 flex space-x-2">
        {[0, 0.2, 0.4].map((delay) => (
          <div
            key={delay}
            className="size-3 rounded-full bg-white animate-bounce"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  )
}
