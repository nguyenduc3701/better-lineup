"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function BallMovesTracker() {
  const {
    t,
    activePhase,
    players,
    phaseBallMoves,
    handleClearBallMoves,
    MAX_BALL_MOVES,
    teamAColor,
    teamBColor
  } = useLineup();

  const isLineup = activePhase === "Starting Lineup";

  const getPlayerDetails = (playerId: string) => {
    const p = players.find(player => player.id === playerId);
    if (!p) return { name: "Unknown", color: "#64748b", team: "", number: "" };
    const color = p.isGoalkeeper
      ? "#eab308"
      : p.team === "A"
      ? teamAColor
      : teamBColor;
    return { name: p.name, color, team: p.team, number: p.number };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      <h2 className="text-lg font-bold border-b border-slate-800 pb-2 text-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚽</span>
          <span>{activePhase === "Starting Lineup" ? "Ball Control" : "Ball Pass Sequence"}</span>
        </div>
        {!isLineup && phaseBallMoves.length > 0 && (
          <span className="text-xs bg-slate-850 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-semibold">
            {phaseBallMoves.length} / {MAX_BALL_MOVES}
          </span>
        )}
      </h2>

      {isLineup ? (
        <div className="text-xs text-slate-500 bg-slate-950/20 border border-slate-850 p-4 rounded-xl text-center leading-relaxed">
          ⚽ Ball is locked in Starting Lineup. Switch to a tactic phase to pass the ball.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {phaseBallMoves.length === 0 ? (
            <div className="text-xs text-slate-400 bg-slate-950/20 border border-dashed border-slate-800 p-6 rounded-xl text-center flex flex-col items-center gap-2">
              <span className="text-xl">🎯</span>
              <p className="font-medium">No passes recorded in this phase yet.</p>
              <p className="text-[10px] text-slate-500 leading-normal">
                Drag the ball from player to player on the pitch to record passes (Max 10).
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Scrollable list of moves */}
              <div className="max-h-[180px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {phaseBallMoves.map((move, index) => {
                  const from = getPlayerDetails(move.fromPlayerId);
                  const to = getPlayerDetails(move.toPlayerId);

                  return (
                    <div
                      key={move.id}
                      className="flex items-center justify-between p-2 bg-slate-950/40 border border-slate-850 rounded-lg hover:border-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-800 text-slate-400 w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        {/* From Player */}
                        <div className="flex items-center gap-1.5 bg-slate-950/60 py-1 px-2 rounded border border-slate-900">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: from.color }}
                          />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-[70px]">
                            {from.name}
                          </span>
                        </div>
                      </div>

                      <span className="text-slate-500 text-xs font-bold font-mono">➔</span>

                      {/* To Player */}
                      <div className="flex items-center gap-1.5 bg-slate-950/60 py-1 px-2 rounded border border-slate-900 mr-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: to.color }}
                        />
                        <span className="text-xs font-semibold text-slate-200 truncate max-w-[70px]">
                          {to.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <button
                  type="button"
                  onClick={handleClearBallMoves}
                  className="bg-red-950/40 text-red-400 hover:bg-red-950 border border-red-900/40 hover:border-red-900/80 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear Passes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
