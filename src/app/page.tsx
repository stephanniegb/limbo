"use client";

import { useState } from "react";
import HistoryItem from "@/components/HistoryItem";
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
      <section className="p-8 h-full bg-slate-800/50 backdrop-blur-sm">
        <div className="grid gap-2 mb-6 grid-cols-2 bg-slate-700/50 rounded-[8px] p-2">
          <button className="p-3 w-full rounded-[8px] bg-[#3274d2] border-[0.5px] border-slate-200  text-white">
            Manual
          </button>
          <button className="p-3 w-full rounded-[8px] bg-slate-600 text-gray-300">
            Auto
          </button>
        </div>

        <form onSubmit={handlePlaceBet} className="flex flex-col gap-3">
          <label className="text-white text-sm">
            Bet Amount
            <div className="flex items-center h-12 bg-slate-700 rounded-[4px] gap-2 p-2  mt-2">
              <input
                className="w-full px-1 h-full  outline-none text-white    "
                placeholder="€ 0.00"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                type="number"
                step="0.01"
                min="0.01"
              />
              <div className="flex gap-1">
                <button className="px-2 py-1 text-xs bg-slate-600 text-gray-300 rounded">
                  1/2
                </button>
                <button className="px-2 py-1 text-xs bg-slate-600 text-gray-300 rounded">
                  2x
                </button>
              </div>
            </div>
          </label>
          <motion.button
            whileTap={{ scale: 0.975 }}
            className={`p-4 w-full cursor-pointer rounded-[8px] border-[0.5px] border-slate-200 text-white font-medium transition-colors bg-[#3274d2]`}
            disabled={!isFormValid || gameRunning}
          >
            Place Demo Bet
          </motion.button>

          <div className="relative w-full bg-slate-700 text-white text-sm rounded-lg min-h-[40px] flex items-center justify-center px-3 py-2 after:absolute after:top-0 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-full after:w-0 after:h-0 after:border-l-8 after:border-r-8 after:border-b-8 after:border-transparent after:border-b-slate-700 after:content-['']">
            Enter Bet Amount For Real Play
          </div>
        </form>
      </section>
      <section className="bg-gradient-to-br from-slate-900 via-[#141631] to-slate-800">
        <div className="bg-slate-800/30 h-16 flex items-center px-6 text-white font-medium">
          Fair Play
        </div>
        <div className="flex h-[calc(100%-4rem)] flex-col gap-2 w-full">
          <div className="min-h-16  justify-end flex gap-2 p-4">
            {gameHistory.length > 0 ? (
              gameHistory.map((game, index) => (
                <HistoryItem
                  key={index}
                  multiplier={`${game.crashPoint.toFixed(2)}x`}
                  won={game.won}
                />
              ))
            ) : (
              // Show placeholder when no games have been played yet
              <div className="text-gray-400 text-sm">No games played yet</div>
            )}
          </div>
          <div className="flex-1 grid place-items-center">
            <motion.div
              style={{ scale: gameRunning ? scale : 1 }}
              className="relative font-bold mx-auto h-40 w-70 rounded-[6px] bg-slate-800/50 flex items-center justify-center "
            >
              <motion.div
                style={{ height }}
                className="bg-gradient-to-br from-slate-800 w-full h-1/2 bottom-0 rounded-t-[2px] left-0 opacity-80 absolute to-slate-900 border-t  border-slate-600 rounded-b-[6px]"
              />
              <motion.div
                initial={{
                  scale: 1,
                  y: 0,
                  backgroundColor: "#1d293d",
                  color: "#ffffff",
                }}
                animate={
                  result === "Win"
                    ? {
                        scale: [1, 1.1, 1],
                        y: [0, -5, 0],
                        backgroundColor: ["#1d293d", "#22c55e", "#1d293d"],
                        color: ["#ffffff", "#000000", "#ffffff"],
                      }
                    : {}
                }
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className={`absolute z-10 whitespace-nowrap -translate-y-1/2 top-0 left-1/2 -translate-x-1/2 w-fit px-4 py-2 rounded-full  border-4 border-[#141631]  text-sm
                  
                `}
              >
                Demo Mode
              </motion.div>
              <span
                className={`text-6xl relative z-10 font-bold ${
                  result === "Win" ? "text-green-400" : "text-white"
                }`}
              >
                {currentMultiplier.toFixed(2)}x
              </span>
            </motion.div>
          </div>
          <div className="min-h-40  w-full flex gap-4 p-4">
            <div className="flex-1">
              <label className="block text-white text-sm mb-1">
                Multiplier
              </label>
              <div className="flex rounded-[8px] p-2 h-14 items-center gap-2 bg-slate-700">
                <input
                  className="w-full bg-[#14163189] rounded-[4px] px-2 h-full text-white outline-none"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  type="number"
                  step="0.01"
                  min="1.01"
                  max="1000"
                />
                <button
                  type="button"
                  onClick={() => setMultiplier("")}
                  className="w-8 text-white hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-white text-sm mb-1">Chance</label>
              <div className="flex rounded-[8px] p-2 h-14 items-center gap-2 bg-slate-700">
                <div className="w-full  bg-[#14163189] flex items-center  rounded-[4px] px-2 h-full text-white outline-none">
                  <p>{getWinChance(Number(multiplier))}</p>
                </div>
                <span className="w-8 text-white text-center">%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
