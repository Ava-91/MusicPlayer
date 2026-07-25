"use client";

import {
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

export default function VolumeSlider({
  volume,
  onChange,
}) {
  const icon =
    volume === 0 ? (
      <VolumeX size={18} />
    ) : volume < 0.5 ? (
      <Volume1 size={18} />
    ) : (
      <Volume2 size={18} />
    );

  return (
    <div
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-white/[0.04]
        px-4
        py-3
        backdrop-blur-xl
      "
    >
      <button
        type="button"
        aria-label="Volume"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-white/5
          text-zinc-300
          transition-all
          duration-300
          hover:bg-white/10
          hover:text-white
        "
      >
        {icon}
      </button>

      <div className="relative flex-1">
        {/* background */}
        <div
          className="
            absolute
            left-0
            top-1/2
            h-1.5
            w-full
            -translate-y-1/2
            rounded-full
            bg-white/10
          "
        />

        {/* active fill */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-1/2
            h-1.5
            -translate-y-1/2
            rounded-full
            bg-gradient-to-r
            from-sky-400
            via-blue-500
            to-cyan-400
            shadow-[0_0_18px_rgba(59,130,246,.45)]
            transition-all
            duration-200
          "
          style={{
            width: `${volume * 100}%`,
          }}
        />

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) =>
            onChange(Number(e.target.value))
          }
          aria-label="Volume slider"
          className="
            relative
            h-1.5
            w-full
            cursor-pointer
            appearance-none
            bg-transparent

            [&::-webkit-slider-runnable-track]:bg-transparent

            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,.6)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200

            group-hover:[&::-webkit-slider-thumb]:scale-110

            [&::-moz-range-track]:bg-transparent
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
          "
        />
      </div>

      <span
        className="
          w-10
          text-right
          text-xs
          font-medium
          text-zinc-400
        "
      >
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}