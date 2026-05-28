"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function PlayerDetailsEditor() {
  const {
    t,
    players,
    selectedPlayerId,
    teamAColor,
    teamBColor,
    handleNameChange,
    handleStartMotion,
    handleSaveMotion,
    handleCancelMotion,
    handleDeleteMotion,
    handleToggleHighlight
  } = useLineup();

  const activePlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      <h2 className="text-lg font-bold border-b border-slate-800 pb-2 text-emerald-400 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        {t.playerDetails}
      </h2>

      {activePlayer ? (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full shadow"
              style={{ 
                backgroundColor: activePlayer.isGoalkeeper 
                  ? "#eab308" 
                  : (activePlayer.team === "A" ? teamAColor : teamBColor) 
              }}
            />
            <div>
              <h3 className="font-bold text-slate-200 text-sm">{activePlayer.name}</h3>
              <p className="text-[11px] text-slate-400">
                Team {activePlayer.team} • {activePlayer.isGoalkeeper ? t.goalkeeper : t.outfieldPlayer}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t.selectedPlayer}:</label>
              <input 
                type="text" 
                value={activePlayer.name} 
                onChange={(e) => handleNameChange(activePlayer.id, e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <label className="block text-xs text-slate-400 mb-2 font-semibold">{t.motionControls}:</label>
              {activePlayer.isGoalkeeper ? (
                <div className="text-[11px] text-slate-400 bg-slate-950/20 border border-slate-800/40 p-2.5 rounded-lg text-center font-medium">
                  {t.gkFixedAlert}
                </div>
              ) : activePlayer.isSubstitute ? (
                <div className="text-[11px] text-slate-400 bg-slate-950/20 border border-slate-800/40 p-2.5 rounded-lg text-center font-medium">
                  🔄 {t.dragSubTip}
                </div>
              ) : activePlayer.motionStart ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[11px] text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg leading-relaxed">
                    {t.drawingRunAlert}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveMotion(activePlayer.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-2 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelMotion(activePlayer.id)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              ) : activePlayer.motion ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[11px] text-slate-300 bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-lg leading-relaxed flex flex-col gap-1">
                    <span>{t.hasMotionAlert}</span>
                    <span className="text-[10px] text-slate-400">
                      ({Math.round(activePlayer.motion.start.x)}%, {Math.round(activePlayer.motion.start.y)}%) ➔ ({Math.round(activePlayer.motion.end.x)}%, {Math.round(activePlayer.motion.end.y)}%)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartMotion(activePlayer.id)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {t.redrawBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMotion(activePlayer.id)}
                      className="flex-1 bg-red-950/80 text-red-400 border border-red-900/60 rounded-lg px-3 py-2 text-xs font-bold hover:bg-red-950 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {t.deleteMotionBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartMotion(activePlayer.id)}
                  className="w-full bg-emerald-950/80 text-emerald-400 border border-emerald-900/60 rounded-lg px-3 py-2 text-xs font-bold hover:bg-emerald-900 cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  {t.addRunVectorBtn}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg">
                <span className="block text-[10px] text-slate-400">{t.coordX}:</span>
                <strong className="text-emerald-400 text-sm">{Math.round(activePlayer.x)}%</strong>
              </div>
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg">
                <span className="block text-[10px] text-slate-400">{t.coordY}:</span>
                <strong className="text-emerald-400 text-sm">{Math.round(activePlayer.y)}%</strong>
              </div>
            </div>

            {/* Highlight control */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">{t.highlightLabel}:</span>
              <button
                type="button"
                onClick={() => handleToggleHighlight(activePlayer.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePlayer.isHighlighted
                    ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                }`}
              >
                {activePlayer.isHighlighted ? t.btnHighlighted : t.btnHighlight}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-slate-600 mb-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-1.676-1.345c-.58-.447-1.137-.887-1.666-1.332m1.666 1.332V9.15c0-1.787-.978-3.414-2.584-4.227L9.42 3.42C7.814 2.607 5.922 3.125 5 4.5v15c.922 1.375 2.814 1.893 4.42 1.08l2.956-1.503c1.606-.813 2.584-2.44 2.584-4.227v-1.352c-.529-.445-1.086-.885-1.666-1.332z" />
          </svg>
          <p className="text-xs text-slate-500">
            {t.noPlayerSelected}
          </p>
        </div>
      )}
    </div>
  );
}
