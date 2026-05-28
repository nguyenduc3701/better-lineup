"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { translations, SupportedLang, Translations } from "../app/translations";
import { Player, Formation, PhaseData, Motion, BallMove } from "../types";
import { getFormationPositions } from "../utils/formation";
import { DEFAULT_NAMES_A, DEFAULT_NAMES_B } from "../constants";

interface LineupContextType {
  activeLang: SupportedLang;
  setActiveLang: (lang: SupportedLang) => void;
  t: Translations;
  teamAColor: string;
  setTeamAColor: (color: string) => void;
  teamBColor: string;
  setTeamBColor: (color: string) => void;
  formationA: Formation;
  setFormationA: (f: Formation) => void;
  formationB: Formation;
  setFormationB: (f: Formation) => void;
  colorError: string | null;
  setColorError: (err: string | null) => void;
  showZones: boolean;
  setShowZones: (show: boolean) => void;
  activeConfigTab: "A" | "B";
  setActiveConfigTab: (tab: "A" | "B") => void;
  phases: Record<string, PhaseData>;
  setPhases: React.Dispatch<React.SetStateAction<Record<string, PhaseData>>>;
  activePhase: string;
  setActivePhase: (phase: string) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedPlayerId: string | null;
  setSelectedPlayerId: (id: string | null) => void;
  isNewPhaseModalOpen: boolean;
  setIsNewPhaseModalOpen: (open: boolean) => void;
  newPhaseNameInput: string;
  setNewPhaseNameInput: (name: string) => void;
  newPhaseCategoryInput: "Attack" | "Defence" | "Custom";
  setNewPhaseCategoryInput: (cat: "Attack" | "Defence" | "Custom") => void;
  newPhaseError: string | null;
  setNewPhaseError: (err: string | null) => void;
  showTeamMotions: boolean;
  setShowTeamMotions: (show: boolean) => void;
  animationState: "idle" | "playing" | "finished";
  playMode: string;
  setPlayMode: (mode: string) => void;
  ball: { x: number; y: number; attachedPlayerId: string | null };
  setBall: React.Dispatch<React.SetStateAction<{ x: number; y: number; attachedPlayerId: string | null }>>;
  
  pitchRef: React.RefObject<HTMLDivElement | null>;
  draggingBall: React.MutableRefObject<boolean>;
  draggingPlayerId: React.MutableRefObject<string | null>;
  draggingControlPoint: React.MutableRefObject<{ playerId: string; motionId: string } | null>;
  draggingDraftControlPlayerId: React.MutableRefObject<string | null>;
  
  getOrderedPhaseNames: (currentPhasesMap: Record<string, PhaseData>) => string[];
  getOppositePhaseName: (pName: string) => string;
  propagatePositions: (currentPhasesMap: Record<string, PhaseData>) => Record<string, PhaseData>;
  getMergedPlayersForEditing: (phaseName: string, activeTab: "A" | "B", phasesMap: Record<string, PhaseData>) => Player[];
  savePlayersToPhases: (updatedPlayers: Player[], phaseName: string, activeTab: "A" | "B", currentPhases: Record<string, PhaseData>) => Record<string, PhaseData>;
  saveAndPropagate: (nextPlayers: Player[]) => void;
  handleTabChange: (newTab: "A" | "B") => void;
  handlePhaseChange: (newPhaseName: string) => void;
  handleConfirmCreatePhase: () => void;
  startAnimation: () => void;
  stopAndResetAnimation: () => void;
  resetPlayersPositions: () => void;
  handleMouseDown: (playerId: string) => void;
  handleControlPointMouseDown: (playerId: string, motionId: string) => void;
  handleDraftControlMouseDown: (playerId: string) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUpOrLeave: () => void;
  handleColorChange: (team: "A" | "B", hexColor: string) => void;
  handleStartMotion: (playerId: string) => void;
  handleSaveMotion: (playerId: string) => void;
  handleCancelMotion: (playerId: string) => void;
  handleDeleteMotion: (playerId: string) => void;
  handleNameChange: (playerId: string, newName: string) => void;
  handleNumberChange: (playerId: string, newNumber: number) => void;
  handleToggleHighlight: (playerId: string) => void;
  handleFormationChange: (team: "A" | "B", formation: Formation) => void;
  // Ball pass feature
  phaseBallMoves: BallMove[];
  handleClearBallMoves: () => void;
  MAX_BALL_MOVES: number;
}

const LineupContext = createContext<LineupContextType | undefined>(undefined);

export const LineupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLang, setActiveLang] = useState<SupportedLang>("en");
  const t = translations[activeLang];

  const [teamAColor, setTeamAColor] = useState("#e11d48"); // Rose-600
  const [teamBColor, setTeamBColor] = useState("#2563eb"); // Blue-600
  const [formationA, setFormationA] = useState<Formation>("4-4-2");
  const [formationB, setFormationB] = useState<Formation>("4-4-2");
  const [colorError, setColorError] = useState<string | null>(null);
  const [showZones, setShowZones] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<"A" | "B">("A");
  
  const [phases, setPhases] = useState<Record<string, PhaseData>>({});
  const [activePhase, setActivePhase] = useState<string>("Starting Lineup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const [isNewPhaseModalOpen, setIsNewPhaseModalOpen] = useState(false);
  const [newPhaseNameInput, setNewPhaseNameInput] = useState("");
  const [newPhaseCategoryInput, setNewPhaseCategoryInput] = useState<"Attack" | "Defence" | "Custom">("Attack");
  const [newPhaseError, setNewPhaseError] = useState<string | null>(null);
  const [showTeamMotions, setShowTeamMotions] = useState(false);

  const MAX_BALL_MOVES = 10;

  const animationFrameRef = useRef<number | null>(null);
  const ballAnimFrameRef = useRef<number | null>(null);
  const animationTimeoutRef = useRef<any>(null);
  const playNextTimeoutRef = useRef<any>(null);
  const startTimeoutRef = useRef<any>(null);
  const savedBasePlayers = useRef<Player[] | null>(null);
  const [animationState, setAnimationState] = useState<"idle" | "playing" | "finished">("idle");
  const [playMode, setPlayMode] = useState<string>("ALL");
  const animPhasesList = useRef<string[]>([]);
  const currentAnimPhaseIndex = useRef<number>(0);
  const savedActivePhaseBeforeAnim = useRef<string | null>(null);

  const pitchRef = useRef<HTMLDivElement | null>(null);
  const draggingPlayerId = useRef<string | null>(null);
  const draggingControlPoint = useRef<{
    playerId: string;
    motionId: string;
  } | null>(null);
  const draggingDraftControlPlayerId = useRef<string | null>(null);
  const initialDragState = useRef<{
    x: number;
    y: number;
    motion: Motion | null;
  } | null>(null);

  const [ball, setBall] = useState<{ x: number; y: number; attachedPlayerId: string | null }>({
    x: 50,
    y: 50,
    attachedPlayerId: null
  });
  const draggingBall = useRef(false);

  const phaseBallMoves = useMemo(() => {
    const currentPhase = phases[activePhase];
    return currentPhase?.ballMoves || [];
  }, [phases, activePhase]);

  const handleClearBallMoves = useCallback(() => {
    setPhases(currentPhases => {
      const currentPhase = currentPhases[activePhase];
      if (!currentPhase) return currentPhases;
      return {
        ...currentPhases,
        [activePhase]: {
          ...currentPhase,
          ballMoves: []
        }
      };
    });
  }, [activePhase]);

  useEffect(() => {
    if (ball.attachedPlayerId && !draggingBall.current) {
      const holder = players.find(p => p.id === ball.attachedPlayerId);
      if (holder) {
        setBall(prev => {
          if (prev.x !== holder.x || prev.y !== holder.y) {
            return { ...prev, x: holder.x, y: holder.y };
          }
          return prev;
        });
      }
    }
  }, [players, ball.attachedPlayerId]);

  // Initialize phases & players
  useEffect(() => {
    const initialPlayers = () => {
      const pList: Player[] = [];
      const posA = getFormationPositions("4-4-2", "A");
      posA.forEach((pos, idx) => {
        pList.push({
          ...pos,
          name: DEFAULT_NAMES_A[idx] || `Player A${idx + 1}`,
          number: idx + 1,
          team: "A",
          isSubstitute: false,
        });
      });
      for (let idx = 0; idx < 7; idx++) {
        pList.push({
          id: `A-sub-${idx}`,
          name: DEFAULT_NAMES_A[11 + idx] || `Sub A${idx + 1}`,
          number: 12 + idx,
          team: "A",
          x: 0,
          y: 0,
          isSubstitute: true,
          motion: null
        });
      }

      const posB = getFormationPositions("4-4-2", "B");
      posB.forEach((pos, idx) => {
        pList.push({
          ...pos,
          name: DEFAULT_NAMES_B[idx] || `Player B${idx + 1}`,
          number: idx + 1,
          team: "B",
          isSubstitute: false,
        });
      });
      for (let idx = 0; idx < 7; idx++) {
        pList.push({
          id: `B-sub-${idx}`,
          name: DEFAULT_NAMES_B[11 + idx] || `Sub B${idx + 1}`,
          number: 12 + idx,
          team: "B",
          x: 0,
          y: 0,
          isSubstitute: true,
          motion: null
        });
      }
      return pList;
    };

    const initialPhasesMap: Record<string, PhaseData> = {};

    initialPhasesMap["Starting Lineup"] = {
      formationA: "4-4-2",
      formationB: "4-4-2",
      players: initialPlayers(),
      category: "Custom",
      ballMoves: []
    };

    ["1. Build-up", "2. Progression", "3. Finishing", "1. Pressing", "2. Mid-block", "3. Deep Defence"].forEach((phaseName) => {
      let category: "Attack" | "Defence" | "Custom" = "Custom";
      if (["1. Build-up", "2. Progression", "3. Finishing"].includes(phaseName)) {
        category = "Attack";
      } else if (["1. Pressing", "2. Mid-block", "3. Deep Defence"].includes(phaseName)) {
        category = "Defence";
      }
      initialPhasesMap[phaseName] = {
        formationA: "4-4-2",
        formationB: "4-4-2",
        players: initialPlayers(),
        category,
        ballMoves: []
      };
    });

    setPhases(initialPhasesMap);
    setPlayers(initialPhasesMap["Starting Lineup"].players);
  }, []);

  const getOrderedPhaseNames = useCallback((currentPhasesMap: Record<string, PhaseData>) => {
    const defaultOrder = ["Starting Lineup", "1. Build-up", "2. Progression", "3. Finishing", "1. Pressing", "2. Mid-block", "3. Deep Defence"];
    const allKeys = Object.keys(currentPhasesMap);
    return allKeys.sort((a, b) => {
      const idxA = defaultOrder.indexOf(a);
      const idxB = defaultOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, []);

  const getOppositePhaseName = useCallback((pName: string) => {
    if (pName === "Starting Lineup") return "Starting Lineup";

    const directMap: Record<string, string> = {
      "1. Build-up": "1. Pressing",
      "2. Progression": "2. Mid-block",
      "3. Finishing": "3. Deep Defence",
      "1. Pressing": "1. Build-up",
      "2. Mid-block": "2. Progression",
      "3. Deep Defence": "3. Finishing"
    };

    if (directMap[pName] && phases[directMap[pName]]) {
      return directMap[pName];
    }

    const order = getOrderedPhaseNames(phases);
    const attackPhases = order.filter(name => phases[name]?.category === "Attack");
    const defencePhases = order.filter(name => phases[name]?.category === "Defence");

    const currentPhase = phases[pName];
    if (!currentPhase) return pName;

    if (currentPhase.category === "Attack") {
      const idx = attackPhases.indexOf(pName);
      if (defencePhases.length === 0) return pName;
      const targetIdx = Math.min(idx, defencePhases.length - 1);
      return defencePhases[targetIdx];
    } else if (currentPhase.category === "Defence") {
      const idx = defencePhases.indexOf(pName);
      if (attackPhases.length === 0) return pName;
      const targetIdx = Math.min(idx, attackPhases.length - 1);
      return attackPhases[targetIdx];
    }

    return pName;
  }, [phases, getOrderedPhaseNames]);

  const propagatePositions = useCallback((currentPhasesMap: Record<string, PhaseData>): Record<string, PhaseData> => {
    const updated = { ...currentPhasesMap };

    const allKeys = Object.keys(updated);
    for (const key of allKeys) {
      if (updated[key]) {
        updated[key] = {
          ...updated[key],
          players: JSON.parse(JSON.stringify(updated[key].players)),
        };
      }
    }

    const lineupPhase = updated["Starting Lineup"];
    if (!lineupPhase) return updated;

    const propagateChain = (chain: string[]) => {
      for (let i = 0; i < chain.length; i++) {
        const currPhaseName = chain[i];
        const currPhase = updated[currPhaseName];
        if (!currPhase) continue;

        const prevPhaseName = i === 0 ? "Starting Lineup" : chain[i - 1];
        const prevPhase = updated[prevPhaseName];
        if (!prevPhase) continue;

        currPhase.players = currPhase.players.map((currP) => {
          const prevP = prevPhase.players.find((p) => p.id === currP.id);
          if (!prevP) return currP;

          const prevEnd = prevP.motion ? prevP.motion.end : { x: prevP.x, y: prevP.y };

          let updatedMotion = currP.motion;
          if (updatedMotion) {
            updatedMotion = {
              ...updatedMotion,
              start: { x: prevEnd.x, y: prevEnd.y },
            };
          }

          return {
            ...currP,
            // Propagate substitution & goalkeeper status from previous phase
            // so that player swaps in earlier phases carry through to later phases
            isSubstitute: prevP.isSubstitute,
            isGoalkeeper: prevP.isGoalkeeper,
            x: prevEnd.x,
            y: prevEnd.y,
            motion: updatedMotion,
          };
        });
      }
    };

    const order = getOrderedPhaseNames(updated);
    const attackChain = order.filter(name => updated[name]?.category === "Attack" && name !== "Starting Lineup");
    const defenceChain = order.filter(name => updated[name]?.category === "Defence" && name !== "Starting Lineup");

    propagateChain(attackChain);
    propagateChain(defenceChain);

    const customChain = order.filter(name => updated[name]?.category === "Custom" && name !== "Starting Lineup");
    propagateChain(customChain);

    return updated;
  }, [getOrderedPhaseNames]);

  const getMergedPlayersForEditing = useCallback((
    phaseName: string,
    activeTab: "A" | "B",
    phasesMap: Record<string, PhaseData>
  ): Player[] => {
    const targetPhase = phasesMap[phaseName];
    if (!targetPhase) return [];

    const oppositePhaseName = getOppositePhaseName(phaseName);
    const oppPhase = phasesMap[oppositePhaseName] || targetPhase;

    return targetPhase.players.map((p) => {
      if (targetPhase.category === "Custom") {
        return JSON.parse(JSON.stringify(p));
      }

      if (targetPhase.category === "Attack") {
        const rawPlayer = p.team === "A"
          ? p
          : (oppPhase.players.find((op) => op.id === p.id) || p);
        const copy = JSON.parse(JSON.stringify(rawPlayer));
        if (copy.motion) {
          copy.x = copy.motion.end.x;
          copy.y = copy.motion.end.y;
        }
        return copy;
      }

      if (targetPhase.category === "Defence") {
        const rawPlayer = p.team === "B"
          ? p
          : (oppPhase.players.find((op) => op.id === p.id) || p);
        const copy = JSON.parse(JSON.stringify(rawPlayer));
        if (copy.motion) {
          copy.x = copy.motion.end.x;
          copy.y = copy.motion.end.y;
        }
        return copy;
      }

      return JSON.parse(JSON.stringify(p));
    });
  }, [getOppositePhaseName]);

  const adjustPlayerMotionAndPosition = useCallback((currP: Player, prevP: Player | undefined): Player => {
    if (!prevP) return currP;
    const prevEnd = prevP.motion ? prevP.motion.end : { x: prevP.x, y: prevP.y };
    
    const dx = currP.x - prevEnd.x;
    const dy = currP.y - prevEnd.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 0.5) {
      const newMotion: Motion = {
        id: currP.motion?.id || Math.random().toString(36).substring(2, 9),
        start: { x: prevEnd.x, y: prevEnd.y },
        end: { x: currP.x, y: currP.y },
        control: currP.motion?.control || { x: (prevEnd.x + currP.x) / 2, y: (prevEnd.y + currP.y) / 2 }
      };
      return {
        ...currP,
        x: prevEnd.x,
        y: prevEnd.y,
        motion: newMotion,
        motionStart: null,
        motionDraftControl: null
      };
    } else {
      if (currP.motion) {
        return {
          ...currP,
          x: prevEnd.x,
          y: prevEnd.y,
          motion: {
            ...currP.motion,
            start: { x: prevEnd.x, y: prevEnd.y },
            end: { x: prevEnd.x + dx, y: prevEnd.y + dy }
          },
          motionStart: null,
          motionDraftControl: null
        };
      }
      return {
        ...currP,
        x: prevEnd.x,
        y: prevEnd.y,
        motion: null,
        motionStart: null,
        motionDraftControl: null
      };
    }
  }, []);

  const savePlayersToPhases = useCallback((
    updatedPlayers: Player[],
    phaseName: string,
    activeTab: "A" | "B",
    currentPhases: Record<string, PhaseData>
  ): Record<string, PhaseData> => {
    const oppPhaseName = getOppositePhaseName(phaseName);
    const targetPhase = currentPhases[phaseName];
    const oppPhase = currentPhases[oppPhaseName];
    
    if (!targetPhase) return currentPhases;

    const order = getOrderedPhaseNames(currentPhases);
    const targetChain = order.filter(name => currentPhases[name]?.category === targetPhase.category || name === "Starting Lineup");
    const targetIdx = targetChain.indexOf(phaseName);
    const prevTargetPhaseName = targetIdx > 0 ? targetChain[targetIdx - 1] : null;
    const prevTargetPhase = prevTargetPhaseName ? currentPhases[prevTargetPhaseName] : null;

    const isCustom = targetPhase.category === "Custom";
    const targetTeam = targetPhase.category === "Attack" ? "A" : "B";

    const nextTargetPlayers = targetPhase.players.map((p) => {
      if (isCustom || p.team === targetTeam) {
        const match = updatedPlayers.find((up) => up.id === p.id);
        if (!match) return p;

        if (phaseName === "Starting Lineup" || !prevTargetPhase || match.isGoalkeeper) {
          return JSON.parse(JSON.stringify(match));
        }

        const prevP = prevTargetPhase.players.find(prev => prev.id === p.id);
        return adjustPlayerMotionAndPosition(match, prevP);
      }
      return p;
    });

    let nextOppPlayers = oppPhase ? oppPhase.players : [];
    if (oppPhase && oppPhaseName !== phaseName) {
      const oppChain = order.filter(name => currentPhases[name]?.category === oppPhase.category || name === "Starting Lineup");
      const oppIdx = oppChain.indexOf(oppPhaseName);
      const prevOppPhaseName = oppIdx > 0 ? oppChain[oppIdx - 1] : null;
      const prevOppPhase = prevOppPhaseName ? currentPhases[prevOppPhaseName] : null;

      const oppTeam = targetTeam === "A" ? "B" : "A";

      nextOppPlayers = oppPhase.players.map((p) => {
        if (p.team === oppTeam) {
          const match = updatedPlayers.find((up) => up.id === p.id);
          if (!match) return p;

          if (oppPhaseName === "Starting Lineup" || !prevOppPhase || match.isGoalkeeper) {
            return JSON.parse(JSON.stringify(match));
          }

          const prevP = prevOppPhase.players.find(prev => prev.id === p.id);
          return adjustPlayerMotionAndPosition(match, prevP);
        }
        return p;
      });
    }

    let nextPhases = {
      ...currentPhases,
      [phaseName]: {
        ...targetPhase,
        players: nextTargetPlayers
      }
    };

    if (oppPhase && oppPhaseName !== phaseName) {
      nextPhases = {
        ...nextPhases,
        [oppPhaseName]: {
          ...oppPhase,
          players: nextOppPlayers
        }
      };
    }
    return nextPhases;
  }, [getOppositePhaseName, getOrderedPhaseNames, adjustPlayerMotionAndPosition]);

  const saveAndPropagate = useCallback((nextPlayers: Player[]) => {
    setPhases(currentPhases => {
      const updated = savePlayersToPhases(nextPlayers, activePhase, activeConfigTab, currentPhases);
      const propagated = propagatePositions(updated);
      
      const merged = getMergedPlayersForEditing(activePhase, activeConfigTab, propagated);
      setPlayers(merged);
      
      return propagated;
    });
  }, [activePhase, activeConfigTab, savePlayersToPhases, propagatePositions, getMergedPlayersForEditing]);

  const handleTabChange = useCallback((newTab: "A" | "B") => {
    setPhases(currentPhases => {
      const updatedPhases = savePlayersToPhases(players, activePhase, activeConfigTab, currentPhases);
      const propagated = propagatePositions(updatedPhases);
      setActiveConfigTab(newTab);
      const merged = getMergedPlayersForEditing(activePhase, newTab, propagated);
      setPlayers(merged);
      setSelectedPlayerId(null);
      return propagated;
    });
  }, [players, activePhase, activeConfigTab, savePlayersToPhases, propagatePositions, getMergedPlayersForEditing]);

  const handlePhaseChange = useCallback((newPhaseName: string) => {
    if (newPhaseName === "CREATE_NEW") {
      setIsNewPhaseModalOpen(true);
      setNewPhaseNameInput("");
      setNewPhaseCategoryInput("Attack");
      setNewPhaseError(null);
      return;
    }

    setPhases(currentPhases => {
      const updatedPhases = savePlayersToPhases(players, activePhase, activeConfigTab, currentPhases);
      const propagated = propagatePositions(updatedPhases);

      const targetPhase = propagated[newPhaseName];
      if (targetPhase) {
        setFormationA(targetPhase.formationA);
        setFormationB(targetPhase.formationB);
        const merged = getMergedPlayersForEditing(newPhaseName, activeConfigTab, propagated);
        setPlayers(merged);
        setActivePhase(newPhaseName);
        setSelectedPlayerId(null);

        // Restore ball state for the new phase
        if (newPhaseName !== "Starting Lineup") {
          const moves = targetPhase.ballMoves || [];

          if (moves.length > 0) {
            // Ball is at the last recipient
            const lastHolder = moves[moves.length - 1].toPlayerId;
            const holderPlayer = merged.find(p => p.id === lastHolder);
            if (holderPlayer) {
              setBall({ x: holderPlayer.x, y: holderPlayer.y, attachedPlayerId: lastHolder });
            }
          } else {
            // Scan backwards for a previous phase that has ball moves recorded
            const ordered = getOrderedPhaseNames(propagated);
            const currentIndex = ordered.indexOf(newPhaseName);
            let foundHolderId: string | null = null;

            for (let i = currentIndex - 1; i >= 0; i--) {
              const prevPhaseName = ordered[i];
              if (prevPhaseName === "Starting Lineup") continue;
              const prevPhase = propagated[prevPhaseName];
              if (prevPhase && prevPhase.ballMoves && prevPhase.ballMoves.length > 0) {
                foundHolderId = prevPhase.ballMoves[prevPhase.ballMoves.length - 1].toPlayerId;
                break;
              }
            }

            const holderPlayer = foundHolderId ? merged.find(p => p.id === foundHolderId) : null;
            if (holderPlayer) {
              setBall({ x: holderPlayer.x, y: holderPlayer.y, attachedPlayerId: holderPlayer.id });
            } else {
              // Default to goalkeeper (e.g. if we are in "1. Build-up" or no prior moves exist)
              const gk = merged.find(p => p.team === "A" && p.isGoalkeeper && !p.isSubstitute);
              if (gk) {
                setBall({ x: gk.x, y: gk.y, attachedPlayerId: gk.id });
              }
            }
          }
        }
      }
      return propagated;
    });
  }, [players, activePhase, activeConfigTab, savePlayersToPhases, propagatePositions, getMergedPlayersForEditing, getOrderedPhaseNames]);


  const handleConfirmCreatePhase = useCallback(() => {
    const cleanName = newPhaseNameInput.trim();
    if (!cleanName) {
      setNewPhaseError(t.errEmptyName);
      return;
    }

    setPhases(currentPhases => {
      const updatedPhases = savePlayersToPhases(players, activePhase, activeConfigTab, currentPhases);

      if (updatedPhases[cleanName]) {
        setNewPhaseError(t.errPhaseExists);
        return currentPhases;
      }

      const newPhaseData: PhaseData = {
        formationA,
        formationB,
        players: players.map(p => ({
          ...p,
          motion: p.motion ? JSON.parse(JSON.stringify(p.motion)) : null,
          motionStart: null,
          motionDraftControl: null
        })),
        category: newPhaseCategoryInput,
        ballMoves: []
      };

      const withNewPhase = { ...updatedPhases, [cleanName]: newPhaseData };
      const propagated = propagatePositions(withNewPhase);

      setActivePhase(cleanName);
      const targetPhase = propagated[cleanName];
      if (targetPhase) {
        const merged = getMergedPlayersForEditing(cleanName, activeConfigTab, propagated);
        setPlayers(merged);
      }
      setSelectedPlayerId(null);
      setIsNewPhaseModalOpen(false);
      setNewPhaseNameInput("");
      setNewPhaseError(null);
      
      return propagated;
    });
  }, [newPhaseNameInput, players, activePhase, activeConfigTab, formationA, formationB, newPhaseCategoryInput, t, savePlayersToPhases, propagatePositions, getMergedPlayersForEditing]);

  const stopAndResetAnimation = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (ballAnimFrameRef.current) {
      cancelAnimationFrame(ballAnimFrameRef.current);
      ballAnimFrameRef.current = null;
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    if (playNextTimeoutRef.current) {
      clearTimeout(playNextTimeoutRef.current);
      playNextTimeoutRef.current = null;
    }
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }
    if (savedBasePlayers.current) {
      setPlayers(savedBasePlayers.current);
    }
    if (savedActivePhaseBeforeAnim.current) {
      const target = phases[savedActivePhaseBeforeAnim.current];
      if (target) {
        setFormationA(target.formationA);
        setFormationB(target.formationB);
        setPlayers(target.players);
        setActivePhase(savedActivePhaseBeforeAnim.current);
      }
    }
    setAnimationState("idle");
  }, [phases]);


  const resetPlayersPositions = useCallback(() => {
    const target = phases["Starting Lineup"];
    if (target) {
      setFormationA(target.formationA);
      setFormationB(target.formationB);
      
      const merged = getMergedPlayersForEditing("Starting Lineup", activeConfigTab, phases);
      setPlayers(merged);
      setActivePhase("Starting Lineup");
    }
    setAnimationState("idle");
  }, [phases, activeConfigTab, getMergedPlayersForEditing]);

  const phasesRef = useRef(phases);
  useEffect(() => {
    phasesRef.current = phases;
  }, [phases]);

  const activeConfigTabRef = useRef(activeConfigTab);
  useEffect(() => {
    activeConfigTabRef.current = activeConfigTab;
  }, [activeConfigTab]);

  const playNextPhaseInSequenceRef = useRef<((phasesMap?: Record<string, PhaseData>) => void) | null>(null);

  const runSinglePhaseAnim = useCallback((initialPhasePlayers: Player[]) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (ballAnimFrameRef.current) {
      cancelAnimationFrame(ballAnimFrameRef.current);
    }
    const phaseName = animPhasesList.current[currentAnimPhaseIndex.current];
    const isLineup = phaseName === "Starting Lineup";
    const duration = isLineup ? 1000 : 2000;
    const startTime = performance.now();

    const targetPhase = phasesRef.current[phaseName];
    const isAttack = targetPhase?.category === "Attack";
    let isLastAttackPhase = false;
    if (isAttack) {
      isLastAttackPhase = true;
      for (let i = currentAnimPhaseIndex.current + 1; i < animPhasesList.current.length; i++) {
        const nextPhaseName = animPhasesList.current[i];
        const nextPhase = phasesRef.current[nextPhaseName];
        if (nextPhase && nextPhase.category === "Attack") {
          isLastAttackPhase = false;
          break;
        }
      }
    }

    const playNext = () => {
      if (animPhasesList.current.length > 1 && currentAnimPhaseIndex.current < animPhasesList.current.length - 1) {
        currentAnimPhaseIndex.current += 1;
        if (playNextTimeoutRef.current) clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = setTimeout(() => {
          playNextPhaseInSequenceRef.current?.();
        }, 450);
      } else {
        setAnimationState("finished");
      }
    };

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      const easeT = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // 1. Calculate player positions at the current timestamp
      const currentPlayers = initialPhasePlayers.map((p) => {
        if (!p.motion) return p;

        const start = p.motion.start;
        const ctrl = p.motion.control || {
          x: (start.x + p.motion.end.x) / 2,
          y: (start.y + p.motion.end.y) / 2,
        };
        const end = p.motion.end;

        const mt = 1 - easeT;
        const x = mt * mt * start.x + 2 * mt * easeT * ctrl.x + easeT * easeT * end.x;
        const y = mt * mt * start.y + 2 * mt * easeT * ctrl.y + easeT * easeT * end.y;

        return { ...p, x, y };
      });

      setPlayers(currentPlayers);

      // 2. Animate ball positions simultaneously
      const ballMoves = (!isLineup && targetPhase) ? (targetPhase.ballMoves || []) : [];

      if (ballMoves.length > 0) {
        const totalSegments = ballMoves.length + (isLastAttackPhase ? 1 : 0);
        const segmentSize = 1 / totalSegments;
        const segmentIndex = Math.min(totalSegments - 1, Math.floor(progress / segmentSize));
        const segmentProgress = (progress - (segmentIndex * segmentSize)) / segmentSize;

        if (segmentIndex < ballMoves.length) {
          const move = ballMoves[segmentIndex];
          const fromPlayer = currentPlayers.find(p => p.id === move.fromPlayerId);
          const toPlayer = currentPlayers.find(p => p.id === move.toPlayerId);

          if (fromPlayer && toPlayer) {
            const ballX = fromPlayer.x + (toPlayer.x - fromPlayer.x) * segmentProgress;
            const ballY = fromPlayer.y + (toPlayer.y - fromPlayer.y) * segmentProgress;
            setBall({ x: ballX, y: ballY, attachedPlayerId: null });
          }
        } else {
          // Final shot segment
          const lastMove = ballMoves[ballMoves.length - 1];
          const lastHolder = currentPlayers.find(p => p.id === lastMove.toPlayerId);
          if (lastHolder) {
            const targetGoalX = lastHolder.team === "A" ? 99 : 1;
            const targetGoalY = 50;
            const ballX = lastHolder.x + (targetGoalX - lastHolder.x) * segmentProgress;
            const ballY = lastHolder.y + (targetGoalY - lastHolder.y) * segmentProgress;
            setBall({ x: ballX, y: ballY, attachedPlayerId: null });
          }
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation finished
        if (ballMoves.length > 0) {
          if (isLastAttackPhase) {
            const lastMove = ballMoves[ballMoves.length - 1];
            const lastHolder = currentPlayers.find(p => p.id === lastMove.toPlayerId);
            const targetGoalX = lastHolder && lastHolder.team === "A" ? 99 : 1;
            setBall({ x: targetGoalX, y: 50, attachedPlayerId: null });
          } else {
            const lastMove = ballMoves[ballMoves.length - 1];
            const toPlayer = currentPlayers.find(p => p.id === lastMove.toPlayerId);
            if (toPlayer) {
              setBall({ x: toPlayer.x, y: toPlayer.y, attachedPlayerId: toPlayer.id });
            }
          }
        }
        
        if (playNextTimeoutRef.current) clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = setTimeout(() => {
          playNext();
        }, 300);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const playNextPhaseInSequence = useCallback((phasesMap?: Record<string, PhaseData>) => {
    const activePhases = phasesMap || phasesRef.current;
    const phaseName = animPhasesList.current[currentAnimPhaseIndex.current];
    if (!phaseName) {
      setAnimationState("finished");
      return;
    }

    const oppositePhaseName = getOppositePhaseName(phaseName);
    const targetPhase = activePhases[phaseName];
    const oppPhase = activePhases[oppositePhaseName] || targetPhase;
    if (!targetPhase) {
      setAnimationState("finished");
      return;
    }

    const isAttack = targetPhase.category === "Attack";
    const isDefence = targetPhase.category === "Defence";

    if (isAttack) {
      setFormationA(targetPhase.formationA);
      setFormationB(oppPhase.formationB);
    } else if (isDefence) {
      setFormationA(oppPhase.formationA);
      setFormationB(targetPhase.formationB);
    } else {
      setFormationA(targetPhase.formationA);
      setFormationB(targetPhase.formationB);
    }

    const activeTeam = isDefence ? "B" : "A";

    const mergedPlayers = targetPhase.players.map((p) => {
      if (targetPhase.category === "Custom" || p.team === activeTeam) {
        return JSON.parse(JSON.stringify(p));
      } else {
        const oppPlayer = oppPhase.players.find((op) => op.id === p.id);
        return oppPlayer ? JSON.parse(JSON.stringify(oppPlayer)) : JSON.parse(JSON.stringify(p));
      }
    });

    setPlayers(mergedPlayers);
    setActivePhase(phaseName);

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      runSinglePhaseAnim(mergedPlayers);
    }, 200);
  }, [getOppositePhaseName, runSinglePhaseAnim]);

  useEffect(() => {
    playNextPhaseInSequenceRef.current = playNextPhaseInSequence;
  }, [playNextPhaseInSequence]);

  const startAnimation = useCallback(() => {
    if (animationState === "playing") {
      stopAndResetAnimation();
      return;
    }

    if (animationState === "finished") {
      resetPlayersPositions();
      return;
    }

    // Compute propagated phases OUTSIDE the setPhases updater.
    // Using phasesRef.current ensures we get the latest phases without
    // calling setState inside another setState updater (React anti-pattern
    // that causes double-invocation in Strict Mode, breaking the animation).
    const updatedPhases = savePlayersToPhases(players, activePhase, activeConfigTab, phasesRef.current);
    const propagated = propagatePositions(updatedPhases);

    savedBasePlayers.current = JSON.parse(JSON.stringify(players));
    savedActivePhaseBeforeAnim.current = activePhase;

    if (playMode === "ALL") {
      const attackList = ["1. Build-up", "2. Progression", "3. Finishing"];
      const defenceList = ["1. Pressing", "2. Mid-block", "3. Deep Defence"];
      animPhasesList.current = ["Starting Lineup", ...attackList, ...defenceList];
      currentAnimPhaseIndex.current = 0;
    } else if (playMode === "GROUP_Attack") {
      const list = getOrderedPhaseNames(propagated).filter(
        name => propagated[name]?.category === "Attack"
      );
      animPhasesList.current = ["Starting Lineup", ...list];
      currentAnimPhaseIndex.current = 0;
    } else if (playMode === "GROUP_Defence") {
      const list = getOrderedPhaseNames(propagated).filter(
        name => propagated[name]?.category === "Defence"
      );
      animPhasesList.current = ["Starting Lineup", ...list];
      currentAnimPhaseIndex.current = 0;
    } else if (playMode === "GROUP_Custom") {
      const list = getOrderedPhaseNames(propagated).filter(
        name => propagated[name]?.category === "Custom"
      );
      animPhasesList.current = ["Starting Lineup", ...list];
      currentAnimPhaseIndex.current = 0;
    } else {
      if (playMode === "Starting Lineup") {
        animPhasesList.current = ["Starting Lineup"];
      } else {
        animPhasesList.current = ["Starting Lineup", playMode];
      }
      currentAnimPhaseIndex.current = 0;
    }

    // Update phases state (plain value, not functional updater — no side effects inside)
    setPhases(propagated);

    // Set animation state and schedule first phase — OUTSIDE the setPhases updater
    setAnimationState("playing");

    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    startTimeoutRef.current = setTimeout(() => {
      playNextPhaseInSequence(propagated);
    }, 0);
  }, [animationState, players, activePhase, activeConfigTab, playMode, savePlayersToPhases, propagatePositions, getOrderedPhaseNames, playNextPhaseInSequence, stopAndResetAnimation, resetPlayersPositions]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (playNextTimeoutRef.current) clearTimeout(playNextTimeoutRef.current);
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    };
  }, []);

  const handleMouseDown = useCallback((playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player || player.team !== activeConfigTab) return;

    setSelectedPlayerId(playerId);
    
    if (player.isGoalkeeper) return;
    draggingPlayerId.current = playerId;
    initialDragState.current = {
      x: player.x,
      y: player.y,
      motion: player.motion ? JSON.parse(JSON.stringify(player.motion)) : null,
    };
  }, [players, activeConfigTab]);

  const handleControlPointMouseDown = useCallback((playerId: string, motionId: string) => {
    draggingControlPoint.current = { playerId, motionId };
  }, []);

  const handleDraftControlMouseDown = useCallback((playerId: string) => {
    draggingDraftControlPlayerId.current = playerId;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pitchRef.current) return;

    const rect = pitchRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    let pctX = Math.max(2, Math.min(98, (clientX / rect.width) * 100));
    let pctY = Math.max(2, Math.min(98, (clientY / rect.height) * 100));

    if (draggingBall.current) {
      setBall(prev => ({ ...prev, x: pctX, y: pctY }));
      return;
    }

    if (draggingPlayerId.current) {
      const playerId = draggingPlayerId.current;
      const draggedPlayer = players.find(p => p.id === playerId);
      if (draggedPlayer?.isSubstitute) {
        setPlayers(prev =>
          prev.map(p => {
            if (p.id !== playerId) return p;
            return { ...p, x: pctX, y: pctY };
          })
        );
        return;
      }
    }

    if (draggingDraftControlPlayerId.current) {
      const playerId = draggingDraftControlPlayerId.current;
      setPlayers(prev =>
        prev.map(p => {
          if (p.id !== playerId) return p;
          return { ...p, motionDraftControl: { x: pctX, y: pctY } };
        })
      );
      return;
    }

    if (draggingControlPoint.current) {
      const { playerId } = draggingControlPoint.current;
      setPlayers(prev =>
        prev.map(p => {
          if (p.id !== playerId || !p.motion) return p;
          return {
            ...p,
            motion: {
              ...p.motion,
              control: { x: pctX, y: pctY }
            }
          };
        })
      );
      return;
    }

    if (!draggingPlayerId.current || !initialDragState.current) return;

    const dx = pctX - initialDragState.current.x;
    const dy = pctY - initialDragState.current.y;

    setPlayers(prev =>
      prev.map(p => {
        if (p.id !== draggingPlayerId.current) return p;

        const m = initialDragState.current!.motion;
        const updatedMotion = p.motionStart || !m
          ? p.motion
          : {
              ...m,
              start: { x: m.start.x + dx, y: m.start.y + dy },
              end: { x: m.end.x + dx, y: m.end.y + dy },
              control: m.control ? { x: m.control.x + dx, y: m.control.y + dy } : null
            };

        const updatedDraftControl = p.motionStart
          ? { x: (p.motionStart.x + pctX) / 2, y: (p.motionStart.y + pctY) / 2 }
          : p.motionDraftControl;

        return {
          ...p,
          x: pctX,
          y: pctY,
          motion: updatedMotion,
          motionDraftControl: updatedDraftControl
        };
      })
    );
  }, [players]);

  const handleMouseUpOrLeave = useCallback(() => {
    const wasDraggingPlayer = !!draggingPlayerId.current;
    const wasDraggingControl = !!draggingControlPoint.current || !!draggingDraftControlPlayerId.current;

    if (draggingBall.current) {
      draggingBall.current = false;

      // Ball interaction is disabled in Starting Lineup
      if (activePhase === "Starting Lineup") {
        // Snap ball back to its attached player (if any)
        if (ball.attachedPlayerId) {
          const holder = players.find(p => p.id === ball.attachedPlayerId);
          if (holder) setBall(prev => ({ ...prev, x: holder.x, y: holder.y }));
        }
        return;
      }

      const dropX = ball.x;
      const dropY = ball.y;
      
      const activePlayerNear = players.find(p => 
        !p.isSubstitute && 
        Math.sqrt(Math.pow(p.x - dropX, 2) + Math.pow(p.y - dropY, 2)) < 5.0
      );

      if (activePlayerNear && activePlayerNear.id !== ball.attachedPlayerId) {
        const fromPlayerId = ball.attachedPlayerId;

        setBall({
          attachedPlayerId: activePlayerNear.id,
          x: activePlayerNear.x,
          y: activePlayerNear.y
        });

        // Record ball move if coming from another player and under limit
        if (fromPlayerId) {
          setPhases(currentPhases => {
            const phase = currentPhases[activePhase];
            if (!phase) return currentPhases;
            const existingMoves = phase.ballMoves || [];
            if (existingMoves.length >= MAX_BALL_MOVES) return currentPhases;
            const newMove: BallMove = {
              id: Math.random().toString(36).substring(2, 9),
              fromPlayerId,
              toPlayerId: activePlayerNear.id
            };
            return {
              ...currentPhases,
              [activePhase]: {
                ...phase,
                ballMoves: [...existingMoves, newMove]
              }
            };
          });
        }
      } else if (!activePlayerNear) {
        setBall(prev => ({ ...prev, attachedPlayerId: null }));
      }
    }

    
    if (draggingPlayerId.current) {
      const draggedId = draggingPlayerId.current;
      setPlayers(currentPlayers => {
        const draggedPlayer = currentPlayers.find(p => p.id === draggedId);
        let updatedPlayers = currentPlayers;

        if (draggedPlayer && !draggedPlayer.isSubstitute) {
          if (activePhase === "Starting Lineup") {
            const dropX = draggedPlayer.x;
            const dropY = draggedPlayer.y;
            
            const swapTarget = currentPlayers.find(p => 
              p.id !== draggedId &&
              !p.isSubstitute &&
              p.team === draggedPlayer.team &&
              Math.sqrt(Math.pow(p.x - dropX, 2) + Math.pow(p.y - dropY, 2)) < 5.0
            );

            if (swapTarget && initialDragState.current) {
              const originalX = initialDragState.current.x;
              const originalY = initialDragState.current.y;
              const targetX = swapTarget.x;
              const targetY = swapTarget.y;

              updatedPlayers = currentPlayers.map(p => {
                if (p.id === draggedId) {
                  return { ...p, x: targetX, y: targetY };
                }
                if (p.id === swapTarget.id) {
                  return { ...p, x: originalX, y: originalY };
                }
                return p;
              });
            }
          }
        } else if (draggedPlayer?.isSubstitute) {
          const dropX = draggedPlayer.x;
          const dropY = draggedPlayer.y;
          
          const activeTarget = currentPlayers.find(p => 
            !p.isSubstitute && 
            p.team === draggedPlayer.team && 
            Math.sqrt(Math.pow(p.x - dropX, 2) + Math.pow(p.y - dropY, 2)) < 5.0
          );

          if (activeTarget) {
            if (ball.attachedPlayerId === activeTarget.id) {
              setBall(prev => ({ ...prev, attachedPlayerId: draggedPlayer.id }));
            }
            updatedPlayers = currentPlayers.map(p => {
              if (p.id === activeTarget.id) {
                return {
                  ...p,
                  isSubstitute: true,
                  x: 0,
                  y: 0,
                  motion: null,
                  motionStart: null,
                  motionDraftControl: null,
                  isGoalkeeper: false
                };
              }
              if (p.id === draggedPlayer.id) {
                return {
                  ...p,
                  isSubstitute: false,
                  x: activeTarget.x,
                  y: activeTarget.y,
                  motion: null,
                  motionStart: null,
                  motionDraftControl: null,
                  isGoalkeeper: activeTarget.isGoalkeeper
                };
              }
              return p;
            });
          } else {
            updatedPlayers = currentPlayers.map(p => {
              if (p.id === draggedPlayer.id) {
                return { ...p, x: 0, y: 0 };
              }
              return p;
            });
          }
        }

        if (wasDraggingPlayer || wasDraggingControl) {
          saveAndPropagate(updatedPlayers);
        }
        return updatedPlayers;
      });
    } else {
      if (wasDraggingPlayer || wasDraggingControl) {
        setPlayers(currentPlayers => {
          saveAndPropagate(currentPlayers);
          return currentPlayers;
        });
      }
    }

    draggingPlayerId.current = null;
    draggingControlPoint.current = null;
    draggingDraftControlPlayerId.current = null;
  }, [activePhase, ball, players, saveAndPropagate]);

  const handleFormationChange = useCallback((team: "A" | "B", formation: Formation) => {
    let nextFormationA = formationA;
    let nextFormationB = formationB;
    if (team === "A") {
      setFormationA(formation);
      nextFormationA = formation;
    } else {
      setFormationB(formation);
      nextFormationB = formation;
    }

    const is7v7Formation = (f: Formation) => ["3-2-1", "2-3-1", "3-1-2", "2-1-2-1"].includes(f);
    const targetStartersCount = is7v7Formation(formation) ? 7 : 11;

    setPlayers(prev => {
      const otherTeamPlayers = prev.filter(p => p.team !== team);
      const targetTeamPlayers = prev.filter(p => p.team === team);

      // Separate current starters and substitutes for this team
      let currentStarters = targetTeamPlayers.filter(p => !p.isSubstitute);
      let currentSubs = targetTeamPlayers.filter(p => p.isSubstitute);

      // Adjust the starter count to match targetStartersCount
      if (currentStarters.length > targetStartersCount) {
        // Demote excess starters to substitutes, prioritizing keeping goalkeepers as starters
        currentStarters.sort((a, b) => {
          if (a.isGoalkeeper && !b.isGoalkeeper) return -1;
          if (!a.isGoalkeeper && b.isGoalkeeper) return 1;
          return a.number - b.number;
        });

        const keepers = currentStarters.slice(0, targetStartersCount);
        const demoted = currentStarters.slice(targetStartersCount).map(p => ({
          ...p,
          isSubstitute: true,
          x: 0,
          y: 0,
          motion: null,
          motionStart: null,
          motionDraftControl: null
        }));

        currentStarters = keepers;
        currentSubs = [...currentSubs, ...demoted];
      } else if (currentStarters.length < targetStartersCount) {
        // Promote substitutes to starters
        const promoteCount = targetStartersCount - currentStarters.length;
        const toPromote = currentSubs.slice(0, promoteCount).map(p => ({
          ...p,
          isSubstitute: false
        }));

        currentStarters = [...currentStarters, ...toPromote];
        currentSubs = currentSubs.slice(promoteCount);
      }

      const newPositions = getFormationPositions(formation, team);
      const unmatchedPositions = [...newPositions];
      const startersCopy = currentStarters.map(p => ({ ...p }));
      const updatedStarters: Player[] = [];

      for (const player of startersCopy) {
        let bestIdx = 0;
        let minDistance = Infinity;
        
        for (let i = 0; i < unmatchedPositions.length; i++) {
          const pos = unmatchedPositions[i];
          const dx = pos.x - player.x;
          const dy = pos.y - player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
            bestIdx = i;
          }
        }

        const [matchedPos] = unmatchedPositions.splice(bestIdx, 1);
        const finalPos = matchedPos || { x: 50, y: 50 };
        const isGK = matchedPos?.isGoalkeeper || false;

        if (player.motion) {
          updatedStarters.push({
            ...player,
            isGoalkeeper: isGK
          });
          continue;
        }

        if (player.isGoalkeeper || activePhase === "Starting Lineup") {
          updatedStarters.push({
            ...player,
            x: finalPos.x,
            y: finalPos.y,
            isGoalkeeper: isGK,
            motionStart: null,
            motion: null
          });
          continue;
        }

        const dx = finalPos.x - player.x;
        const dy = finalPos.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.1) {
          updatedStarters.push({
            ...player,
            x: finalPos.x,
            y: finalPos.y,
            isGoalkeeper: isGK,
            motionStart: null,
            motion: null
          });
        } else {
          const newMotion: Motion = {
            id: Math.random().toString(36).substring(2, 9),
            start: { x: player.x, y: player.y },
            end: { x: finalPos.x, y: finalPos.y },
            control: { x: (player.x + finalPos.x) / 2, y: (player.y + finalPos.y) / 2 }
          };

          updatedStarters.push({
            ...player,
            x: finalPos.x,
            y: finalPos.y,
            isGoalkeeper: isGK,
            motion: newMotion,
            motionStart: null,
            motionDraftControl: null
          });
        }
      }

      const nextPlayers = [...otherTeamPlayers, ...updatedStarters, ...currentSubs];

      setPhases(currentPhases => {
        const updated = savePlayersToPhases(nextPlayers, activePhase, activeConfigTab, currentPhases);
        const oppPhaseName = getOppositePhaseName(activePhase);
        if (updated[activePhase]) {
          updated[activePhase] = {
            ...updated[activePhase],
            formationA: nextFormationA,
            formationB: nextFormationB
          };
        }
        if (updated[oppPhaseName] && oppPhaseName !== activePhase) {
          updated[oppPhaseName] = {
            ...updated[oppPhaseName],
            formationA: nextFormationA,
            formationB: nextFormationB
          };
        }
        return propagatePositions(updated);
      });

      return nextPlayers;
    });
  }, [activePhase, activeConfigTab, formationA, formationB, savePlayersToPhases, getOppositePhaseName, propagatePositions]);

  const handleColorChange = useCallback((team: "A" | "B", hexColor: string) => {
    if (team === "A") {
      if (hexColor.toLowerCase() === teamBColor.toLowerCase()) {
        setColorError(t.errShirtColorDup);
        return;
      }
      setTeamAColor(hexColor);
      setColorError(null);
    } else {
      if (hexColor.toLowerCase() === teamAColor.toLowerCase()) {
        setColorError(t.errShirtColorDup);
        return;
      }
      setTeamBColor(hexColor);
      setColorError(null);
    }
  }, [teamAColor, teamBColor, t]);

  const handleStartMotion = useCallback((playerId: string) => {
    setPlayers(prev =>
      prev.map(p => {
        if (p.id !== playerId) return p;
        return {
          ...p,
          motionStart: { x: p.x, y: p.y },
          motionDraftControl: { x: p.x, y: p.y }
        };
      })
    );
  }, []);

  const handleSaveMotion = useCallback((playerId: string) => {
    setPlayers(prev => {
      const next = prev.map(p => {
        if (p.id !== playerId || !p.motionStart) return p;
        
        const ctrlPoint = p.motionDraftControl || {
          x: (p.motionStart.x + p.x) / 2,
          y: (p.motionStart.y + p.y) / 2
        };

        const newMotion: Motion = {
          id: Math.random().toString(36).substring(2, 9),
          start: { x: p.motionStart.x, y: p.motionStart.y },
          end: { x: p.x, y: p.y },
          control: { x: ctrlPoint.x, y: ctrlPoint.y }
        };
        return {
          ...p,
          motion: newMotion,
          motionStart: null,
          motionDraftControl: null
        };
      });
      saveAndPropagate(next);
      return next;
    });
  }, [saveAndPropagate]);

  const handleCancelMotion = useCallback((playerId: string) => {
    setPlayers(prev => {
      const next = prev.map(p => {
        if (p.id !== playerId || !p.motionStart) return p;
        return {
          ...p,
          x: p.motionStart.x,
          y: p.motionStart.y,
          motionStart: null,
          motionDraftControl: null
        };
      });
      saveAndPropagate(next);
      return next;
    });
  }, [saveAndPropagate]);

  const handleDeleteMotion = useCallback((playerId: string) => {
    setPlayers(prev => {
      const next = prev.map(p => {
        if (p.id !== playerId) return p;
        return { ...p, motion: null };
      });
      saveAndPropagate(next);
      return next;
    });
  }, [saveAndPropagate]);

  const handleNameChange = useCallback((playerId: string, newName: string) => {
    setPlayers(prev => {
      const next = prev.map(p => (p.id === playerId ? { ...p, name: newName } : p));
      saveAndPropagate(next);
      return next;
    });
  }, [saveAndPropagate]);

  const handleNumberChange = useCallback((playerId: string, newNumber: number) => {
    setPlayers(prev => {
      const next = prev.map(p => (p.id === playerId ? { ...p, number: newNumber } : p));
      saveAndPropagate(next);
      return next;
    });
  }, [saveAndPropagate]);

  const handleToggleHighlight = useCallback((playerId: string) => {
    const currentPlayer = players.find(p => p.id === playerId);
    if (!currentPlayer || currentPlayer.team !== activeConfigTab) return;
    const newHighlighted = !currentPlayer.isHighlighted;

    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, isHighlighted: newHighlighted } : p
    ));

    setPhases(currentPhases => {
      const updated: Record<string, PhaseData> = {};
      for (const phaseName of Object.keys(currentPhases)) {
        updated[phaseName] = {
          ...currentPhases[phaseName],
          players: currentPhases[phaseName].players.map(p =>
            p.id === playerId ? { ...p, isHighlighted: newHighlighted } : p
          )
        };
      }
      return updated;
    });
  }, [players, activeConfigTab]);

  return (
    <LineupContext.Provider
      value={{
        activeLang,
        setActiveLang,
        t,
        teamAColor,
        setTeamAColor,
        teamBColor,
        setTeamBColor,
        formationA,
        setFormationA,
        formationB,
        setFormationB,
        colorError,
        setColorError,
        showZones,
        setShowZones,
        activeConfigTab,
        setActiveConfigTab,
        phases,
        setPhases,
        activePhase,
        setActivePhase,
        players,
        setPlayers,
        selectedPlayerId,
        setSelectedPlayerId,
        isNewPhaseModalOpen,
        setIsNewPhaseModalOpen,
        newPhaseNameInput,
        setNewPhaseNameInput,
        newPhaseCategoryInput,
        setNewPhaseCategoryInput,
        newPhaseError,
        setNewPhaseError,
        showTeamMotions,
        setShowTeamMotions,
        animationState,
        playMode,
        setPlayMode,
        ball,
        setBall,
        
        pitchRef,
        draggingBall,
        draggingPlayerId,
        draggingControlPoint,
        draggingDraftControlPlayerId,
        
        getOrderedPhaseNames,
        getOppositePhaseName,
        propagatePositions,
        getMergedPlayersForEditing,
        savePlayersToPhases,
        saveAndPropagate,
        handleTabChange,
        handlePhaseChange,
        handleConfirmCreatePhase,
        startAnimation,
        stopAndResetAnimation,
        resetPlayersPositions,
        handleMouseDown,
        handleControlPointMouseDown,
        handleDraftControlMouseDown,
        handleMouseMove,
        handleMouseUpOrLeave,
        handleColorChange,
        handleStartMotion,
        handleSaveMotion,
        handleCancelMotion,
        handleDeleteMotion,
        handleNameChange,
        handleNumberChange,
        handleToggleHighlight,
        handleFormationChange,
        phaseBallMoves,
        handleClearBallMoves,
        MAX_BALL_MOVES
      }}
    >
      {children}
    </LineupContext.Provider>
  );
};

export const useLineup = () => {
  const context = useContext(LineupContext);
  if (context === undefined) {
    throw new Error("useLineup must be used within a LineupProvider");
  }
  return context;
};
