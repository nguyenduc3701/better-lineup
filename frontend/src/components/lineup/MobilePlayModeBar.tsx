"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

/**
 * MobilePlayModeBar - Shown only on small screens (sm:hidden).
 * Replaces the play mode dropdown that is hidden in the Header on mobile.
 */
export default function MobilePlayModeBar() {
  const {
    t,
    playMode,
    setPlayMode,
    animationState,
    startAnimation,
    phases,
    getOrderedPhaseNames
  } = useLineup();

  return (
    <div className="sm:hidden flex items-center gap-2 px-3 py-2 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/60 sticky top-[57px] z-40">
      <select
        value={playMode}
        onChange={(e) => setPlayMode(e.target.value)}
        disabled={animationState === "playing"}
        className="flex-1 bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50"
      >
        <option value="ALL">{t.playModeAll}</option>
        <option value="GROUP_Attack">{t.playModeGroupAttack}</option>
        <option value="GROUP_Defence">{t.playModeGroupDefence}</option>
        {getOrderedPhaseNames(phases).some(name => phases[name]?.category === "Custom" && name !== "Starting Lineup") && (
          <option value="GROUP_Custom">{t.playModeGroupCustom}</option>
        )}
        <option value="" disabled>──────────</option>
        <optgroup label={t.attackPhases}>
          {getOrderedPhaseNames(phases)
            .filter(name => phases[name]?.category === "Attack" && name !== "Starting Lineup")
            .map(name => <option key={name} value={name}>{name}</option>)}
        </optgroup>
        <optgroup label={t.defencePhases}>
          {getOrderedPhaseNames(phases)
            .filter(name => phases[name]?.category === "Defence" && name !== "Starting Lineup")
            .map(name => <option key={name} value={name}>{name}</option>)}
        </optgroup>
        {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").length > 0 && (
          <optgroup label={t.customPhases}>
            {getOrderedPhaseNames(phases)
              .filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup")
              .map(name => <option key={name} value={name}>{name}</option>)}
          </optgroup>
        )}
      </select>

      <button
        onClick={startAnimation}
        className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow ${
          animationState === "playing"
            ? "bg-red-600 hover:bg-red-500 text-white"
            : animationState === "finished"
            ? "bg-amber-600 hover:bg-amber-500 text-white"
            : "bg-emerald-600 hover:bg-emerald-500 text-white"
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
          </svg>
        ) : animationState === "finished" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 1 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 1 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        )}
        <span>
          {animationState === "playing" ? "Stop" : animationState === "finished" ? "Reset" : "Play"}
        </span>
      </button>
    </div>
  );
}
