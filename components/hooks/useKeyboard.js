"use client";

import { useEffect } from "react";

export default function useKeyboard({
  togglePlay,
  nextSong,
  previousSong,
  seekForward,
  seekBackward,
  toggleMute,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore shortcuts while typing
      const tag =
        document.activeElement?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay?.();
          break;

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

        case "KeyM":
          toggleMute?.();
          break;

        default:
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    togglePlay,
    nextSong,
    previousSong,
    seekForward,
    seekBackward,
    toggleMute,
  ]);
}