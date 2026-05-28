"use client";

import React from "react";
import { useLineup } from "../../context/LineupContext";

export default function NewPhaseModal() {
  const {
    t,
    isNewPhaseModalOpen,
    setIsNewPhaseModalOpen,
    newPhaseNameInput,
    setNewPhaseNameInput,
    newPhaseCategoryInput,
    setNewPhaseCategoryInput,
    newPhaseError,
    setNewPhaseError,
    handleConfirmCreatePhase
  } = useLineup();

  if (!isNewPhaseModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">{t.createNewPhase}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.newPhaseModalDesc}
          </p>
        </div>

        {newPhaseError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs font-semibold">
            ⚠️ {newPhaseError}
          </div>
        )}

        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-semibold">{t.phaseName} <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={newPhaseNameInput}
            onChange={(e) => {
              setNewPhaseNameInput(e.target.value);
              if (newPhaseError) setNewPhaseError(null);
            }}
            placeholder={t.newPhaseModalPlaceholder}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmCreatePhase();
            }}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1.5 font-semibold">{t.phaseCategory}</label>
          <select
            value={newPhaseCategoryInput}
            onChange={(e) => setNewPhaseCategoryInput(e.target.value as "Attack" | "Defence" | "Custom")}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 cursor-pointer"
          >
            <option value="Attack">{t.phaseCategoryAttack}</option>
            <option value="Defence">{t.phaseCategoryDefence}</option>
            <option value="Custom">{t.phaseCategoryCustom}</option>
          </select>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={() => {
              setIsNewPhaseModalOpen(false);
              setNewPhaseNameInput("");
              setNewPhaseError(null);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirmCreatePhase}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-600/20"
          >
            {t.create}
          </button>
        </div>
      </div>
    </div>
  );
}
