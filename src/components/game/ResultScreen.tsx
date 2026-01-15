import { motion } from "framer-motion";
import { Skull, Trophy, RotateCcw, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultScreenProps {
  isVictory: boolean;
  level: number;
  message?: string;
  timeRemaining?: number;
  onRetry: () => void;
  onNextLevel: () => void;
  onMenu: () => void;
  hasNextLevel: boolean;
}

const ResultScreen = ({
  isVictory,
  level,
  message,
  timeRemaining,
  onRetry,
  onNextLevel,
  onMenu,
  hasNextLevel,
}: ResultScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex flex-col items-center justify-center p-8 ${
        isVictory ? "" : "bg-gradient-to-b from-rose-950/20 to-background"
      }`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, delay: 0.2 }}
        className="mb-8"
      >
        {isVictory ? (
          <div className="relative">
            <Trophy className="w-32 h-32 text-amber-400" />
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Trophy className="w-32 h-32 text-amber-400 blur-xl" />
            </motion.div>
          </div>
        ) : (
          <div className="relative">
            <Skull className="w-32 h-32 text-rose-500" />
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Skull className="w-32 h-32 text-rose-500 blur-xl" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mb-6"
      >
        <h1 className={`text-5xl md:text-7xl font-black mb-2 ${
          isVictory 
            ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 bg-clip-text text-transparent" 
            : "text-rose-500"
        }`}>
          {isVictory ? "GAME CLEAR" : "GAME OVER"}
        </h1>
        <p className="text-xl text-muted-foreground">
          Level {level} {isVictory ? "Complete" : "Failed"}
        </p>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-md text-center mb-8"
      >
        {isVictory ? (
          <>
            <p className="text-lg text-foreground mb-2">
              You've survived the Borderland... for now.
            </p>
            {timeRemaining !== undefined && (
              <p className="text-muted-foreground">
                Time remaining: <span className="text-primary font-bold">{timeRemaining}s</span>
              </p>
            )}
          </>
        ) : (
          <p className="text-lg text-muted-foreground italic">
            "{message}"
          </p>
        )}
      </motion.div>

      {/* Decorative cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-2 mb-12 text-4xl"
      >
        {["♠", "♥", "♦", "♣"].map((suit, idx) => (
          <motion.span
            key={suit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isVictory ? 1 : 0.3 }}
            transition={{ delay: 0.7 + idx * 0.1 }}
            className={
              isVictory 
                ? idx === 0 ? "text-slate-300" 
                : idx === 1 ? "text-rose-400" 
                : idx === 2 ? "text-cyan-400" 
                : "text-purple-400"
                : "text-muted-foreground"
            }
          >
            {suit}
          </motion.span>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {isVictory && hasNextLevel && (
          <Button
            onClick={onNextLevel}
            size="lg"
            className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold"
          >
            Next Level
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
        
        <Button
          onClick={onRetry}
          size="lg"
          variant={isVictory ? "outline" : "default"}
          className="gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          {isVictory ? "Replay" : "Try Again"}
        </Button>
        
        <Button
          onClick={onMenu}
          size="lg"
          variant="ghost"
          className="gap-2"
        >
          <Home className="w-5 h-5" />
          Menu
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ResultScreen;
