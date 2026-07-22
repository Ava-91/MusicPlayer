"use client";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
} from "react-icons/io5";
export default function Controls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-6
      "
    >
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous song"
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/5
          text-xl
          transition-all
          hover:bg-white/10
          active:scale-95
        "
      >
        <IoPlaySkipBack size={22} />
      </button>

      <button
        type="button"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-blue-600
          text-2xl
          shadow-[0_0_40px_rgba(37,99,235,.45)]
          transition-all
          hover:bg-blue-500
          hover:scale-105
          active:scale-95
        "
      >
        {isPlaying ? (
          <IoPause size={28} />
        ) : (
          <IoPlay size={28} />
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next song"
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/5
          text-xl
          transition-all
          hover:bg-white/10
          active:scale-95
        "
      >
        <IoPlaySkipForward size={22} />
      </button>
    </div>
  );
}