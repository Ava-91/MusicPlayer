"use client";

import {
  ListMusic,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function QueueButton({
  expanded,
  onToggle,
  count = 0,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={
        expanded
          ? "Collapse playback queue"
          : "Expand playback queue"
      }
      className="
        group
        flex
        w-full
        items-center
        justify-between
        rounded-2xl
        border
        border-white/10
        bg-white/5
        px-5
        py-4
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-white/20
        hover:bg-white/10
        active:scale-[0.98]
      "
    >
      {/* Queue Info */}
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-linear-to-br
            from-blue-500/20
            to-cyan-400/20
            text-blue-400
            transition-transform
            duration-300
            group-hover:rotate-6
          "
        >
          <ListMusic size={22} />
        </div>

        <div className="text-left">
          <p className="font-semibold text-white">
            Queue
          </p>

          <p className="text-sm text-zinc-400">
            {count}{" "}
            {count === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      {/* Expand / Collapse */}
      <div
        className="
          rounded-full
          bg-white/5
          p-2
          text-zinc-300
          transition-all
          duration-300
          group-hover:bg-white/10
          group-hover:text-white
        "
      >
        {expanded ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </div>
    </button>
  );
}