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
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />
          <div className="relative w-44 h-28 md:w-56 md:h-32 rounded-3xl bg-[#091024]/90 border border-blue-500/40 p-3 shadow-2xl flex items-center justify-center">
            {/* Aerodynamic Supercar SVG */}
            <svg viewBox="0 0 512 280" className="w-full h-full drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
              <defs>
                <linearGradient id="splashCar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="35%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              <path
                d="M 60 180 C 110 145, 165 75, 256 75 C 347 75, 402 145, 452 180"
                fill="none"
                stroke="url(#splashCar)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 165 140 Q 256 95, 347 140"
                fill="none"
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 50 180 L 120 220 L 392 220 L 462 180"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path d="M 80 195 L 145 208 L 115 216 Z" fill="#38bdf8" />
              <circle cx="120" cy="205" r="5" fill="#ffffff" />
              <path d="M 432 195 L 367 208 L 397 216 Z" fill="#38bdf8" />
              <circle cx="392" cy="205" r="5" fill="#ffffff" />
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
