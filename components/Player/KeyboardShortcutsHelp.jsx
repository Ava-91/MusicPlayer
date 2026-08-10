"use client";

import { useState } from "react";
import { Keyboard, X } from "lucide-react";

const shortcuts = [
  ["Space", "Play / Pause"],
  ["← / →", "Seek 10 seconds"],
  ["Shift + ←", "Previous song"],
  ["Shift + →", "Next song"],
  ["↑ / ↓", "Volume ±5%"],
  ["M", "Mute / Unmute"],
  ["R", "Cycle repeat"],
  ["S", "Toggle shuffle"],
];

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts"
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/5
          text-zinc-400
          transition-all
          duration-200
          hover:bg-white/10
          hover:text-white
          active:scale-95
        "
      >
        <Keyboard size={18} />
      </button>

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            p-6
            backdrop-blur-sm
          "
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-shortcuts-title"
            onClick={e => e.stopPropagation()}
            className="
              w-full
              max-w-sm
              rounded-3xl
              border
              border-white/10
              bg-zinc-950/95
              p-6
              shadow-2xl
              backdrop-blur-xl
            "
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="keyboard-shortcuts-title"
                className="text-lg font-semibold text-white"
              >
                Keyboard shortcuts
              </h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close keyboard shortcuts"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-zinc-400
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map(([key, description]) => (
                <div
                  key={key}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <kbd
                    className="
                      min-w-20
                      rounded-lg
                      border
                      border-white/10
                      bg-white/5
                      px-2
                      py-1.5
                      text-center
                      font-mono
                      text-xs
                      text-zinc-200
                    "
                  >
                    {key}
                  </kbd>

                  <span className="text-right text-sm text-zinc-400">
                    {description}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 border-t border-white/10 pt-4 text-xs text-zinc-500">
              Shortcuts are disabled while typing.
            </p>
          </div>
        </div>
      )}
    </>
  );
}