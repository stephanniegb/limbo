"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface BettingFormProps {
  betAmount: string;
  setBetAmount: (value: string) => void;
  isFormValid: boolean;
  gameRunning: boolean;
  handlePlaceBet: (e: React.FormEvent) => void;
}

export default function BettingForm({
  betAmount,
  setBetAmount,
  isFormValid,
  gameRunning,
  handlePlaceBet,
}: BettingFormProps) {
  const [hasError, setHasError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    if (betAmount === "" || parseFloat(betAmount) < 0.01) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    } else {
      setShowTooltip(false);
      handlePlaceBet(e);
    }
  };

  return (
    <section className="p-8 h-full bg-slate-800/50 backdrop-blur-sm">
      <div className="grid gap-2 mb-6 grid-cols-2 bg-slate-700/50 rounded-[8px] p-2">
        <button className="p-3 w-full rounded-[8px] bg-[#3274d2] border-[0.5px] border-slate-200 text-white">
          Manual
        </button>
        <button className="p-3 w-full rounded-[8px] bg-slate-600 text-gray-300">
          Auto
        </button>
      </div>

      <form className="flex flex-col gap-3">
        <label className="text-white text-sm">
          Bet Amount
          <div className="relative">
            <div className="flex items-center h-12 bg-slate-700 rounded-[4px] gap-2 p-2 mt-2">
              <input
                className={`w-full px-1 h-full outline-none text-white  ${
                  hasError ? "border-2 border-red-500" : ""
                }`}
                placeholder="€ 0.00"
                value={betAmount}
                onChange={(e) => {
                  setBetAmount(e.target.value);
                  setShowTooltip(false);
                }}
                type="number"
                onBlur={() => setHasError(!isFormValid)}
                onFocus={() => setHasError(false)}
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
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                <div className="bg-white text-gray-800 text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                  Minimum bet amount is €0.01
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </label>
        <motion.button
          type="button"
          whileTap={{ scale: 0.975 }}
          className={`p-4 w-full cursor-pointer rounded-[8px] border-[0.5px] border-slate-200 text-white font-medium transition-colors ${
            gameRunning ? "bg-gray-500 cursor-not-allowed" : "bg-[#3274d2]"
          }`}
          disabled={gameRunning}
          onClick={handleButtonClick}
        >
          Place Demo Bet
        </motion.button>

        <div className="relative w-full bg-slate-700 text-white text-sm rounded-lg min-h-[40px] flex items-center justify-center px-3 py-2 after:absolute after:top-0 after:left-1/2 after:transform after:-translate-x-1/2 after:-translate-y-full after:w-0 after:h-0 after:border-l-8 after:border-r-8 after:border-b-8 after:border-transparent after:border-b-slate-700 after:content-['']">
          Enter Bet Amount For Real Play
        </div>
      </form>
    </section>
  );
}
