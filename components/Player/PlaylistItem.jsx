"use client";

import { memo } from "react";
import { motion } from "framer-motion";

import Image from "next/image";

import {
  Heart,
  MoreHorizontal,
  Play,
} from "lucide-react";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) {
    return "--:--";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function PlaylistItem({
  song,
  active,
  isPlaying,
  onClick,
}) {
  return (
    <motion.button
      layout
      whileHover={{
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.985,
      }}
      onClick={onClick}
      className={`
        group

        relative

        flex
        w-full
        items-center
        gap-4

        overflow-hidden

        rounded-2xl

        border

        px-4
        py-3

        transition-all
        duration-300

        ${
          active
            ? `
              border-cyan-400/40

              bg-cyan-500/10

              shadow-[0_0_40px_rgba(34,211,238,.12)]
            `
            : `
              border-white/5

              bg-white/[0.03]

              hover:border-white/10
              hover:bg-white/[0.06]
            `
        }
      `}
    >

      {/* Active Glow */}

      {active && (
        <motion.div
          layoutId="playlist-active"

          className="
            absolute
            inset-0

            rounded-2xl

            bg-gradient-to-r

            from-cyan-500/10
            via-sky-500/10
            to-blue-500/10

            pointer-events-none
          "
        />
      )}

      {/* Cover */}

      <div
        className="
          relative

          h-16
          w-16

          shrink-0

          overflow-hidden

          rounded-xl
        "
      >
        <Image
          src={song.cover}
          alt={song.title}
          fill
          sizes="64px"
          className="
            object-cover

            transition-transform
            duration-300

            group-hover:scale-110
          "
        />

        {/* Hover Overlay */}

        <div
          className="
            absolute
            inset-0

            flex
            items-center
            justify-center

            bg-black/50

            opacity-0

            transition-opacity
            duration-200

            group-hover:opacity-100
          "
        >
          <Play
            size={22}
            fill="white"
            className="text-white"
          />
        </div>
      </div>

      {/* Song Info */}

      <div
        className="
          min-w-0
          flex-1
          text-left
        "
      >
        <p
          className={`
            truncate

            font-semibold

            transition-colors

            ${
              active
                ? "text-cyan-300"
                : "text-white"
            }
          `}
        >
          {song.title}
        </p>

        <p
          className="
            truncate

            text-sm

            text-zinc-400
          "
        >
          {song.artist}
        </p>

        {song.album && (
          <p
            className="
              truncate

              text-xs

              text-zinc-500
            "
          >
            {song.album}
          </p>
        )}
      </div>

      {/* Right Side */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        {/* Playing Animation */}

        {active && isPlaying ? (
          <div
            className="
              flex
              h-5
              items-end
              gap-[2px]
            "
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="
                  w-[3px]

                  rounded-full

                  bg-cyan-400

                  animate-[equalizer_1s_ease-in-out_infinite]
                "
                style={{
                  height: `${10 + i * 3}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <span
            className="
              w-12

              text-right

              text-sm

              text-zinc-500

              tabular-nums
            "
          >
            {formatTime(song.duration)}
          </span>
        )}

        {/* Favorite */}

        <button
          type="button"

          onClick={(e) =>
            e.stopPropagation()
          }

          className="
            rounded-full

            p-2

            text-zinc-500

            opacity-0

            transition-all

            hover:text-pink-400

            group-hover:opacity-100
          "
        >
          <Heart size={18} />
        </button>

        {/* More */}

        <button
          type="button"

          onClick={(e) =>
            e.stopPropagation()
          }

          className="
            rounded-full

            p-2

            text-zinc-500

            opacity-0

            transition-all

            hover:text-white

            group-hover:opacity-100
          "
        >
          <MoreHorizontal size={18} />
        </button>

      </div>

    </motion.button>
  );
}

export default memo(PlaylistItem);