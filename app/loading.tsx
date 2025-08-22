import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#181c23] to-[#23272f] text-white">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-blue-500 animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 animate-pulse" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="#60a5fa" strokeWidth="4" opacity="0.3" />
            <circle cx="24" cy="24" r="12" stroke="#60a5fa" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">DevMirror</h1>
      <p className="text-lg text-gray-400 mb-6">Loading your workspace...</p>
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-3 h-3 bg-blue-300 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
}
