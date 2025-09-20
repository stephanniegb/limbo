"use client";

import { useState } from "react";

interface MultiplierChanceInputProps {
  multiplier: string;
  setMultiplier: (value: string) => void;
  getWinChance: (targetMultiplier: number) => string;
}

export default function MultiplierChanceInput({
  multiplier,
  setMultiplier,
  getWinChance,
}: MultiplierChanceInputProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if tooltip should be shown
  const shouldShowTooltip = multiplier === "" || parseFloat(multiplier) < 1.01;

  return (
    <div className="min-h-40 w-full flex gap-4 p-4">
      <div className="flex-1">
        <label className="block text-white text-sm mb-1">Multiplier</label>
        <div className="relative">
          <div className="flex rounded-[8px] p-2 h-14 items-center gap-2 bg-slate-700">
            <input
              className={`w-full bg-[#14163189] rounded-[4px] px-2 h-full text-white outline-none ${
                hasError
                  ? "border-2 border-red-500"
                  : "focus:border-2 focus:border-blue-500"
              }`}
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              onMouseEnter={() => setShowTooltip(shouldShowTooltip)}
              onMouseLeave={() => setShowTooltip(false)}
              onBlur={() => setHasError(shouldShowTooltip)}
              onFocus={() => setHasError(false)}
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
          {showTooltip && shouldShowTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
              <div className="bg-white text-gray-800 text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                Minimum of 1.01
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <label className="block text-white text-sm mb-1">Chance</label>
        <div className="flex rounded-[8px] p-2 h-14 items-center gap-2 bg-slate-700">
          <div
            className={`w-full bg-[#14163189] flex items-center rounded-[4px] px-2 h-full text-white outline-none`}
          >
            <p>{getWinChance(Number(multiplier))}</p>
          </div>
          <span className="w-8 text-white text-center">%</span>
        </div>
      </div>
    </div>
  );
}
