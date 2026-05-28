"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function Toolbar() {
  const {
    t,
    activePhase,
    handlePhaseChange,
    showZones,
    setShowZones,
    showTeamMotions,
    setShowTeamMotions,
    activeConfigTab,
    phases,
    getOrderedPhaseNames
  } = useLineup();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-slate-400">{t.pitchLayoutTitle}</h2>
      <div className="flex items-center gap-3">
        {/* Phase Selector Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Phase:</span>
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
            <option value="" disabled>──────────</option>
            <option value="CREATE_NEW" className="text-emerald-400 font-bold">+ {t.createNewPhase}...</option>
          </select>
        </div>

        {/* Show Zone button */}
        <button
          onClick={() => setShowZones(!showZones)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            showZones
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
          {showZones ? t.hideZones : t.showZones}
        </button>

        {/* Show Team Motions button */}
        <button
          onClick={() => setShowTeamMotions(!showTeamMotions)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
            showTeamMotions
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          {showTeamMotions 
            ? t.hideRuns.replace("{team}", activeConfigTab) 
            : t.showRuns.replace("{team}", activeConfigTab)
          }
        </button>
      </div>
    </div>
  );
}
