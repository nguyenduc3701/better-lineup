"use client";

import React from "react";
import { LineupProvider } from "../context/LineupContext";
import Header from "../components/lineup/Header";
import Toolbar from "../components/lineup/Toolbar";
import Pitch from "../components/lineup/Pitch";
import SubstitutesBench from "../components/lineup/SubstitutesBench";
import QuickStats from "../components/lineup/QuickStats";
import TeamSettings from "../components/lineup/TeamSettings";
import PlayerDetailsEditor from "../components/lineup/PlayerDetailsEditor";
import NewPhaseModal from "../components/lineup/NewPhaseModal";

export default function Home() {
  return (
    <LineupProvider>
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
      </div>
    </LineupProvider>
  );
}
