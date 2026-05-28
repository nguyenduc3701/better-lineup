export interface Motion {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  control?: { x: number; y: number } | null;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  team: "A" | "B";
  x: number; // percentage from left
  y: number; // percentage from top
  isGoalkeeper?: boolean;
  isSubstitute?: boolean;
  isHighlighted?: boolean;
  motionStart?: { x: number; y: number } | null;
  motionDraftControl?: { x: number; y: number } | null;
  motion?: Motion | null;
}

export type Formation =
  | "4-4-2"
  | "4-3-3"
  | "3-5-2"
  | "5-4-1"
  | "4-2-3-1"
  | "3-4-3"
  | "4-5-1"
  | "4-1-2-1-2"
  | "3-2-4-1"
  | "3-2-1"      // 7v7
  | "2-3-1"      // 7v7
  | "3-1-2"      // 7v7
  | "2-1-2-1";   // 7v7

export interface BallMove {
  id: string;
  fromPlayerId: string;
  toPlayerId: string;
}

export interface PhaseData {
  formationA: Formation;
  formationB: Formation;
  players: Player[];
  category: "Attack" | "Defence" | "Custom";
  ballMoves: BallMove[]; // ball pass sequence, max 10 per phase
}
