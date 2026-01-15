import { motion } from "framer-motion";
import { Lock, CheckCircle2, Skull, Spade } from "lucide-react";
import { getDifficultyColor, getDifficultyBg, generatePuzzle } from "@/lib/puzzleGenerator";

interface LevelSelectProps {
  unlockedLevel: number;
  completedLevels: Set<number>;
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

const LevelSelect = ({ unlockedLevel, completedLevels, onSelectLevel, onBack }: LevelSelectProps) => {
  const getDifficulty = (level: number) => {
    if (level <= 20) return "easy";
    if (level <= 50) return "medium";
    if (level <= 80) return "hard";
    return "deadly";
  };

  const sections = [
    { name: "♠ Spade Training", range: [1, 20], icon: "♠" },
    { name: "♥ Heart Trials", range: [21, 50], icon: "♥" },
    { name: "♦ Diamond Gauntlet", range: [51, 80], icon: "♦" },
    { name: "♣ Club of Death", range: [81, 100], icon: "♣" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen p-4 md:p-8 overflow-auto"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors mb-6 flex items-center gap-2"
          whileHover={{ x: -5 }}
        >
          ← Back to Menu
        </motion.button>
        
        <div className="flex items-center gap-4 mb-2">
          <Spade className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-rose-400 to-primary bg-clip-text text-transparent">
            SELECT GAME
          </h1>
        </div>
        <p className="text-muted-foreground">
          Progress: {completedLevels.size}/100 cleared | Current: Level {unlockedLevel}
        </p>
      </div>

      {/* Level sections */}
      <div className="max-w-6xl mx-auto space-y-8">
        {sections.map((section, sectionIdx) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-3xl ${
                sectionIdx === 0 ? "text-emerald-400" :
                sectionIdx === 1 ? "text-rose-400" :
                sectionIdx === 2 ? "text-cyan-400" :
                "text-purple-400"
              }`}>
                {section.icon}
              </span>
              <h2 className="text-xl font-bold">{section.name}</h2>
              <span className="text-sm text-muted-foreground">
                (Levels {section.range[0]}-{section.range[1]})
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {Array.from({ length: section.range[1] - section.range[0] + 1 }, (_, i) => {
                const level = section.range[0] + i;
                const isUnlocked = level <= unlockedLevel;
                const isCompleted = completedLevels.has(level);
                const difficulty = getDifficulty(level);

                return (
                  <motion.button
                    key={level}
                    onClick={() => isUnlocked && onSelectLevel(level)}
                    disabled={!isUnlocked}
                    className={`
                      relative aspect-square rounded-lg border-2 flex items-center justify-center
                      font-bold text-sm transition-all
                      ${isCompleted 
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                        : isUnlocked 
                          ? `${getDifficultyBg(difficulty)} ${getDifficultyColor(difficulty)} hover:scale-110` 
                          : "bg-muted/10 border-border/30 text-muted-foreground/30 cursor-not-allowed"
                      }
                    `}
                    whileHover={isUnlocked ? { scale: 1.1, y: -2 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isUnlocked ? (
                      level
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                    
                    {/* Glow effect for current level */}
                    {level === unlockedLevel && !isCompleted && (
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2 border-primary"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="max-w-6xl mx-auto mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/50" />
          <span>Easy (1-20)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50" />
          <span>Medium (21-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/50" />
          <span>Hard (51-80)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-rose-500/20 border border-rose-500/50" />
          <span>Deadly (81-100)</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LevelSelect;
