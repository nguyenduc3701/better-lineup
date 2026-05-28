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
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap gap-6 items-center justify-between text-sm">
      <div className="flex gap-4">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamAColor }}></span>
          {t.teamPrefix} A: <strong>{players.filter(p => p.team === "A").length} {t.playersSuffix}</strong> ({formationA})
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamBColor }}></span>
          {t.teamPrefix} B: <strong>{players.filter(p => p.team === "B").length} {t.playersSuffix}</strong> ({formationB})
        </span>
      </div>
      <p className="text-slate-400 text-xs">{t.quickStatsTooltip}</p>
    </div>
  );
}
