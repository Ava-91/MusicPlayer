"use client";

import {
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

export default function VolumeSlider({
  volume,
  muted,
  onChange,
  onMute,
}) {
  const isMuted = muted || volume === 0;

  const icon = isMuted ? (
    <VolumeX size={20} />
  ) : volume < 0.5 ? (
    <Volume1 size={20} />
  ) : (
    <Volume2 size={20} />
  );

  return (
    <div className="flex items-center gap-3">
      {/* Mute Button */}

      <button
        type="button"
        onClick={onMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        aria-pressed={isMuted}
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          text-zinc-400
          transition-all
          duration-200
          hover:bg-white/10
          hover:text-white
          active:scale-95
        "
      >
        {icon}
      </button>

      {/* Volume Slider */}

      <div className="relative flex h-4 flex-1 items-center">
        {/* Background */}

        <div
          className="
            pointer-events-none
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

        {/* Active Fill */}

        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-1/2
            h-1.5
            -translate-y-1/2
            rounded-full
            bg-linear-to-r
            from-sky-400
            via-blue-500
            to-cyan-400
            shadow-[0_0_18px_rgba(59,130,246,.45)]
            transition-[width]
            duration-200
          "
          style={{
            width: `${volume * 100}%`,
          }}
        />

        {/* Slider */}

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
            z-10
            h-4
            w-full
            cursor-pointer
            appearance-none
            bg-transparent

            [&::-webkit-slider-runnable-track]:h-1.5
            [&::-webkit-slider-runnable-track]:bg-transparent

            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(255,255,255,.6)]
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-110

            [&::-moz-range-track]:h-1.5
            [&::-moz-range-track]:bg-transparent

            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
          "
        />
      </div>

      {/* Volume Percentage */}

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