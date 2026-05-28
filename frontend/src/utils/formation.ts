import { Formation, Player } from "../types";

export const getFormationPositions = (
  formation: Formation,
  team: "A" | "B"
): Omit<Player, "name" | "number" | "team">[] => {
  const isTeamA = team === "A";
  
  // Coordinates helper (in percentages)
  // X axis: Team A is on the left (5% - 48%), Team B is on the right (52% - 95%)
  // Y axis: 0% to 100%
  const xVal = (pct: number) => (isTeamA ? pct : 100 - pct);

  switch (formation) {
    case "4-3-3":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(20), y: 15 },
        { id: `${team}-df2`, x: xVal(18), y: 38 },
        { id: `${team}-df3`, x: xVal(18), y: 62 },
        { id: `${team}-df4`, x: xVal(20), y: 85 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 25 },
        { id: `${team}-mf2`, x: xVal(30), y: 50 },
        { id: `${team}-mf3`, x: xVal(32), y: 75 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 20 },
        { id: `${team}-fw2`, x: xVal(42), y: 50 },
        { id: `${team}-fw3`, x: xVal(45), y: 80 },
      ];
    case "3-5-2":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 25 },
        { id: `${team}-df2`, x: xVal(18), y: 50 },
        { id: `${team}-df3`, x: xVal(18), y: 75 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 12 },
        { id: `${team}-mf2`, x: xVal(30), y: 31 },
        { id: `${team}-mf3`, x: xVal(28), y: 50 },
        { id: `${team}-mf4`, x: xVal(30), y: 69 },
        { id: `${team}-mf5`, x: xVal(32), y: 88 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 35 },
        { id: `${team}-fw2`, x: xVal(45), y: 65 },
      ];
    case "5-4-1":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(20), y: 12 },
        { id: `${team}-df2`, x: xVal(18), y: 31 },
        { id: `${team}-df3`, x: xVal(17), y: 50 },
        { id: `${team}-df4`, x: xVal(18), y: 69 },
        { id: `${team}-df5`, x: xVal(20), y: 88 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 20 },
        { id: `${team}-mf2`, x: xVal(30), y: 40 },
        { id: `${team}-mf3`, x: xVal(30), y: 60 },
        { id: `${team}-mf4`, x: xVal(32), y: 80 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 50 },
      ];
    case "4-2-3-1":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(20), y: 15 },
        { id: `${team}-df2`, x: xVal(18), y: 38 },
        { id: `${team}-df3`, x: xVal(18), y: 62 },
        { id: `${team}-df4`, x: xVal(20), y: 85 },
        // Defensive Midfielders
        { id: `${team}-mf1`, x: xVal(28), y: 35 },
        { id: `${team}-mf2`, x: xVal(28), y: 65 },
        // Attacking Midfielders
        { id: `${team}-mf3`, x: xVal(36), y: 20 },
        { id: `${team}-mf4`, x: xVal(35), y: 50 },
        { id: `${team}-mf5`, x: xVal(36), y: 80 },
        // Forward
        { id: `${team}-fw1`, x: xVal(45), y: 50 },
      ];
    case "3-4-3":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 25 },
        { id: `${team}-df2`, x: xVal(18), y: 50 },
        { id: `${team}-df3`, x: xVal(18), y: 75 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(31), y: 15 },
        { id: `${team}-mf2`, x: xVal(30), y: 38 },
        { id: `${team}-mf3`, x: xVal(30), y: 62 },
        { id: `${team}-mf4`, x: xVal(31), y: 85 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 20 },
        { id: `${team}-fw2`, x: xVal(43), y: 50 },
        { id: `${team}-fw3`, x: xVal(45), y: 80 },
      ];
    case "4-5-1":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(20), y: 15 },
        { id: `${team}-df2`, x: xVal(18), y: 38 },
        { id: `${team}-df3`, x: xVal(18), y: 62 },
        { id: `${team}-df4`, x: xVal(20), y: 85 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 12 },
        { id: `${team}-mf2`, x: xVal(30), y: 31 },
        { id: `${team}-mf3`, x: xVal(28), y: 50 },
        { id: `${team}-mf4`, x: xVal(30), y: 69 },
        { id: `${team}-mf5`, x: xVal(32), y: 88 },
        // Forward
        { id: `${team}-fw1`, x: xVal(45), y: 50 },
      ];
    case "4-1-2-1-2":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(20), y: 15 },
        { id: `${team}-df2`, x: xVal(18), y: 38 },
        { id: `${team}-df3`, x: xVal(18), y: 62 },
        { id: `${team}-df4`, x: xVal(20), y: 85 },
        // DM
        { id: `${team}-mf1`, x: xVal(27), y: 50 },
        // CMs
        { id: `${team}-mf2`, x: xVal(33), y: 32 },
        { id: `${team}-mf3`, x: xVal(33), y: 68 },
        // AM
        { id: `${team}-mf4`, x: xVal(39), y: 50 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 35 },
        { id: `${team}-fw2`, x: xVal(45), y: 65 },
      ];
    case "3-2-4-1":
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 25 },
        { id: `${team}-df2`, x: xVal(18), y: 50 },
        { id: `${team}-df3`, x: xVal(18), y: 75 },
        // Defensive Midfielders
        { id: `${team}-mf1`, x: xVal(28), y: 35 },
        { id: `${team}-mf2`, x: xVal(28), y: 65 },
        // Attacking Midfielders
        { id: `${team}-mf3`, x: xVal(38), y: 15 },
        { id: `${team}-mf4`, x: xVal(37), y: 38 },
        { id: `${team}-mf5`, x: xVal(37), y: 62 },
        { id: `${team}-mf6`, x: xVal(38), y: 85 },
        // Striker
        { id: `${team}-fw1`, x: xVal(46), y: 50 },
      ];
    case "3-2-1": // 7v7
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 20 },
        { id: `${team}-df2`, x: xVal(16), y: 50 },
        { id: `${team}-df3`, x: xVal(18), y: 80 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 30 },
        { id: `${team}-mf2`, x: xVal(32), y: 70 },
        // Forward
        { id: `${team}-fw1`, x: xVal(45), y: 50 }
      ];
    case "2-3-1": // 7v7
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 30 },
        { id: `${team}-df2`, x: xVal(18), y: 70 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 20 },
        { id: `${team}-mf2`, x: xVal(30), y: 50 },
        { id: `${team}-mf3`, x: xVal(32), y: 80 },
        // Forward
        { id: `${team}-fw1`, x: xVal(45), y: 50 }
      ];
    case "3-1-2": // 7v7
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 20 },
        { id: `${team}-df2`, x: xVal(16), y: 50 },
        { id: `${team}-df3`, x: xVal(18), y: 80 },
        // Midfielder
        { id: `${team}-mf1`, x: xVal(30), y: 50 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 30 },
        { id: `${team}-fw2`, x: xVal(45), y: 70 }
      ];
    case "2-1-2-1": // 7v7
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(18), y: 30 },
        { id: `${team}-df2`, x: xVal(18), y: 70 },
        // DM
        { id: `${team}-mf1`, x: xVal(27), y: 50 },
        // AMs
        { id: `${team}-mf2`, x: xVal(36), y: 30 },
        { id: `${team}-mf3`, x: xVal(36), y: 70 },
        // Forward
        { id: `${team}-fw1`, x: xVal(45), y: 50 }
      ];
    case "4-4-2":
    default:
      return [
        { id: `${team}-gk`, x: xVal(5), y: 50, isGoalkeeper: true },
        // Defenders
        { id: `${team}-df1`, x: xVal(20), y: 15 },
        { id: `${team}-df2`, x: xVal(18), y: 38 },
        { id: `${team}-df3`, x: xVal(18), y: 62 },
        { id: `${team}-df4`, x: xVal(20), y: 85 },
        // Midfielders
        { id: `${team}-mf1`, x: xVal(32), y: 15 },
        { id: `${team}-mf2`, x: xVal(30), y: 38 },
        { id: `${team}-mf3`, x: xVal(30), y: 62 },
        { id: `${team}-mf4`, x: xVal(32), y: 85 },
        // Forwards
        { id: `${team}-fw1`, x: xVal(45), y: 35 },
        { id: `${team}-fw2`, x: xVal(45), y: 65 },
      ];
  }
};
