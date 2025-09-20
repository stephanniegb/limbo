"use client";

import { motion, MotionValue } from "motion/react";

interface GameDisplayProps {
  gameRunning: boolean;
  currentMultiplier: number;
  result: string | null;
  scale: MotionValue<number>;
  height: MotionValue<string>;
}

export default function GameDisplay({
  gameRunning,
  currentMultiplier,
  result,
  scale,
  height,
}: GameDisplayProps) {
  return (
    <div className="flex-1 grid place-items-center">
      <motion.div
        style={{ scale: gameRunning ? scale : 1 }}
        className="relative font-bold mx-auto h-40 w-70 rounded-[6px] bg-slate-800/50 flex items-center justify-center"
      >
        <motion.div
          style={{ height }}
          className="bg-gradient-to-br from-slate-800 w-full h-1/2 bottom-0 rounded-t-[2px] left-0 opacity-80 absolute to-slate-900 border-t border-slate-600 rounded-b-[6px]"
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
          className="absolute z-10 whitespace-nowrap -translate-y-1/2 top-0 left-1/2 -translate-x-1/2 w-fit px-4 py-2 rounded-full border-4 border-[#141631] text-sm"
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
  );
}
