"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function QuickStats() {
  const {
    teamAColor,
    teamBColor,
    players,
    formationA,
    formationB,
    t
  } = useLineup();

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center justify-between text-sm">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: teamAColor }}></span>
          <span>{t.teamPrefix} A: <strong>{players.filter(p => p.team === "A").length} {t.playersSuffix}</strong> ({formationA})</span>
        </span>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: teamBColor }}></span>
          <span>{t.teamPrefix} B: <strong>{players.filter(p => p.team === "B").length} {t.playersSuffix}</strong> ({formationB})</span>
        </span>
      </div>
      <p className="text-slate-400 text-xs border-t border-slate-800/60 pt-3 sm:pt-0 sm:border-t-0">{t.quickStatsTooltip}</p>
    </div>
  );
}
