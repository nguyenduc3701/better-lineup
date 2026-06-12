"use client";

import React, { useState } from "react";
import { useLineup } from "../../context/LineupContext";
import { Formation } from "../../types";
import TeamRosterModal from "./TeamRosterModal";

export default function TeamSettings() {
  const {
    t,
    colorError,
    activeConfigTab,
    handleTabChange,
    teamAColor,
    teamBColor,
    handleColorChange,
    formationA,
    formationB,
    handleFormationChange,
    activePhase
  } = useLineup();

  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      <h2 className="text-lg font-bold border-b border-slate-800 pb-2 text-emerald-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
        {t.teamSetting}

        <button
          type="button"
          onClick={() => setIsRosterModalOpen(true)}
          className="ml-auto text-[11px] font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          {t.switchTeamBtn}
        </button>
      </h2>

      {/* Team Roster Modal */}
      <TeamRosterModal isOpen={isRosterModalOpen} onClose={() => setIsRosterModalOpen(false)} />

      {/* Color Error Message */}
      {colorError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-semibold">
          ⚠️ {colorError}
        </div>
      )}

      {/* Tab Selector */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/60 mb-2">
        <button
          type="button"
          onClick={() => handleTabChange("A")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeConfigTab === "A"
              ? "bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/50"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamAColor }}></span>
          {t.teamTab.replace("{team}", "A")}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("B")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeConfigTab === "B"
              ? "bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/50"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamBColor }}></span>
          {t.teamTab.replace("{team}", "B")}
        </button>
      </div>

      {/* Conditionally Render Team Controls */}
      {activeConfigTab === "A" ? (
        /* Team A Controls */
        <div className="flex flex-col gap-3 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
          <h3 className="font-bold text-sm text-slate-200 flex items-center justify-between">
            <span>{t.teamSetting} A</span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamAColor }}></span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">{t.shirtColor}:</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={teamAColor} 
                  onChange={(e) => handleColorChange("A", e.target.value)}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <input 
                  type="text" 
                  value={teamAColor} 
                  onChange={(e) => handleColorChange("A", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 uppercase text-slate-200 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.formation}:</label>
              <select 
                value={formationA} 
                onChange={(e) => handleFormationChange("A", e.target.value as Formation)}
                disabled={activePhase !== "Starting Lineup"}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title={activePhase !== "Starting Lineup" ? t.formationLocked : ""}
              >
                <optgroup label="Sân 11 (11v11)">
                  <option value="4-4-2">4-4-2</option>
                  <option value="4-3-3">4-3-3</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="5-4-1">5-4-1</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="3-4-3">3-4-3</option>
                  <option value="4-5-1">4-5-1</option>
                  <option value="4-1-2-1-2">4-1-2-1-2</option>
                  <option value="3-2-4-1">3-2-4-1</option>
                </optgroup>
                <optgroup label="Sân 7 (7v7)">
                  <option value="3-2-1">3-2-1</option>
                  <option value="2-3-1">2-3-1</option>
                  <option value="3-1-2">3-1-2</option>
                  <option value="2-1-2-1">2-1-2-1</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      ) : (
        /* Team B Controls */
        <div className="flex flex-col gap-3 p-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
          <h3 className="font-bold text-sm text-slate-200 flex items-center justify-between">
            <span>{t.teamSetting} B</span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamBColor }}></span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">{t.shirtColor}:</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  value={teamBColor} 
                  onChange={(e) => handleColorChange("B", e.target.value)}
                  className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                />
                <input 
                  type="text" 
                  value={teamBColor} 
                  onChange={(e) => handleColorChange("B", e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 uppercase text-slate-200 text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t.formation}:</label>
              <select 
                value={formationB} 
                onChange={(e) => handleFormationChange("B", e.target.value as Formation)}
                disabled={activePhase !== "Starting Lineup"}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title={activePhase !== "Starting Lineup" ? t.formationLocked : ""}
              >
                <optgroup label="Sân 11 (11v11)">
                  <option value="4-4-2">4-4-2</option>
                  <option value="4-3-3">4-3-3</option>
                  <option value="3-5-2">3-5-2</option>
                  <option value="5-4-1">5-4-1</option>
                  <option value="4-2-3-1">4-2-3-1</option>
                  <option value="3-4-3">3-4-3</option>
                  <option value="4-5-1">4-5-1</option>
                  <option value="4-1-2-1-2">4-1-2-1-2</option>
                  <option value="3-2-4-1">3-2-4-1</option>
                </optgroup>
                <optgroup label="Sân 7 (7v7)">
                  <option value="3-2-1">3-2-1</option>
                  <option value="2-3-1">2-3-1</option>
                  <option value="3-1-2">3-1-2</option>
                  <option value="2-1-2-1">2-1-2-1</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
