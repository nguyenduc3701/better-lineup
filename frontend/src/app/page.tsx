"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LineupProvider, useLineup } from "../context/LineupContext";
import Header from "../components/lineup/Header";
import Toolbar from "../components/lineup/Toolbar";
import Pitch from "../components/lineup/Pitch";
import SubstitutesBench from "../components/lineup/SubstitutesBench";
import QuickStats from "../components/lineup/QuickStats";
import TeamSettings from "../components/lineup/TeamSettings";
import PlayerDetailsEditor from "../components/lineup/PlayerDetailsEditor";
import NewPhaseModal from "../components/lineup/NewPhaseModal";
import MatchSetupModal from "../components/lineup/MatchSetupModal";


function HomeContent() {
  const { isMatchSetupModalOpen, setIsMatchSetupModalOpen } = useLineup();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header />
      
      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-[1600px] w-full mx-auto">
        {/* Pitch Area */}
        <div className="flex-1 flex flex-col gap-4">
          <Toolbar />
          <Pitch />
          <SubstitutesBench />
          <QuickStats />
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          <TeamSettings />
          <PlayerDetailsEditor />
        </div>
      </main>

      {/* Create New Phase Modal */}
      <NewPhaseModal />

      {/* Configuration Setup Modal on First Entry */}
      <MatchSetupModal isOpen={isMatchSetupModalOpen} onClose={() => setIsMatchSetupModalOpen(false)} />
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 select-none">
        <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Đang kiểm tra bảo mật...</span>
      </div>
    );
  }

  return (
    <LineupProvider>
      <HomeContent />
    </LineupProvider>
  );
}
