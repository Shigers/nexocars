"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Only show once per session or on cold boot
    const hasShown = sessionStorage.getItem("nexocar_splash_shown");
    if (hasShown) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("nexocar_splash_shown", "true");
      }, 600); // fade out duration
    }, 1400); // presentation duration

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060913] select-none transition-opacity duration-500 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-6 text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Glowing Automotive Emblem */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-[#091024] border border-blue-500/40 p-3 shadow-2xl flex items-center justify-center">
            {/* Supercar Shield Icon */}
            <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              <defs>
                <linearGradient id="splashMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <path
                d="M 256 65 L 375 110 C 375 220, 310 295, 256 325 C 202 295, 137 220, 137 110 Z"
                fill="#091024"
                stroke="url(#splashMetal)"
                strokeWidth="8"
              />
              <path
                d="M 175 210 Q 200 160, 256 160 Q 312 160, 337 210"
                fill="none"
                stroke="url(#splashMetal)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 165 210 L 200 235 L 312 235 L 347 210"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <circle cx="195" cy="225" r="7" fill="#38bdf8" />
              <circle cx="317" cy="225" r="7" fill="#38bdf8" />
              <polygon points="256,195 264,208 256,220 248,208" fill="#38bdf8" />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl md:text-5xl font-black tracking-[0.2em] text-white">
              NEXO
            </span>
            <span className="text-3xl md:text-5xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              CAR
            </span>
          </div>

          <p className="text-[11px] md:text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">
            Orlando Cars &amp; Loewe
          </p>
        </div>

        {/* Ignition loading line */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full animate-[progress_1.2s_ease-out_forwards]" />
        </div>

        <p className="text-[10px] text-slate-400 font-mono tracking-wider">
          Iniciando sistema automotriz...
        </p>

      </div>
    </div>
  );
}
