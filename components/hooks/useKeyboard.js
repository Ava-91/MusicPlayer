"use client";

import { useEffect } from "react";

export default function useKeyboard({
  togglePlay,
  nextSong,
  previousSong,
  seekForward,
  seekBackward,
  toggleMute,
  adjustVolume,
  cycleRepeat,
  toggleShuffle,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore shortcuts while typing
      const tag = document.activeElement?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        // Play / Pause
        case "Space":
          e.preventDefault();
          togglePlay?.();
          break;

        // Seek / Navigation
        case "ArrowRight":
          e.preventDefault();

          if (e.shiftKey) {
            nextSong?.();
          } else {
            seekForward?.(10);
          }

          break;

        case "ArrowLeft":
          e.preventDefault();

          if (e.shiftKey) {
            previousSong?.();
          } else {
            seekBackward?.(10);
          }

          break;

        // Volume
        case "ArrowUp":
          e.preventDefault();
          adjustVolume?.(0.05);
          break;

        case "ArrowDown":
          e.preventDefault();
          adjustVolume?.(-0.05);
          break;

        // Mute
        case "KeyM":
          e.preventDefault();
          toggleMute?.();
          break;

        // Repeat
        case "KeyR":
          e.preventDefault();
          cycleRepeat?.();
          break;

        // Shuffle
        case "KeyS":
          e.preventDefault();
          toggleShuffle?.();
          break;

        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    togglePlay,
    nextSong,
    previousSong,
    seekForward,
    seekBackward,
    toggleMute,
    adjustVolume,
    cycleRepeat,
    toggleShuffle,
  ]);
}