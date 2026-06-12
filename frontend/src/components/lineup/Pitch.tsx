"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function Pitch() {
  const {
    pitchRef,
    handleMouseMove,
    handleMouseUpOrLeave,
    showZones,
    showTeamMotions,
    isPitchVertical,
    activeConfigTab,
    players,
    selectedPlayerId,
    setSelectedPlayerId,
    ball,
    setBall,
    teamAColor,
    teamBColor,
    handleToggleHighlight,
    handleMouseDown,
    handleControlPointMouseDown,
    handleDraftControlMouseDown,
    draggingBall,
    draggingPlayerId,
    formationA,
    formationB,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleBallTouchStart,
    handleControlPointTouchStart,
    handleDraftControlTouchStart,
    t
  } = useLineup();

  const is7v7Formation = (f: string) => ["3-2-1", "2-3-1", "3-1-2", "2-1-2-1"].includes(f);
  const is7v7Mode = is7v7Formation(formationA) || is7v7Formation(formationB);

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-4 shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
       {/* The Football Pitch container */}
       <div 
         ref={pitchRef}
         onMouseDown={() => {
           setSelectedPlayerId(null);
         }}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUpOrLeave}
         onMouseLeave={handleMouseUpOrLeave}
         className={`relative w-full rounded-xl overflow-hidden shadow-2xl select-none cursor-crosshair border border-emerald-800/40 transition-all ${
           isPitchVertical ? "aspect-[1/1.4]" : "aspect-[1.4]"
         }`}
         style={{
           background: `repeating-linear-gradient(
             ${isPitchVertical ? "0deg" : "90deg"},
             #437e26,
             #437e26 8.33%,
             #3b7021 8.33%,
             #3b7021 16.66%
           )`,
           touchAction: "none",
         }}
      >
        {/* Pitch Marking Lines (SVG Overlay for high quality) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {/* Marker for saved white arrows */}
            <marker 
              id="arrow-marker" 
              viewBox="0 0 10 10" 
              refX="6" 
              refY="5" 
              markerWidth="6" 
              markerHeight="6" 
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="white" />
            </marker>
            
            {/* Marker for draft yellow arrows */}
            <marker 
              id="draft-arrow-marker" 
              viewBox="0 0 10 10" 
              refX="6" 
              refY="5" 
              markerWidth="6" 
              markerHeight="6" 
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>
          </defs>
          
          {/* Border line */}
          <rect x="2" y="2" width="96" height="96" fill="none" stroke="white" strokeWidth="0.4" />
          
          {!isPitchVertical ? (
            <>
              {/* Halfway line */}
              <line x1="50" y1="2" x2="50" y2="98" stroke="white" strokeWidth="0.4" />
              
              {is7v7Mode ? (
                <>
                  {/* Center circle */}
                  <circle cx="50" cy="50" r="7" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="50" r="0.7" fill="white" />

                  {/* Left Penalty Area */}
                  <rect x="2" y="32" width="12" height="36" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="9" cy="50" r="0.7" fill="white" />
                  <path d="M 14 45 A 6 6 0 0 1 14 55" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Right Penalty Area */}
                  <rect x="86" y="32" width="12" height="36" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="91" cy="50" r="0.7" fill="white" />
                  <path d="M 86 45 A 6 6 0 0 0 86 55" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Goal boxes */}
                  <rect x="0.5" y="45.5" width="1.5" height="9" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                  <rect x="98" y="45.5" width="1.5" height="9" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                </>
              ) : (
                <>
                  {/* Center circle */}
                  <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="50" r="0.7" fill="white" />

                  {/* Left Penalty Area */}
                  <rect x="2" y="25" width="15" height="50" fill="none" stroke="white" strokeWidth="0.4" />
                  <rect x="2" y="38" width="5" height="24" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="11" cy="50" r="0.7" fill="white" />
                  <path d="M 17 43 A 8 8 0 0 1 17 57" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Right Penalty Area */}
                  <rect x="83" y="25" width="15" height="50" fill="none" stroke="white" strokeWidth="0.4" />
                  <rect x="93" y="38" width="5" height="24" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="89" cy="50" r="0.7" fill="white" />
                  <path d="M 83 43 A 8 8 0 0 0 83 57" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Goal boxes */}
                  <rect x="0.5" y="44" width="1.5" height="12" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                  <rect x="98" y="44" width="1.5" height="12" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                </>
              )}
            </>
          ) : (
            <>
              {/* Halfway line */}
              <line x1="2" y1="50" x2="98" y2="50" stroke="white" strokeWidth="0.4" />
              
              {is7v7Mode ? (
                <>
                  {/* Center circle */}
                  <circle cx="50" cy="50" r="7" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="50" r="0.7" fill="white" />

                  {/* Top Penalty Area */}
                  <rect x="32" y="2" width="36" height="12" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="9" r="0.7" fill="white" />
                  <path d="M 45 14 A 6 6 0 0 1 55 14" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Bottom Penalty Area */}
                  <rect x="32" y="86" width="36" height="12" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="91" r="0.7" fill="white" />
                  <path d="M 45 86 A 6 6 0 0 0 55 86" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Goal boxes */}
                  <rect x="45.5" y="0.5" width="9" height="1.5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                  <rect x="45.5" y="98" width="9" height="1.5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                </>
              ) : (
                <>
                  {/* Center circle */}
                  <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="50" r="0.7" fill="white" />

                  {/* Top Penalty Area */}
                  <rect x="25" y="2" width="50" height="15" fill="none" stroke="white" strokeWidth="0.4" />
                  <rect x="38" y="2" width="24" height="5" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="11" r="0.7" fill="white" />
                  <path d="M 43 17 A 8 8 0 0 1 57 17" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Bottom Penalty Area */}
                  <rect x="25" y="83" width="50" height="15" fill="none" stroke="white" strokeWidth="0.4" />
                  <rect x="38" y="93" width="24" height="5" fill="none" stroke="white" strokeWidth="0.4" />
                  <circle cx="50" cy="89" r="0.7" fill="white" />
                  <path d="M 43 83 A 8 8 0 0 0 57 83" fill="none" stroke="white" strokeWidth="0.4" />

                  {/* Goal boxes */}
                  <rect x="44" y="0.5" width="12" height="1.5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                  <rect x="44" y="98" width="12" height="1.5" fill="none" stroke="white" strokeWidth="0.3" opacity="0.5" />
                </>
              )}
            </>
          )}

          {/* Draw saved motions */}
          {players.filter(p => !p.isSubstitute).map((p) => {
            const isPlayerSelected = p.id === selectedPlayerId;
            const isCurrentTeamShow = showTeamMotions && p.team === activeConfigTab;

            if ((!isPlayerSelected && !isCurrentTeamShow) || !p.motion) return null;
            
            const motion = p.motion;
            const ctrlX = motion.control ? motion.control.x : (motion.start.x + motion.end.x) / 2;
            const ctrlY = motion.control ? motion.control.y : (motion.start.y + motion.end.y) / 2;
            
            const dx = motion.end.x - ctrlX;
            const dy = motion.end.y - ctrlY;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            let endX = motion.end.x;
            let endY = motion.end.y;
            
            if (len > 3.2) {
              const offset = 3.2;
              endX = motion.end.x - (dx / len) * offset;
              endY = motion.end.y - (dy / len) * offset;
            }
            
            const pathData = isPitchVertical
              ? `M ${motion.start.y} ${100 - motion.start.x} Q ${ctrlY} ${100 - ctrlX} ${endY} ${100 - endX}`
              : `M ${motion.start.x} ${motion.start.y} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
            
            return (
              <g key={motion.id}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={isPlayerSelected ? "white" : "rgba(255, 255, 255, 0.45)"}
                  strokeWidth="0.6"
                  strokeDasharray="1.5 1"
                  markerEnd="url(#arrow-marker)"
                />
              </g>
            );
          })}

          {/* Draw currently drawing motion */}
          {players.filter(p => !p.isSubstitute).map((p) => {
            if (!p.motionStart) return null;
            
            const ctrlX = p.motionDraftControl ? p.motionDraftControl.x : (p.motionStart.x + p.x) / 2;
            const ctrlY = p.motionDraftControl ? p.motionDraftControl.y : (p.motionStart.y + p.y) / 2;
            
            const dx = p.x - ctrlX;
            const dy = p.y - ctrlY;
            const len = Math.sqrt(dx * dx + dy * dy);
            
            let endX = p.x;
            let endY = p.y;
            
            if (len > 3.2) {
              const offset = 3.2;
              endX = p.x - (dx / len) * offset;
              endY = p.y - (dy / len) * offset;
            }
            
            const pathData = isPitchVertical
              ? `M ${p.motionStart.y} ${100 - p.motionStart.x} Q ${ctrlY} ${100 - ctrlX} ${endY} ${100 - endX}`
              : `M ${p.motionStart.x} ${p.motionStart.y} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
            
            return (
              <g key={`draft-arrow-${p.id}`}>
                <path
                  d={pathData}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.8"
                  strokeDasharray="2 1.5"
                  markerEnd="url(#draft-arrow-marker)"
                />
              </g>
            );
          })}
        </svg>

        {/* Tactical Zones Grid Overlay */}
        {showZones && (
          <div className={`absolute inset-0 grid pointer-events-none z-0 ${
            isPitchVertical ? "grid-cols-3 grid-rows-6" : "grid-cols-6 grid-rows-3"
          }`}>
            {Array.from({ length: 18 }).map((_, index) => {
              let zoneNum;
              if (isPitchVertical) {
                const r = Math.floor(index / 3);
                const c = index % 3;
                zoneNum = (5 - r) * 3 + c + 1;
              } else {
                const col = index % 6;
                const row = Math.floor(index / 6);
                zoneNum = col * 3 + row + 1;
              }
              const isZone14 = zoneNum === 14;
              
              return (
                <div 
                  key={index} 
                  className={`border border-dashed border-white/25 flex items-center justify-center relative bg-slate-950/35 ${
                    isZone14 ? "bg-amber-950/40 border-amber-400/50" : ""
                  }`}
                >
                  <span className={`font-extrabold tracking-wider text-xs sm:text-sm select-none ${
                    isZone14 
                      ? "text-amber-300 drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" 
                      : "text-white/50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  }`}>
                    Zone {zoneNum} {isZone14 && "🔥"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Render Ball (Free or Attached) */}
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            draggingBall.current = true;
          }}
          onTouchStart={(e) => handleBallTouchStart(e)}
          className="absolute cursor-grab active:cursor-grabbing z-40 select-none touch-none w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)] hover:scale-125 transition-transform text-xl sm:text-2xl"
          style={{
            left: `${isPitchVertical ? ball.y : ball.x}%`,
            top: `${isPitchVertical ? 100 - ball.x : ball.y}%`,
            transform: `translate(calc(-50% + ${ball.attachedPlayerId && !draggingBall.current ? '12px' : '0px'}), calc(-50% + ${ball.attachedPlayerId && !draggingBall.current ? '12px' : '0px'})) scale(${ball.attachedPlayerId && !draggingBall.current ? '0.7' : '1'})`
          }}
          title={t.ballTooltip}
        >
          ⚽
        </div>

        {/* Render Players */}
        {players.filter(p => !p.isSubstitute || draggingPlayerId.current === p.id).map((player) => {
          const color = player.isGoalkeeper 
            ? "#eab308" 
            : (player.team === "A" ? teamAColor : teamBColor);
          
          const isSelected = selectedPlayerId === player.id;

          return (
            <div
              key={player.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                if (e.shiftKey) {
                  handleToggleHighlight(player.id);
                } else {
                  handleMouseDown(player.id);
                }
              }}
              onTouchStart={(e) => handleTouchStart(e, player.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group touch-none"
              style={{
                left: `${isPitchVertical ? player.y : player.x}%`,
                top: `${isPitchVertical ? 100 - player.x : player.y}%`,
                zIndex: isSelected ? 30 : 10,
              }}
            >
              {/* Jersey Circle */}
              <div 
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing border-2 relative ${
                  isSelected 
                    ? "border-white scale-110 ring-4 ring-emerald-400/40" 
                    : "border-slate-900 group-hover:scale-105"
                } ${
                  player.isHighlighted
                    ? "scale-125 border-yellow-300 ring-4 ring-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.8)]"
                    : ""
                }`}
                style={{ 
                  backgroundColor: player.isHighlighted ? "#facc15" : color 
                }}
              >
              </div>

              {/* Player Name Tag */}
              <div className={`mt-1 px-1.5 py-0.5 rounded text-[9px] sm:text-xs font-semibold shadow-sm transition-all duration-150 ${
                isSelected 
                  ? "bg-emerald-400 text-slate-950 font-bold" 
                  : player.isHighlighted
                  ? "bg-yellow-400 text-slate-950 font-bold border border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  : "bg-slate-950/80 text-slate-200 border border-slate-800/80"
              }`}>
                {player.name}
              </div>
            </div>
          );
        })}

        {/* Render control point handles for bending selected player's motions */}
        {players.filter(p => !p.isSubstitute).map((p) => {
          if (p.id !== selectedPlayerId) return null;
          
          const handles: React.ReactNode[] = [];
          
          // 1. Saved motion handle
          if (p.motion) {
            const motion = p.motion;
            const ctrlX = motion.control ? motion.control.x : (motion.start.x + motion.end.x) / 2;
            const ctrlY = motion.control ? motion.control.y : (motion.start.y + motion.end.y) / 2;

            const midX = 0.25 * motion.start.x + 0.5 * ctrlX + 0.25 * motion.end.x;
            const midY = 0.25 * motion.start.y + 0.5 * ctrlY + 0.25 * motion.end.y;
            
            handles.push(
              <div
                key={`handle-${motion.id}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleControlPointMouseDown(p.id, motion.id);
                }}
                onTouchStart={(e) => handleControlPointTouchStart(e, p.id, motion.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-amber-500 border border-white cursor-pointer hover:scale-125 transition-transform z-40 flex items-center justify-center text-[8px] font-black text-slate-950 select-none shadow hover:bg-amber-400 touch-none"
                style={{
                  left: `${isPitchVertical ? midY : midX}%`,
                  top: `${isPitchVertical ? 100 - midX : midY}%`,
                }}
                title={t.controlPointTip}
              >
                ~
              </div>
            );
          }
          
          // 2. Draft motion handle (before saving)
          if (p.motionStart && p.motionDraftControl) {
            const ctrlX = p.motionDraftControl.x;
            const ctrlY = p.motionDraftControl.y;

            const midX = 0.25 * p.motionStart.x + 0.5 * ctrlX + 0.25 * p.x;
            const midY = 0.25 * p.motionStart.y + 0.5 * ctrlY + 0.25 * p.y;
            
            handles.push(
              <div
                key={`draft-handle-${p.id}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleDraftControlMouseDown(p.id);
                }}
                onTouchStart={(e) => handleDraftControlTouchStart(e, p.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-amber-600 border border-red-500 cursor-pointer hover:scale-125 transition-transform z-40 flex items-center justify-center text-[8px] font-black text-white select-none shadow animate-pulse touch-none"
                style={{
                  left: `${isPitchVertical ? midY : midX}%`,
                  top: `${isPitchVertical ? 100 - midX : midY}%`,
                }}
                title={t.controlPointTip}
              >
                ~
              </div>
            );
          }
          
          return handles;
        })}
      </div>
    </div>
  );
}
