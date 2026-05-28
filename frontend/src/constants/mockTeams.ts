import { Player, Formation } from "../types";

export interface MockTeam {
  name: string;
  logo: string;
  color: string;
  formation: Formation;
  starters: Omit<Player, "team" | "x" | "y">[];
  subs: Omit<Player, "team" | "x" | "y">[];
}

export const MOCK_TEAMS: Record<string, MockTeam> = {
  "Manchester City": {
    name: "Manchester City",
    logo: "🩵",
    color: "#6cabdd",
    formation: "3-2-4-1",
    starters: [
      { id: "gk", name: "Ederson", number: 31, isGoalkeeper: true },
      { id: "df1", name: "K. Walker", number: 2 },
      { id: "df2", name: "R. Dias", number: 3 },
      { id: "df3", name: "M. Akanji", number: 25 },
      { id: "mf1", name: "Rodri", number: 16 },
      { id: "mf2", name: "M. Kovacic", number: 8 },
      { id: "mf3", name: "B. Silva", number: 20 },
      { id: "mf4", name: "K. De Bruyne", number: 17 },
      { id: "mf5", name: "P. Foden", number: 47 },
      { id: "mf6", name: "J. Grealish", number: 10 },
      { id: "fw1", name: "E. Haaland", number: 9 }
    ],
    subs: [
      { id: "sub1", name: "S. Ortega", number: 18, isGoalkeeper: true },
      { id: "sub2", name: "J. Stones", number: 5 },
      { id: "sub3", name: "N. Ake", number: 6 },
      { id: "sub4", name: "R. Lewis", number: 82 },
      { id: "sub5", name: "M. Nunes", number: 27 },
      { id: "sub6", name: "O. Bobb", number: 52 },
      { id: "sub7", name: "J. Doku", number: 11 }
    ]
  },
  "Arsenal": {
    name: "Arsenal",
    logo: "🔴",
    color: "#ef0107",
    formation: "4-3-3",
    starters: [
      { id: "gk", name: "D. Raya", number: 22, isGoalkeeper: true },
      { id: "df1", name: "B. White", number: 4 },
      { id: "df2", name: "W. Saliba", number: 2 },
      { id: "df3", name: "Gabriel M.", number: 6 },
      { id: "df4", name: "J. Timber", number: 12 },
      { id: "mf1", name: "T. Partey", number: 5 },
      { id: "mf2", name: "D. Rice", number: 41 },
      { id: "mf3", name: "M. Odegaard", number: 8 },
      { id: "fw1", name: "B. Saka", number: 7 },
      { id: "fw2", name: "G. Martinelli", number: 11 },
      { id: "fw3", name: "K. Havertz", number: 29 }
    ],
    subs: [
      { id: "sub1", name: "Neto", number: 32, isGoalkeeper: true },
      { id: "sub2", name: "J. Kiwior", number: 15 },
      { id: "sub3", name: "R. Calafiori", number: 33 },
      { id: "sub4", name: "Jorginho", number: 20 },
      { id: "sub5", name: "M. Merino", number: 23 },
      { id: "sub6", name: "R. Sterling", number: 30 },
      { id: "sub7", name: "G. Jesus", number: 9 }
    ]
  },
  "Real Madrid": {
    name: "Real Madrid",
    logo: "⚪",
    color: "#ffffff",
    formation: "4-3-3",
    starters: [
      { id: "gk", name: "T. Courtois", number: 1, isGoalkeeper: true },
      { id: "df1", name: "D. Carvajal", number: 2 },
      { id: "df2", name: "E. Militao", number: 3 },
      { id: "df3", name: "A. Rudiger", number: 22 },
      { id: "df4", name: "F. Mendy", number: 23 },
      { id: "mf1", name: "F. Valverde", number: 8 },
      { id: "mf2", name: "A. Tchouameni", number: 14 },
      { id: "mf3", name: "J. Bellingham", number: 5 },
      { id: "fw1", name: "Rodrygo", number: 11 },
      { id: "fw2", name: "Vinicius Jr.", number: 7 },
      { id: "fw3", name: "K. Mbappe", number: 9 }
    ],
    subs: [
      { id: "sub1", name: "A. Lunin", number: 13, isGoalkeeper: true },
      { id: "sub2", name: "Lucas V.", number: 17 },
      { id: "sub3", name: "L. Modric", number: 10 },
      { id: "sub4", name: "E. Camavinga", number: 6 },
      { id: "sub5", name: "A. Guler", number: 15 },
      { id: "sub6", name: "B. Diaz", number: 21 },
      { id: "sub7", name: "Endrick", number: 16 }
    ]
  },
  "Barcelona": {
    name: "Barcelona",
    logo: "🔵🔴",
    color: "#a50044",
    formation: "4-3-3",
    starters: [
      { id: "gk", name: "M. Ter Stegen", number: 1, isGoalkeeper: true },
      { id: "df1", name: "J. Kounde", number: 23 },
      { id: "df2", name: "P. Cubarsi", number: 2 },
      { id: "df3", name: "I. Martinez", number: 5 },
      { id: "df4", name: "A. Balde", number: 3 },
      { id: "mf1", name: "M. Casado", number: 17 },
      { id: "mf2", name: "Pedri", number: 8 },
      { id: "mf3", name: "D. Olmo", number: 20 },
      { id: "fw1", name: "L. Yamal", number: 19 },
      { id: "fw2", name: "Raphinha", number: 11 },
      { id: "fw3", name: "R. Lewandowski", number: 9 }
    ],
    subs: [
      { id: "sub1", name: "Inaki Pena", number: 13, isGoalkeeper: true },
      { id: "sub2", name: "H. Fort", number: 32 },
      { id: "sub3", name: "Christensen", number: 15 },
      { id: "sub4", name: "Gavi", number: 6 },
      { id: "sub5", name: "F. de Jong", number: 21 },
      { id: "sub6", name: "Ferran T.", number: 7 },
      { id: "sub7", name: "Ansu Fati", number: 10 }
    ]
  },
  "Manchester United": {
    name: "Manchester United",
    logo: "😈",
    color: "#da291c",
    formation: "4-2-3-1",
    starters: [
      { id: "gk", name: "A. Onana", number: 24, isGoalkeeper: true },
      { id: "df1", name: "D. Dalot", number: 20 },
      { id: "df2", name: "M. de Ligt", number: 4 },
      { id: "df3", name: "L. Martinez", number: 6 },
      { id: "df4", name: "N. Mazraoui", number: 3 },
      { id: "mf1", name: "K. Mainoo", number: 37 },
      { id: "mf2", name: "Casemiro", number: 18 },
      { id: "mf3", name: "B. Fernandes", number: 8 },
      { id: "mf4", name: "A. Garnacho", number: 17 },
      { id: "mf5", name: "M. Rashford", number: 10 },
      { id: "fw1", name: "R. Hojlund", number: 9 }
    ],
    subs: [
      { id: "sub1", name: "A. Bayindir", number: 1, isGoalkeeper: true },
      { id: "sub2", name: "J. Evans", number: 35 },
      { id: "sub3", name: "H. Maguire", number: 5 },
      { id: "sub4", name: "M. Ugarte", number: 25 },
      { id: "sub5", name: "M. Mount", number: 7 },
      { id: "sub6", name: "Antony", number: 21 },
      { id: "sub7", name: "J. Zirkzee", number: 11 }
    ]
  },
  "Liverpool": {
    name: "Liverpool",
    logo: "🔴🔥",
    color: "#c8102e",
    formation: "4-3-3",
    starters: [
      { id: "gk", name: "Alisson B.", number: 1, isGoalkeeper: true },
      { id: "df1", name: "T. Alexander-Arnold", number: 66 },
      { id: "df2", name: "I. Konate", number: 5 },
      { id: "df3", name: "V. van Dijk", number: 4 },
      { id: "df4", name: "A. Robertson", number: 26 },
      { id: "mf1", name: "R. Gravenberch", number: 38 },
      { id: "mf2", name: "A. Mac Allister", number: 10 },
      { id: "mf3", name: "D. Szoboszlai", number: 8 },
      { id: "fw1", name: "M. Salah", number: 11 },
      { id: "fw2", name: "L. Diaz", number: 23 },
      { id: "fw3", name: "Diogo J.", number: 20 }
    ],
    subs: [
      { id: "sub1", name: "C. Kelleher", number: 62, isGoalkeeper: true },
      { id: "sub2", name: "J. Gomez", number: 2 },
      { id: "sub3", name: "J. Quansah", number: 78 },
      { id: "sub4", name: "W. Endo", number: 3 },
      { id: "sub5", name: "C. Jones", number: 17 },
      { id: "sub6", name: "C. Gakpo", number: 18 },
      { id: "sub7", name: "D. Nunez", number: 9 }
    ]
  }
};
