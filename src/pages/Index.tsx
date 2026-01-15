import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Spade, Play, List, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import LevelSelect from "@/components/game/LevelSelect";
import GameRoom from "@/components/game/GameRoom";
import ResultScreen from "@/components/game/ResultScreen";
import { generatePuzzle, Puzzle } from "@/lib/puzzleGenerator";

type GameState = "menu" | "levels" | "playing" | "result";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [deathMessage, setDeathMessage] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Progress tracking (persisted in localStorage)
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem("borderland-unlocked");
    return saved ? parseInt(saved) : 1;
  });
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("borderland-completed");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Save progress
  useEffect(() => {
    localStorage.setItem("borderland-unlocked", unlockedLevel.toString());
    localStorage.setItem("borderland-completed", JSON.stringify([...completedLevels]));
  }, [unlockedLevel, completedLevels]);

  const startLevel = useCallback((level: number) => {
    setCurrentLevel(level);
    setCurrentPuzzle(generatePuzzle(level));
    setGameState("playing");
  }, []);

  const handleWin = useCallback(() => {
    setIsVictory(true);
    setCompletedLevels(prev => new Set([...prev, currentLevel]));
    if (currentLevel >= unlockedLevel && currentLevel < 100) {
      setUnlockedLevel(currentLevel + 1);
    }
    setGameState("result");
  }, [currentLevel, unlockedLevel]);

  const handleLose = useCallback((message: string) => {
    setIsVictory(false);
    setDeathMessage(message);
    setGameState("result");
  }, []);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < 100) {
      startLevel(currentLevel + 1);
    }
  }, [currentLevel, startLevel]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated background - Enhanced Alice in Borderland theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dark base with subtle red/cyan glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-rose-950/20 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-cyan-950/20" />
        
        {/* Pulsing red glow effect */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Multiple floating card suits with different sizes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const suits = ["♠", "♥", "♦", "♣"];
          const suit = suits[i % 4];
          const colors = ["text-rose-400/20", "text-cyan-400/20", "text-purple-400/20", "text-amber-400/20"];
          const color = colors[i % 4];
          return (
            <motion.div
              key={`suit-${i}`}
              className={`absolute ${color} text-4xl md:text-8xl font-bold`}
              initial={{ 
                x: `${(i * 8) % 100}%`, 
                y: "110%",
                rotate: Math.random() * 360,
              }}
              animate={{ 
                y: "-10%",
                rotate: [0, 360],
                x: [`${(i * 8) % 100}%`, `${((i * 8) + 5) % 100}%`, `${(i * 8) % 100}%`],
              }}
              transition={{ 
                duration: 25 + (i * 3),
                repeat: Infinity,
                ease: "linear",
                rotate: {
                  duration: 20 + i,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {suit}
            </motion.div>
          );
        })}
        
        {/* Enhanced grid lines with neon effect */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Scan lines effect */}
        <motion.div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            )`,
          }}
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* MENU */}
        {gameState === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center min-h-screen p-8"
          >
            {/* Logo - Enhanced with dramatic effects */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="text-center mb-16 relative z-10"
            >
              {/* Glowing card suits around skull */}
              <div className="flex items-center justify-center gap-6 mb-8 relative">
                <motion.span 
                  className="text-7xl md:text-9xl text-rose-500/80 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  ♠
                </motion.span>
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Skull className="w-24 h-24 md:w-32 md:h-32 text-rose-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
                </motion.div>
                <motion.span 
                  className="text-7xl md:text-9xl text-cyan-500/80 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  animate={{ 
                    rotateY: [360, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                  }}
                >
                  ♠
                </motion.span>
              </div>
              
              {/* Main title with dramatic gradient and glow */}
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-rose-500 via-rose-400 to-cyan-400 blur-2xl opacity-50" />
                  <span className="relative bg-gradient-to-r from-rose-400 via-white to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                    ALICE IN
                  </span>
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-rose-400 to-rose-500 blur-2xl opacity-50" />
                  <span className="relative bg-gradient-to-r from-cyan-400 via-white to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                    BORDERLAND
                  </span>
                </span>
              </motion.h1>
              
              {/* Subtitle with dramatic styling */}
              <motion.h2 
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">DEADLY</span>
                <span className="text-white mx-3">•</span>
                <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">LOGIC</span>
                <span className="text-white mx-3">•</span>
                <span className="text-rose-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">ROOM</span>
              </motion.h2>
              
              {/* Tagline with card suits */}
              <motion.div 
                className="flex items-center justify-center gap-3 text-lg md:text-xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span 
                  className="text-rose-500 text-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ♥
                </motion.span>
                <span className="text-white/90 tracking-wider">SURVIVAL PUZZLE GAME</span>
                <motion.span 
                  className="text-cyan-400 text-2xl"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ♦
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Rules - Enhanced with dramatic styling */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="max-w-lg mx-auto mb-12 p-8 rounded-2xl bg-black/60 border-2 border-rose-500/30 backdrop-blur-md shadow-[0_0_40px_rgba(239,68,68,0.2)] relative overflow-hidden"
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "linear-gradient(45deg, rgba(239,68,68,0.1), rgba(6,182,212,0.1), rgba(239,68,68,0.1))",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black mb-6 text-center tracking-wider">
                  <span className="bg-gradient-to-r from-rose-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    GAME RULES
                  </span>
                </h3>
                <ul className="space-y-4 text-white/90">
                  <motion.li 
                    className="flex items-start gap-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <span className="text-rose-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">♠</span>
                    <span className="text-base md:text-lg font-semibold pt-1">Four doors. Only <span className="text-rose-400">ONE</span> leads to survival.</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <span className="text-amber-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">♥</span>
                    <span className="text-base md:text-lg font-semibold pt-1">Hints reveal over time. Read them <span className="text-amber-400">LITERALLY</span>.</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <span className="text-cyan-400 font-black text-2xl drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">♦</span>
                    <span className="text-base md:text-lg font-semibold pt-1"><span className="text-cyan-400">100 levels</span>. Each harder than the last.</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-4 p-3 rounded-lg bg-red-600/20 border border-red-500/30"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <span className="text-red-500 font-black text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">♣</span>
                    <span className="text-base md:text-lg font-bold pt-1 text-red-400">Choose wrong, and <span className="text-red-500">GAME OVER</span>.</span>
                  </motion.li>
                </ul>
              </div>
            </motion.div>

            {/* Menu buttons - Enhanced with dramatic effects */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              className="flex flex-col gap-5 w-full max-w-sm relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => startLevel(unlockedLevel)}
                  size="lg"
                  className="w-full text-xl md:text-2xl py-7 font-black tracking-wider bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:via-rose-600 hover:to-red-700 border-2 border-rose-400/60 shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_40px_rgba(239,68,68,0.8)] transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                  />
                  <Play className="w-7 h-7 mr-3 relative z-10" />
                  <span className="relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    {unlockedLevel === 1 ? "ENTER THE GAME" : `CONTINUE (Lv.${unlockedLevel})`}
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => setGameState("levels")}
                  size="lg"
                  variant="outline"
                  className="w-full text-lg md:text-xl py-6 font-bold tracking-wider border-2 border-cyan-400/50 bg-black/40 hover:bg-black/60 hover:border-cyan-400/80 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300"
                >
                  <List className="w-6 h-6 mr-2" />
                  SELECT LEVEL
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-16 text-center relative z-10"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/60 border border-rose-500/30 backdrop-blur-md">
                <span className="text-rose-400 font-bold text-lg">♠</span>
                <p className="text-white/90 font-semibold text-base md:text-lg">
                  Progress: <span className="text-rose-400 font-black">{completedLevels.size}</span>
                  <span className="text-white/60">/</span>
                  <span className="text-cyan-400 font-black">100</span> levels cleared
                </p>
                <span className="text-cyan-400 font-bold text-lg">♦</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* LEVEL SELECT */}
        {gameState === "levels" && (
          <LevelSelect
            key="levels"
            unlockedLevel={unlockedLevel}
            completedLevels={completedLevels}
            onSelectLevel={startLevel}
            onBack={() => setGameState("menu")}
          />
        )}

        {/* GAME */}
        {gameState === "playing" && currentPuzzle && (
          <GameRoom
            key="playing"
            puzzle={currentPuzzle}
            onWin={handleWin}
            onLose={handleLose}
            onQuit={() => setGameState("menu")}
          />
        )}

        {/* RESULT */}
        {gameState === "result" && (
          <ResultScreen
            key="result"
            isVictory={isVictory}
            level={currentLevel}
            message={deathMessage}
            timeRemaining={timeRemaining}
            onRetry={() => startLevel(currentLevel)}
            onNextLevel={handleNextLevel}
            onMenu={() => setGameState("menu")}
            hasNextLevel={currentLevel < 100}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
