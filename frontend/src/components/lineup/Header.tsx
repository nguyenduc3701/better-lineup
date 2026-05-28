"use client";

import React, { useState, useEffect } from "react";
import { useLineup } from "../../context/LineupContext";
import { SupportedLang } from "../../app/translations";

export default function Header() {
  const {
    activeLang,
    setActiveLang,
    t,
    playMode,
    setPlayMode,
    animationState,
    startAnimation,
    phases,
    getOrderedPhaseNames,
    setIsMatchSetupModalOpen
  } = useLineup();

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "");
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-950">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{t.title}</h1>
          <p className="text-xs text-slate-400 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <select
          value={activeLang}
          onChange={(e) => setActiveLang(e.target.value as SupportedLang)}
          className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer mr-2"
        >
          <option value="en">🇬🇧 English</option>
          <option value="vi">🇻🇳 Tiếng Việt</option>
          <option value="cn">🇨🇳 中文</option>
          <option value="kr">🇰🇷 한국어</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="jp">🇯🇵 日本語</option>
        </select>

        <select
          value={playMode}
          onChange={(e) => setPlayMode(e.target.value)}
          disabled={animationState === "playing"}
          className="bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50"
        >
          <option value="ALL">{t.playModeAll}</option>
          <option value="GROUP_Attack">{t.playModeGroupAttack}</option>
          <option value="GROUP_Defence">{t.playModeGroupDefence}</option>
          {getOrderedPhaseNames(phases).some(name => phases[name]?.category === "Custom" && name !== "Starting Lineup") && (
            <option value="GROUP_Custom">{t.playModeGroupCustom}</option>
          )}
          <option value="" disabled>──────────</option>
          <optgroup label={t.attackPhases}>
            {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Attack" && name !== "Starting Lineup").map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </optgroup>
          <optgroup label={t.defencePhases}>
            {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Defence" && name !== "Starting Lineup").map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </optgroup>
          {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").length > 0 && (
            <optgroup label={t.customPhases}>
              {getOrderedPhaseNames(phases).filter(name => phases[name]?.category === "Custom" && name !== "Starting Lineup").map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </optgroup>
          )}
        </select>

        <button
          onClick={startAnimation}
          className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-lg ${
            animationState === "playing"
              ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20"
              : animationState === "finished"
              ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
          }`}
          title={
            animationState === "playing" 
              ? t.playModeSingle
              : animationState === "finished" 
              ? "Reset" 
              : "Play"
          }
        >
          {animationState === "playing" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
            </svg>
          ) : animationState === "finished" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 1 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 1 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {userName && (
          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-slate-800">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tài khoản</span>
              <span className="text-xs font-semibold text-slate-300">{userName}</span>
            </div>
            
            {/* Re-select Match Settings Button */}
            <button
              onClick={() => setIsMatchSetupModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 border border-emerald-500/20 text-xs font-semibold"
              title="Thiết lập lại sa bàn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <span>Chọn lại</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-all cursor-pointer flex items-center justify-center"
              title="Đăng xuất"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0L1.47 11.72a.75.75 0 0 0 0 1.06l3.25 3.25a.75.75 0 1 0 1.06-1.06l-1.97-1.97h11.19a.75.75 0 0 0 0-1.5H3.81l1.97-1.97a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
