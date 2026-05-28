"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function SubstitutesBench() {
  const {
    t,
    players,
    teamAColor,
    teamBColor,
    handleMouseDown
  } = useLineup();

  return (
    <div className="mt-4 pt-4 border-t border-slate-800/80">
      <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        {t.subsTitle} ({t.dragSubTip})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team A Subs */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800/40">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamAColor }} />
            <span className="text-xs font-bold text-slate-300">{t.teamTab.replace("{team}", "A")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {players.filter(p => p.team === "A" && p.isSubstitute).map(p => (
              <div
                key={p.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(p.id);
                }}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 cursor-grab active:cursor-grabbing transition-all select-none"
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700/80" style={{ backgroundColor: teamAColor }} />
                <span className="text-[11px] font-medium text-slate-300">{p.name}</span>
              </div>
            ))}
            {players.filter(p => p.team === "A" && p.isSubstitute).length === 0 && (
              <span className="text-[11px] text-slate-500 italic">No substitutes</span>
            )}
          </div>
        </div>

        {/* Team B Subs */}
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800/40">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: teamBColor }} />
            <span className="text-xs font-bold text-slate-300">{t.teamTab.replace("{team}", "B")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {players.filter(p => p.team === "B" && p.isSubstitute).map(p => (
              <div
                key={p.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(p.id);
                }}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 cursor-grab active:cursor-grabbing transition-all select-none"
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-700/80" style={{ backgroundColor: teamBColor }} />
                <span className="text-[11px] font-medium text-slate-300">{p.name}</span>
              </div>
            ))}
            {players.filter(p => p.team === "B" && p.isSubstitute).length === 0 && (
              <span className="text-[11px] text-slate-500 italic">No substitutes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
