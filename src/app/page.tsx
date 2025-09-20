"use client";

import { useState } from "react";
import HistoryItem from "@/components/HistoryItem";
import MultiplierChanceInput from "@/components/MultiplierChanceInput";
import GameDisplay from "@/components/GameDisplay";
import BettingForm from "@/components/BettingForm";
import { motion, useMotionValue, useTransform } from "motion/react";
import { animate } from "motion";

interface GameHistory {
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
  const pillScale = useMotionValue(1);

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
    let probability = 1 / targetMultiplier;
    return (probability * 100).toFixed(4);
  }
  function getCrashMultiplier() {
    let crash = 1 / (1 - Math.random());
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
          <div className="min-h-16  justify-end flex gap-2 p-4">
            {gameHistory.length > 0 &&
              gameHistory.map((game, index) => (
                <HistoryItem
                  key={index}
                  multiplier={`${game.crashPoint.toFixed(2)}x`}
                  won={game.won}
                />
              ))}
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
