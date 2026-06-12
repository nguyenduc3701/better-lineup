"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLineup } from "../../context/LineupContext";
import { Player, Formation } from "../../types";

interface TeamRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamRosterModal({ isOpen, onClose }: TeamRosterModalProps) {
  const {
    t,
    players,
    teamAColor,
    teamBColor,
    formationA,
    formationB,
    handleBulkNameChange,
    handleColorChange,
    handleFormationChange,
    activePhase,
    colorError,
  } = useLineup();

  // Separate players by team and role
  const getTeamPlayers = useCallback((team: "A" | "B") => {
    return players.filter(p => p.team === team);
  }, [players]);

  const getStarting = useCallback((team: "A" | "B") => {
    return getTeamPlayers(team).filter(p => !p.isSubstitute);
  }, [getTeamPlayers]);

  const getSubs = useCallback((team: "A" | "B") => {
    return getTeamPlayers(team).filter(p => p.isSubstitute);
  }, [getTeamPlayers]);

  // Local textarea state
  const [startingA, setStartingA] = useState("");
  const [subsA, setSubsA] = useState("");
  const [startingB, setStartingB] = useState("");
  const [subsB, setSubsB] = useState("");
  const [saved, setSaved] = useState(false);

  // Sync local state when modal opens or players change
  useEffect(() => {
    if (isOpen) {
      setStartingA(getStarting("A").map(p => p.name).join("\n"));
      setSubsA(getSubs("A").map(p => p.name).join("\n"));
      setStartingB(getStarting("B").map(p => p.name).join("\n"));
      setSubsB(getSubs("B").map(p => p.name).join("\n"));
      setSaved(false);
    }
  }, [isOpen, players, getStarting, getSubs]);

  const handleSave = () => {
    const updates: { playerId: string; newName: string }[] = [];

    const applyNames = (playerList: Player[], namesText: string) => {
      const names = namesText.split("\n");
      playerList.forEach((player, idx) => {
        const newName = names[idx]?.trim();
        if (newName !== undefined && newName !== "" && newName !== player.name) {
          updates.push({ playerId: player.id, newName });
        }
      });
    };

    applyNames(getStarting("A"), startingA);
    applyNames(getSubs("A"), subsA);
    applyNames(getStarting("B"), startingB);
    applyNames(getSubs("B"), subsB);

    if (updates.length > 0) {
      handleBulkNameChange(updates);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onClose();
  };

  if (!isOpen) return null;

  const renderTeamColumn = (
    team: "A" | "B",
    color: string,
    formation: Formation,
    startingText: string,
    setStartingText: (v: string) => void,
    subsText: string,
    setSubsText: (v: string) => void,
    startingCount: number,
    subsCount: number
  ) => (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      {/* Team Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
        <span
          className="w-4 h-4 rounded-full ring-2 ring-white/20 flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div>
          <h3 className="text-base font-bold text-slate-100">
            {t.teamTab.replace("{team}", team)}
          </h3>
          <span className="text-xs text-slate-400">{t.formation}: {formation}</span>
        </div>
      </div>

      {/* Team Controls: Shirt color and Formation */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/20 p-3.5 rounded-xl border border-slate-800/80">
        {/* Shirt Color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400">{t.shirtColor}</label>
          <div className="flex gap-2 items-center">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => handleColorChange(team, e.target.value)}
              className="w-8 h-8 rounded border-none bg-transparent cursor-pointer flex-shrink-0 animate-in fade-in duration-200"
            />
            <input 
              type="text" 
              value={color} 
              onChange={(e) => handleColorChange(team, e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 uppercase text-slate-200 text-[10px] focus:outline-none focus:border-slate-700 font-mono"
            />
          </div>
        </div>

        {/* Formation */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-400">{t.formation}</label>
          <select 
            value={formation} 
            onChange={(e) => handleFormationChange(team, e.target.value as Formation)}
            disabled={activePhase !== "Starting Lineup"}
            className="w-full bg-slate-900 border border-slate-850 rounded px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer h-[34px]"
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

      {/* Starting Players */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          {t.startingPlayers} ({startingCount})
        </label>
        <textarea
          value={startingText}
          onChange={(e) => setStartingText(e.target.value)}
          placeholder={t.rosterPlaceholder}
          rows={Math.max(startingCount, 5)}
          className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none font-mono leading-relaxed transition-all"
          spellCheck={false}
        />
      </div>

      {/* Substitute Players */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-amber-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          {t.substitutePlayers} ({subsCount})
        </label>
        <textarea
          value={subsText}
          onChange={(e) => setSubsText(e.target.value)}
          placeholder={t.rosterPlaceholder}
          rows={Math.max(subsCount, 3)}
          className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-none font-mono leading-relaxed transition-all"
          spellCheck={false}
        />
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            {t.teamRosterTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body – 2 column layout */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Color Error Message */}
          {colorError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-semibold mb-4 animate-in fade-in duration-200">
              ⚠️ {colorError}
            </div>
          )}

          <div className="flex gap-6 flex-col sm:flex-row">
            {renderTeamColumn(
              "A", teamAColor, formationA,
              startingA, setStartingA,
              subsA, setSubsA,
              getStarting("A").length,
              getSubs("A").length
            )}

            {/* Divider */}
            <div className="hidden sm:block w-px bg-slate-700/60 self-stretch flex-shrink-0" />
            <div className="sm:hidden h-px bg-slate-700/60 w-full flex-shrink-0" />

            {renderTeamColumn(
              "B", teamBColor, formationB,
              startingB, setStartingB,
              subsB, setSubsB,
              getStarting("B").length,
              getSubs("B").length
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          {saved && (
            <span className="text-emerald-400 text-xs font-semibold mr-auto flex items-center gap-1 animate-in fade-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              ✓
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all cursor-pointer"
          >
            {t.closeModal}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-lg shadow-emerald-900/30 cursor-pointer"
          >
            {t.saveNames}
          </button>
        </div>
      </div>
    </div>
  );
}
