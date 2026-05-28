"use client";

import React, { useState } from "react";
import { useLineup } from "../../context/LineupContext";
import { MOCK_TEAMS } from "../../constants/mockTeams";

interface MatchSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchSetupModal({ isOpen, onClose }: MatchSetupModalProps) {
  const { setupMatch } = useLineup();
  const [mode, setMode] = useState<"7v7" | "11v11">("11v11");
  const [homeTeam, setHomeTeam] = useState<string>("Manchester City");
  const [awayTeam, setAwayTeam] = useState<string>("Arsenal");

  if (!isOpen) return null;

  const handleStart = () => {
    if (mode === "11v11") {
      const teamA = MOCK_TEAMS[homeTeam];
      const teamB = MOCK_TEAMS[awayTeam];
      
      let colorA = teamA.color;
      let colorB = teamB.color;

      // Color clashing check
      if (colorA.toLowerCase() === colorB.toLowerCase()) {
        // Randomize away team color to something different
        const distinctColors = ["#e11d48", "#2563eb", "#16a34a", "#ca8a04", "#ea580c", "#7c3aed"];
        const filtered = distinctColors.filter(c => c.toLowerCase() !== colorA.toLowerCase());
        colorB = filtered[Math.floor(Math.random() * filtered.length)];
      }

      setupMatch({
        mode: "11v11",
        teamAName: homeTeam,
        teamBName: awayTeam,
        colorA,
        colorB
      });
    } else {
      setupMatch({
        mode: "7v7"
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <h2 className="text-lg font-black text-slate-100 mb-1">Cấu hình Sa bàn chiến thuật</h2>
        <p className="text-xs text-slate-400 mb-6">Chọn loại sân đấu và các đội bóng tham gia trước khi khởi tạo sơ đồ</p>

        {/* Pitch Mode Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setMode("7v7")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              mode === "7v7"
                ? "bg-slate-800/80 border-emerald-500 shadow-lg shadow-emerald-500/5"
                : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Sân 7 (7v7)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
              Đội hình 7 người bao gồm thủ môn. Vạch kẻ sân tự động thu nhỏ phù hợp chuẩn Sân 7 Việt Nam.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode("11v11")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
              mode === "11v11"
                ? "bg-slate-800/80 border-emerald-500 shadow-lg shadow-emerald-500/5"
                : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Sân 11 (11v11)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
              Đội hình truyền thống. Chọn các CLB hàng đầu châu Âu và tự động load đội hình ra sân thực tế.
            </p>
          </button>
        </div>

        {/* 11v11 Team selectors */}
        {mode === "11v11" && (
          <div className="flex flex-col gap-4 bg-slate-950/40 border border-slate-800/60 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Đội nhà (Home)</label>
                <select
                  value={homeTeam}
                  onChange={(e) => {
                    setHomeTeam(e.target.value);
                    if (e.target.value === awayTeam) {
                      // Switch away team to avoid selecting identical teams
                      const other = Object.keys(MOCK_TEAMS).find(k => k !== e.target.value);
                      if (other) setAwayTeam(other);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 cursor-pointer focus:outline-none"
                >
                  {Object.keys(MOCK_TEAMS).map(name => (
                    <option key={name} value={name}>
                      {MOCK_TEAMS[name].logo} {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Đội khách (Away)</label>
                <select
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 cursor-pointer focus:outline-none"
                >
                  {Object.keys(MOCK_TEAMS).filter(name => name !== homeTeam).map(name => (
                    <option key={name} value={name}>
                      {MOCK_TEAMS[name].logo} {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team visual color preview */}
            <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 mt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MOCK_TEAMS[homeTeam]?.color }} />
                <span>Màu áo chính: {MOCK_TEAMS[homeTeam]?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MOCK_TEAMS[homeTeam]?.color.toLowerCase() === MOCK_TEAMS[awayTeam]?.color.toLowerCase() ? "#7c3aed" : MOCK_TEAMS[awayTeam]?.color }} />
                <span>Màu áo chính: {MOCK_TEAMS[awayTeam]?.name} {MOCK_TEAMS[homeTeam]?.color.toLowerCase() === MOCK_TEAMS[awayTeam]?.color.toLowerCase() && <span className="text-[10px] text-amber-500 font-bold">(Trùng màu - Tự đổi)</span>}</span>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-2.5 rounded-xl shadow-lg shadow-emerald-500/5 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <span>Khởi tạo Sa bàn</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
