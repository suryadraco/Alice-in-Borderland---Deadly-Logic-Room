// Puzzle generator for 100 unique levels with progressive difficulty

export interface Puzzle {
  level: number;
  difficulty: "easy" | "medium" | "hard" | "deadly";
  safeDoor: number;
  hints: string[];
  doorDeaths: string[];
  timeLimit: number;
  hintsRevealed: number;
}

const DEATH_MESSAGES = {
  crushed: [
    "The ceiling descends. You are crushed.",
    "Walls close in. Your bones shatter.",
    "Steel plates flatten you instantly.",
    "The room collapses. No escape.",
  ],
  poisoned: [
    "Toxic gas fills your lungs.",
    "Venom seeps through the cracks.",
    "The air turns deadly. You suffocate.",
    "Poison needles pierce your skin.",
  ],
  burned: [
    "Flames consume you instantly.",
    "Fire erupts. Nothing remains.",
    "Molten metal pours from above.",
    "You burn before you can scream.",
  ],
  drowned: [
    "Water floods in. You drown.",
    "The room fills with acid.",
    "Freezing water pulls you under.",
    "You sink into the abyss.",
  ],
  electrocuted: [
    "Lightning courses through your body.",
    "10,000 volts end your game.",
    "The floor electrifies. Game over.",
    "Sparks dance across your corpse.",
  ],
  impaled: [
    "Spikes spring from the floor.",
    "Blades descend from the ceiling.",
    "Steel rods pierce through you.",
    "A thousand needles find their mark.",
  ],
};

const HINT_TEMPLATES = {
  easy: [
    (safe: number) => safe % 2 === 1 ? "Odd numbers hold truth." : "Even paths lead to light.",
    (safe: number) => safe <= 2 ? "Salvation lies before the middle." : "Look beyond the center.",
    (safe: number, deadly: number[]) => `${deadly[0]} breathes fire. ${deadly[1]} drowns hope.`,
    (safe: number) => safe === 1 || safe === 4 ? "The edge knows peace." : "Peace hides between extremes.",
    (safe: number, deadly: number[]) => `If ${deadly[0]} is death, what is ${deadly[0] + 1 > 4 ? deadly[0] - 1 : deadly[0] + 1}?`,
    (safe: number) => `Count to ${safe}. Stop. That's your answer.`,
  ],
  medium: [
    (safe: number) => `The sum of death is ${[1,2,3,4].filter(n => n !== safe).reduce((a,b) => a+b, 0)}.`,
    (safe: number, deadly: number[]) => `${deadly[0]} mirrors ${deadly[2]} in fate.`,
    (safe: number) => safe === 2 || safe === 3 ? "Edges deceive. The center survives." : "The center burns. Seek the margins.",
    (safe: number, deadly: number[]) => `Between ${deadly[0]} and ${deadly[1]}, only walls remain.`,
    (safe: number) => `Multiply silence by ${safe}. The product is your path.`,
    (safe: number) => `${5 - safe} doors promise death.`,
    (safe: number, deadly: number[]) => `The ${deadly[0] < safe ? "lesser" : "greater"} numbers bring ruin.`,
    (safe: number) => `What remains when you subtract ${4 - safe} from the final door?`,
  ],
  hard: [
    (safe: number) => `${safe === 1 ? "Alpha" : safe === 2 ? "Beta" : safe === 3 ? "Gamma" : "Omega"} is not death.`,
    (safe: number, deadly: number[]) => `The product of doom: ${deadly[0]} × ${deadly[1]} = ${deadly[0] * deadly[1]}.`,
    (safe: number) => `In binary, life reads ${safe.toString(2).padStart(3, '0')}.`,
    (safe: number, deadly: number[]) => `Sum any two deadly doors. Never equals ${safe * 2}.`,
    (safe: number) => `The ${["", "first", "second", "third", "fourth"][safe]} prime after zero holds truth.`,
    (safe: number, deadly: number[]) => `${deadly[0]} + ${deadly[1]} + ${deadly[2]} = ${deadly[0] + deadly[1] + deadly[2]}. Life is what remains.`,
    (safe: number) => `Divide 8 by ${8 / safe}. Walk through that door.`,
    (safe: number, deadly: number[]) => `Three consecutive fates share doom. One stands ${safe < 3 ? "before" : "after"}.`,
    (safe: number) => `The answer squared minus ${safe * safe - safe} equals itself.`,
  ],
  deadly: [
    (safe: number) => `${["", "Ace", "Deuce", "Trey", "Cater"][safe]} of spades grants passage.`,
    (safe: number, deadly: number[]) => `XOR of death: ${deadly[0]} ⊕ ${deadly[1]} ⊕ ${deadly[2]} = ${deadly[0] ^ deadly[1] ^ deadly[2]}.`,
    (safe: number) => `The Fibonacci position ${safe === 1 ? "1" : safe === 2 ? "1" : safe === 3 ? "2" : "3"} marks salvation.`,
    (safe: number, deadly: number[]) => `Modulo 5, death sums to ${(deadly[0] + deadly[1] + deadly[2]) % 5}.`,
    (safe: number) => `In hexadecimal, freedom is 0x${safe.toString(16).toUpperCase()}.`,
    (safe: number, deadly: number[]) => `The median of death is ${[...deadly].sort((a,b) => a-b)[1]}.`,
    (safe: number) => `${safe} is prime: ${[2, 3].includes(safe) ? "TRUE" : "FALSE"}. Act accordingly.`,
    (safe: number, deadly: number[]) => `Geometric mean of doom approaches ${Math.round(Math.pow(deadly[0] * deadly[1] * deadly[2], 1/3) * 10) / 10}.`,
    (safe: number) => `The only door where n² - 5n + ${6 - safe + safe*safe - 5*safe} = 0.`,
    (safe: number, deadly: number[]) => `When sorted, death occupies positions that exclude index ${safe - 1}.`,
  ],
};

function getRandomDeathMessage(type: keyof typeof DEATH_MESSAGES): string {
  const messages = DEATH_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

function generateDeathDoors(safeDoor: number, level: number): string[] {
  const deathTypes: (keyof typeof DEATH_MESSAGES)[] = ["crushed", "poisoned", "burned", "drowned", "electrocuted", "impaled"];
  const deaths: string[] = [];
  
  for (let i = 1; i <= 4; i++) {
    if (i === safeDoor) {
      deaths.push("Freedom. You escape the Borderland... for now.");
    } else {
      const typeIndex = (i + level) % deathTypes.length;
      deaths.push(getRandomDeathMessage(deathTypes[typeIndex]));
    }
  }
  
  return deaths;
}

function generateHints(safeDoor: number, difficulty: Puzzle["difficulty"], level: number): string[] {
  const deadlyDoors = [1, 2, 3, 4].filter(d => d !== safeDoor);
  // Shuffle deadly doors for variety
  for (let i = deadlyDoors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deadlyDoors[i], deadlyDoors[j]] = [deadlyDoors[j], deadlyDoors[i]];
  }
  
  const templates = HINT_TEMPLATES[difficulty];
  const numHints = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : difficulty === "hard" ? 3 : 4;
  
  const hints: string[] = [];
  const usedIndices = new Set<number>();
  
  // Add some easier hints for hard/deadly levels based on level number
  if (difficulty === "hard" || difficulty === "deadly") {
    const easierPool = [...HINT_TEMPLATES.medium];
    const easierHint = easierPool[(level + safeDoor) % easierPool.length];
    hints.push(easierHint(safeDoor, deadlyDoors));
  }
  
  while (hints.length < numHints) {
    const idx = (level + hints.length * 7) % templates.length;
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      hints.push(templates[idx](safeDoor, deadlyDoors));
    } else {
      // Fallback: add a direct hint mixed with misdirection
      const directHint = `Door ${deadlyDoors[hints.length % 3]} is NOT safe.`;
      if (!hints.includes(directHint)) {
        hints.push(directHint);
      }
    }
  }
  
  return hints;
}

export function generatePuzzle(level: number): Puzzle {
  // Difficulty progression
  let difficulty: Puzzle["difficulty"];
  if (level <= 20) difficulty = "easy";
  else if (level <= 50) difficulty = "medium";
  else if (level <= 80) difficulty = "hard";
  else difficulty = "deadly";
  
  // Safe door based on level for variety but reproducibility
  const safeDoor = ((level * 7 + 3) % 4) + 1;
  
  // Time limit decreases with level
  const baseTime = 60;
  const timeReduction = Math.floor(level / 5) * 2;
  const timeLimit = Math.max(15, baseTime - timeReduction);
  
  // Hints revealed at start
  const hintsRevealed = difficulty === "easy" ? 2 : difficulty === "medium" ? 1 : 1;
  
  return {
    level,
    difficulty,
    safeDoor,
    hints: generateHints(safeDoor, difficulty, level),
    doorDeaths: generateDeathDoors(safeDoor, level),
    timeLimit,
    hintsRevealed,
  };
}

export function getDifficultyColor(difficulty: Puzzle["difficulty"]): string {
  switch (difficulty) {
    case "easy": return "text-emerald-400";
    case "medium": return "text-amber-400";
    case "hard": return "text-orange-500";
    case "deadly": return "text-rose-500";
  }
}

export function getDifficultyBg(difficulty: Puzzle["difficulty"]): string {
  switch (difficulty) {
    case "easy": return "bg-emerald-500/20 border-emerald-500/50";
    case "medium": return "bg-amber-500/20 border-amber-500/50";
    case "hard": return "bg-orange-500/20 border-orange-500/50";
    case "deadly": return "bg-rose-500/20 border-rose-500/50";
  }
}
