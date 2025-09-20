"use client";

import { useState } from "react";
import HistoryItem from "@/components/HistoryItem";
import MultiplierChanceInput from "@/components/MultiplierChanceInput";
import GameDisplay from "@/components/GameDisplay";
import BettingForm from "@/components/BettingForm";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { animate } from "motion";

interface GameHistory {
  id: string;
  crashPoint: number;
  won: boolean;
  targetMultiplier: number;
}

export default function Home() {
  const [multiplier, setMultiplier] = useState("2.00");
  const [betAmount, setBetAmount] = useState("");
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(3);
  const [gameRunning, setGameRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  const motionMultiplier = useMotionValue(1);

  const targetMultiplierNum = parseFloat(multiplier);

  const maxHeight =
    crashPoint >= targetMultiplierNum ? 1 : crashPoint / targetMultiplierNum; //

  const scale = useTransform(motionMultiplier, [1, crashPoint], [0.85, 1]);

  const height = useTransform(
    motionMultiplier,
    [1, crashPoint],
    ["0%", `${maxHeight * 100}%`]
  );

  function getWinChance(targetMultiplier: number) {
    if (
      targetMultiplier <= 1 ||
      isNaN(targetMultiplier) ||
      !isFinite(targetMultiplier)
    ) {
      return "0.00";
    }
    const probability = 1 / targetMultiplier;
    return (probability * 100).toFixed(4);
  }
  function getCrashMultiplier() {
    const crash = 1 / (1 - Math.random());
    return Math.min(crash, 5);
  }

  function handlePlaceBet(e: React.FormEvent) {
    e.preventDefault();

    if (!betAmount || parseFloat(multiplier) <= 1) return;

    const crash = getCrashMultiplier();
    setCrashPoint(crash);
    setGameRunning(true);
    setResult(null);
    setCurrentMultiplier(1.0);
    motionMultiplier.set(1); // reset motion value

    animate(motionMultiplier, crash, {
      duration: 1, // animation speed proportional to crash
      ease: "easeOut", // smooth easing
      onUpdate: (v) => setCurrentMultiplier(v), // sync React state
      onComplete: () => {
        // handle win/loss
        const targetMultiplier = parseFloat(multiplier);
        const won = targetMultiplier <= crash;

        setResult(won ? "Win" : "Loss");
        setGameRunning(false);

        // add to history
        const newGame: GameHistory = {
          id: `game-${Date.now()}-${Math.random()}`,
          crashPoint: crash,
          won,
          targetMultiplier,
        };

        setGameHistory((prev) => [newGame, ...prev].slice(0, 5));
      },
    });
  }

  // Check if form is valid
  const isFormValid = betAmount.trim() !== "" && parseFloat(multiplier) > 1;

  return (
    <main className="grid grid-cols-[30%_70%] h-screen bg-gradient-to-br from-slate-900 via-[#141631] to-slate-800">
      <BettingForm
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        isFormValid={isFormValid}
        gameRunning={gameRunning}
        handlePlaceBet={handlePlaceBet}
      />
      <section className="bg-gradient-to-br from-slate-900 via-[#141631] to-slate-800">
        <div className="bg-slate-800/30 h-16 flex items-center px-6 text-white font-medium">
          Fair Play
        </div>
        <div className="flex h-[calc(100%-4rem)] flex-col gap-2 w-full">
          <div className="min-h-16 justify-end flex gap-2 p-4">
            <AnimatePresence mode="popLayout">
              {gameHistory.length > 0 &&
                gameHistory.map((game) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ scale: 0, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0, x: -20 }}
                    transition={{
                      layout: {
                        duration: 0.4,
                        ease: "easeInOut",
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      },
                      scale: {
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                      opacity: { duration: 0.2 },
                      x: { duration: 0.3, ease: "easeOut" },
                    }}
                  >
                    <HistoryItem
                      multiplier={`${game.crashPoint.toFixed(2)}x`}
                      won={game.won}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <GameDisplay
            gameRunning={gameRunning}
            currentMultiplier={currentMultiplier}
            result={result}
            scale={scale}
            height={height}
          />
          <MultiplierChanceInput
            multiplier={multiplier}
            setMultiplier={setMultiplier}
            getWinChance={getWinChance}
          />
        </div>
      </section>
    </main>
  );
}
