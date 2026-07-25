"use client";

import { useRef } from "react";

export default function ProgressBar({
  currentTime,
  duration,
  onSeek,
}) {
  const barRef = useRef(null);

  function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) {
      return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const percentage =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  function handleClick(e) {
    if (!barRef.current || duration <= 0) return;

    const rect =
      barRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const percent = Math.min(
      Math.max(x / rect.width, 0),
      1
    );

    onSeek(percent * duration);
  }

  function handleDrag(e) {
    onSeek(Number(e.target.value));
  }

  return (
    <div className="space-y-3">

      {/* Progress Bar */}

      <div
        ref={barRef}
        className="
          group
          relative
          h-2
          cursor-pointer
          rounded-full
          bg-white/10
          overflow-hidden
        "
      >
        {/* Progress */}

        <div
          className="
            absolute
            left-0
            top-0
            h-full

            rounded-full

            bg-linear-to-r
            from-sky-400
            via-cyan-400
            to-blue-500

            transition-[width]
            duration-150
          "
          style={{
            width: `${percentage}%`,
          }}
        />

        {/* Glow */}

        <div
          className="
            absolute
            left-0
            top-0
            h-full

            bg-cyan-400/40
            blur-md

            transition-[width]
            duration-150
          "
          style={{
            width: `${percentage}%`,
          }}
        />

        {/* Thumb */}

        <div
          className="
            absolute
            top-1/2

            h-5
            w-5

            -translate-y-1/2
            -translate-x-1/2

            rounded-full

            border-2
            border-white

            bg-cyan-400

            shadow-[0_0_18px_rgba(34,211,238,.8)]

            opacity-0
            scale-75

            transition-all
            duration-200

            group-hover:opacity-100
            group-hover:scale-100
          "
          style={{
            left: `${percentage}%`,
          }}
        />

        {/* Invisible Slider */}

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={handleDrag}
          className="
            absolute
            inset-0

            h-full
            w-full

            cursor-pointer

            opacity-0
          "
        />
      </div>

      {/* Time */}

      <div
        className="
          flex
          items-center
          justify-between

          text-xs
          font-medium

          text-zinc-400
          tabular-nums
        "
      >
        <span>
          {formatTime(currentTime)}
        </span>

        <span>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}