import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, DoorClosed, AlertTriangle, Zap } from "lucide-react";
import { Puzzle, getDifficultyColor } from "@/lib/puzzleGenerator";

interface GameRoomProps {
  puzzle: Puzzle;
  onWin: () => void;
  onLose: (message: string) => void;
  onQuit: () => void;
}

const GameRoom = ({ puzzle, onWin, onLose, onQuit }: GameRoomProps) => {
  const [timeLeft, setTimeLeft] = useState(puzzle.timeLimit);
  const [revealedHints, setRevealedHints] = useState(puzzle.hintsRevealed);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const chooseDoor = useCallback(
    (doorIndex: number) => {
      if (selectedDoor !== null || isRevealing) return;

      setSelectedDoor(doorIndex);
      setIsRevealing(true);

      setTimeout(() => {
        const isCorrect = doorIndex === puzzle.safeDoor - 1;
        if (isCorrect) {
          onWin();
        } else {
          onLose(puzzle.doorDeaths[doorIndex]);
        }
      }, 2000);
    },
    [puzzle, selectedDoor, isRevealing, onWin, onLose]
  );

  // Timer countdown
  useEffect(() => {
    if (selectedDoor !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onLose("Time expires. The room seals forever. GAME OVER.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedDoor, onLose]);

  // Reveal hints over time
  useEffect(() => {
    if (selectedDoor !== null) return;

    const hintInterval = setInterval(() => {
      setRevealedHints((prev) => Math.min(prev + 1, puzzle.hints.length));
    }, 10000);

    return () => clearInterval(hintInterval);
  }, [selectedDoor, puzzle.hints.length]);

  const doorIcons = ["♠", "♥", "♦", "♣"];
  const doorColors = [
    "from-slate-600 to-slate-800",
    "from-rose-900 to-rose-950",
    "from-cyan-900 to-cyan-950",
    "from-purple-900 to-purple-950",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col p-4 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-lg border ${
            puzzle.difficulty === "easy" ? "bg-emerald-500/20 border-emerald-500/50" :
            puzzle.difficulty === "medium" ? "bg-amber-500/20 border-amber-500/50" :
            puzzle.difficulty === "hard" ? "bg-orange-500/20 border-orange-500/50" :
            "bg-rose-500/20 border-rose-500/50"
          }`}>
            <span className={`font-bold ${getDifficultyColor(puzzle.difficulty)}`}>
              LEVEL {puzzle.level}
            </span>
          </div>
          <span className="text-muted-foreground uppercase text-sm tracking-widest">
            {puzzle.difficulty}
          </span>
        </div>

        <button
          onClick={onQuit}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          ✕ Quit Game
        </button>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-8">
        <motion.div
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 ${
            timeLeft <= 10
              ? "border-rose-500 bg-rose-500/10 text-rose-400"
              : timeLeft <= 20
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-primary/50 bg-card text-foreground"
          }`}
          animate={timeLeft <= 10 ? { scale: [1, 1.02, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          <Clock className="w-8 h-8" />
          <span className="text-5xl font-mono font-black">{timeLeft}</span>
          <span className="text-lg">SEC</span>
          {timeLeft <= 10 && <Zap className="w-6 h-6 animate-pulse" />}
        </motion.div>
      </div>

      {/* Hints */}
      <div className="max-w-3xl mx-auto mb-8 w-full">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
            Intelligence Report
          </h2>
        </div>
        <div className="space-y-3">
          {puzzle.hints.map((hint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index < revealedHints ? 1 : 0.2,
                x: index < revealedHints ? 0 : -20,
              }}
              className={`p-4 rounded-xl border backdrop-blur-sm ${
                index < revealedHints
                  ? "bg-gradient-to-r from-primary/10 to-transparent border-primary/30"
                  : "bg-muted/5 border-border/30"
              }`}
            >
              {index < revealedHints ? (
                <div className="flex items-start gap-3">
                  <span className="text-primary font-bold">{index + 1}.</span>
                  <p className="text-foreground font-medium">{hint}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
                  Decrypting intelligence...
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Doors */}
      <div className="flex-1 flex items-center justify-center pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full">
          {[1, 2, 3, 4].map((door, idx) => (
            <motion.button
              key={door}
              onClick={() => chooseDoor(idx)}
              disabled={selectedDoor !== null}
              className={`
                relative aspect-[2/3] rounded-2xl border-2 overflow-hidden
                transition-all group
                ${selectedDoor === idx
                  ? "border-primary ring-4 ring-primary/30"
                  : selectedDoor !== null
                  ? "opacity-30 border-border"
                  : "border-border hover:border-primary/50"
                }
              `}
              whileHover={selectedDoor === null ? { scale: 1.03, y: -8 } : {}}
              whileTap={selectedDoor === null ? { scale: 0.97 } : {}}
            >
              {/* Door background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${doorColors[idx]} opacity-80`} />
              
              {/* Door frame */}
              <div className="absolute inset-2 border border-white/10 rounded-xl" />
              
              {/* Door content */}
              <div className="relative h-full flex flex-col items-center justify-center p-4">
                <motion.span
                  className="text-5xl md:text-6xl mb-4 opacity-80"
                  animate={selectedDoor === null ? { 
                    y: [0, -5, 0],
                    rotateY: [0, 10, 0, -10, 0]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 3, delay: idx * 0.3 }}
                >
                  {doorIcons[idx]}
                </motion.span>
                <span className="text-2xl md:text-3xl font-black text-white/90">
                  DOOR {door}
                </span>
                
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Selection animation */}
              {selectedDoor === idx && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                >
                  <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    {doorIcons[idx]}
                  </motion.div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GameRoom;
