"use client";

import React, { useEffect } from "react";
import { useLineup } from "../../context/LineupContext";
import Pitch from "./Pitch";

export default function FullScreenPitch() {
  const {
    isFullScreen,
    setIsFullScreen,
    activePhase,
    handlePhaseChange,
    playMode,
    setPlayMode,
    animationState,
    startAnimation,
    phases,
    getOrderedPhaseNames,
    isPitchVertical,
    setIsPitchVertical,
    showZones,
    setShowZones,
    showTeamMotions,
    setShowTeamMotions,
    showTeamB,
    setShowTeamB,
    activeConfigTab,
    t
  } = useLineup();

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsFullScreen]);

  if (!isFullScreen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-slate-100 flex flex-col p-4 md:p-6 overflow-hidden">
      {/* Modal Top Control Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80 mb-4 w-full">
        {/* Title & Brand */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <img src="/icon.png" alt="Better Lineup Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
              {t.title} <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-semibold">{t.fullScreen}</span>
            </h2>
          </div>
        </div>

        {/* Presentation Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Controls */}
          <div className="flex items-center gap-1.5 border-r border-slate-800/80 pr-1.5 sm:pr-3 mr-0.5 sm:mr-1">
            {/* Show Zone button */}
            <button
              onClick={() => setShowZones(!showZones)}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                showZones
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
              title={showZones ? t.hideZones : t.showZones}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>

            {/* Show Team Motions button */}
            <button
              onClick={() => setShowTeamMotions(!showTeamMotions)}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                showTeamMotions
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
              title={
                showTeamMotions 
                  ? t.hideRuns.replace("{team}", activeConfigTab) 
                  : t.showRuns.replace("{team}", activeConfigTab)
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            {/* Toggle Team B Visibility button */}
            <button
              onClick={() => setShowTeamB(!showTeamB)}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                !showTeamB
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
              title={showTeamB ? t.hideTeamB : t.showTeamB}
            >
              {showTeamB ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3a10.49 10.49 0 0 1-5.347 1.487M15.394 15.394a4.5 4.5 0 0 1-6.788-6.788m0 0 3.394 3.394" />
                </svg>
              )}
            </button>

            {/* Rotate Pitch button */}
            <button
              onClick={() => setIsPitchVertical(!isPitchVertical)}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                isPitchVertical
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
              title={t.rotatePitch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          {/* Phase Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="hidden md:inline text-xs text-slate-400 font-medium">Phase:</span>
            <select
              value={activePhase}
              onChange={(e) => handlePhaseChange(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option value="Starting Lineup">{t.noPhase}</option>
              <option value="" disabled>──────────</option>
              <optgroup label={t.attackPhases}>
                {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Attack" && name !== "Starting Lineup").map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
              <optgroup label={t.defencePhases}>
                {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Defence" && name !== "Starting Lineup").map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
              {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").length > 0 && (
                <optgroup label={t.customPhases}>
                  {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Play Mode Selector */}
          <select
            value={playMode}
            onChange={(e) => setPlayMode(e.target.value)}
            disabled={animationState === "playing"}
            className="bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50"
          >
            <option value="ALL">{t.playModeAll}</option>
            <option value="GROUP_Attack">{t.playModeGroupAttack}</option>
            <option value="GROUP_Defence">{t.playModeGroupDefence}</option>
            {getOrderedPhaseNames(phases).some(name => phases[name]?.category === "Custom" && name !== "Starting Lineup") && (
              <option value="GROUP_Custom">{t.playModeGroupCustom}</option>
            )}
            <option value="" disabled>──────────</option>
            <optgroup label={t.attackPhases}>
              {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Attack" && name !== "Starting Lineup").map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
            <optgroup label={t.defencePhases}>
              {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Defence" && name !== "Starting Lineup").map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
            {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").length > 0 && (
              <optgroup label={t.customPhases}>
                {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Play/Pause Button */}
          <button
            onClick={startAnimation}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-lg ${
              animationState === "playing"
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
                : animationState === "finished"
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
            }`}
            title={
              animationState === "playing" 
                ? t.playModeSingle
                : animationState === "finished" 
                ? "Reset" 
                : "Play"
            }
          >
            {animationState === "playing" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
            ) : animationState === "finished" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 1 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 1 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Close / Exit Button */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="flex items-center justify-center gap-1 px-2.5 py-2 sm:px-3 bg-slate-905 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer min-h-[36px] min-w-[36px]"
            title={t.exitFullScreen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            <span className="hidden md:inline">{t.exitFullScreen}</span>
          </button>
        </div>
      </div>

      {/* Main Pitch Viewport */}
      <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0 relative select-none">
        {/* Dynamic Constraint Container */}
        <div 
          className="w-full max-h-full transition-all duration-300"
          style={{
            maxWidth: isPitchVertical ? "calc((100vh - 100px) / 1.4)" : "calc((100vh - 100px) * 1.4)",
            aspectRatio: isPitchVertical ? "1 / 1.4" : "1.4"
          }}
        >
          <Pitch />
        </div>
      </div>
    </div>
  );
}
