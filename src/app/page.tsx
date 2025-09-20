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
  const [payout, setPayout] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  const motionMultiplier = useMotionValue(1);

  const targetMultiplierNum = parseFloat(multiplier);

  const maxHeight =
    crashPoint >= targetMultiplierNum ? 1 : crashPoint / targetMultiplierNum;

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
    setPayout(null);
    setCurrentMultiplier(1.0);
    motionMultiplier.set(1);

    animate(motionMultiplier, crash, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (v) => setCurrentMultiplier(v),
      onComplete: () => {
        const targetMultiplier = parseFloat(multiplier);
        const betAmountNum = parseFloat(betAmount);
        const won = targetMultiplier <= crash;

        setResult(won ? "Win" : "Loss");
        setPayout(won ? betAmountNum * targetMultiplier : 0);
        setGameRunning(false);

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
          <div className="min-h-16 justify-end flex gap-2 pt-4 overflow-hidden">
            <div className=" h-full w-[352px] flex gap-2">
              <AnimatePresence mode="popLayout">
                {gameHistory.slice(0, 5).map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0, x: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: index * 70,
                    }}
                    exit={{ opacity: 1, scale: 1, x: index * 70 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeIn",
                    }}
                    className="absolute"
                  >
                    <HistoryItem
                      multiplier={`${game.crashPoint.toFixed(2)}x`}
                      won={game.won}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <GameDisplay
            gameRunning={gameRunning}
            currentMultiplier={currentMultiplier}
            result={result}
            payout={payout}
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
