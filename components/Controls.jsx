"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

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
  // ==========================
  // Keyboard Shortcuts
  // ==========================

  useEffect(() => {
    function handleKey(e) {
      const tag = document.activeElement?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA"
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          onPlayPause();
          break;

        case "ArrowLeft":
          onPrevious();
          break;

        case "ArrowRight":
          onNext();
          break;
      }
    }

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, [
    onPlayPause,
    onPrevious,
    onNext,
  ]);

  // ==========================
  // Media Session
  // ==========================

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler(
      "play",
      onPlayPause
    );

    navigator.mediaSession.setActionHandler(
      "pause",
      onPlayPause
    );

    navigator.mediaSession.setActionHandler(
      "previoustrack",
      onPrevious
    );

    navigator.mediaSession.setActionHandler(
      "nexttrack",
      onNext
    );
  }, [
    onPlayPause,
    onPrevious,
    onNext,
  ]);

  return (
    <div className="flex items-center justify-center gap-7">

      {/* Previous */}

      <motion.button
        whileHover={{
          scale: 1.08,
          y: -2,
        }}
        whileTap={{
          scale: 0.92,
        }}
        type="button"
        aria-label="Previous Song"
        onClick={onPrevious}
        className="
          group
          relative
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full

          border
          border-white/10

          bg-white/5

          backdrop-blur-xl

          shadow-lg

          transition-colors

          hover:bg-white/10
        "
      >
        <IoPlaySkipBack
          size={24}
          className="
            transition-transform
            duration-300
            group-hover:-translate-x-0.5
          "
        />
      </motion.button>

      {/* Play */}

      <motion.button
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.9,
        }}
        animate={{
          boxShadow: isPlaying
            ? [
                "0 0 25px rgba(59,130,246,.35)",
                "0 0 55px rgba(59,130,246,.75)",
                "0 0 25px rgba(59,130,246,.35)",
              ]
            : "0 0 25px rgba(59,130,246,.25)",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        type="button"
        aria-label={
          isPlaying ? "Pause" : "Play"
        }
        onClick={onPlayPause}
        className="
          relative
          flex
          h-20
          w-20
          items-center
          justify-center

          overflow-hidden

          rounded-full

          bg-gradient-to-br
          from-blue-500
          via-blue-600
          to-indigo-700

          text-white
        "
      >

        {/* Shine */}

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-br

            from-white/25

            via-transparent

            to-transparent
          "
        />

        <motion.div
          key={isPlaying ? "pause" : "play"}
          initial={{
            opacity: 0,
            scale: 0.7,
            rotate: -15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: .25,
          }}
        >
          {isPlaying ? (
            <IoPause size={34} />
          ) : (
            <IoPlay
              size={34}
              className="translate-x-[2px]"
            />
          )}
        </motion.div>

      </motion.button>

      {/* Next */}

      <motion.button
        whileHover={{
          scale: 1.08,
          y: -2,
        }}
        whileTap={{
          scale: 0.92,
        }}
        type="button"
        aria-label="Next Song"
        onClick={onNext}
        className="
          group
          relative
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-full

          border
          border-white/10

          bg-white/5

          backdrop-blur-xl

          shadow-lg

          transition-colors

          hover:bg-white/10
        "
      >
        <IoPlaySkipForward
          size={24}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-0.5
          "
        />
      </motion.button>

    </div>
  );
}