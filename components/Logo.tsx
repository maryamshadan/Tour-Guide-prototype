
import React from 'react';
import { Language } from '../types';
import { UI_STRINGS } from '../translations';

export const Logo = ({ className = "w-12 h-12", showText = false, language = 'en' }: { className?: string, showText?: boolean, language?: Language }) => (
  <div className="flex items-center gap-2">
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md"></div>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
        <circle cx="50" cy="50" r="48" fill="white" stroke="#E2E8F0" strokeWidth="2"/>
        <path d="M50 25C54.4183 25 58 28.5817 58 33C58 37.4183 54.4183 41 50 41C45.5817 41 42 37.4183 42 33C42 28.5817 45.5817 25 50 25Z" fill="#2563EB"/>
        <path d="M30 65C30 53.9543 38.9543 45 50 45C61.0457 45 70 53.9543 70 65V70H30V65Z" fill="#2563EB"/>
        <path d="M68 20C68 13.3726 62.6274 8 56 8C49.3726 8 44 13.3726 44 20C44 26.6274 56 38 56 38C56 38 68 26.6274 68 20Z" fill="#F97316"/>
        <circle cx="56" cy="20" r="4" fill="white"/>
        <path d="M25 65C25 65 35 55 50 55C65 55 75 65 75 65C75 65 65 85 50 85C35 85 25 65 25 65Z" fill="#10B981" fillOpacity="0.9"/>
        <path d="M50 85C35 85 22 75 22 75V80C22 80 35 92 50 92C65 92 78 80 78 80V75C78 75 65 85 50 85Z" fill="#059669"/>
      </svg>
    </div>
    {showText && (
      <div className="flex flex-col">
        <span className="font-serif font-bold text-slate-800 text-xl leading-none tracking-wide">TourGuide</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{UI_STRINGS[language].header_tagline}</span>
      </div>
    )}
  </div>
);
