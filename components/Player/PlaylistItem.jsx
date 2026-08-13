"use client";

import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  Heart,
  MoreHorizontal,
  Play,
  Pause,
  ListPlus,
  ListMusic,
} from "lucide-react";

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) {
    return "--:--";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function PlaylistItem({
  song,
  active,
  isPlaying,
  isFavorite,
  onClick,
  onToggleFavorite,
  onAddToQueue,
  onPlayNext,
}) {
  const [imageError, setImageError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Close the menu when clicking outside.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [menuOpen]);

  const handleAddToQueue = (event) => {
    event.stopPropagation();

    onAddToQueue?.(song);
    setMenuOpen(false);
  };

  const handlePlayNext = (event) => {
    event.stopPropagation();

    onPlayNext?.(song);
    setMenuOpen(false);
  };

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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" ||
          e.key === " "
        ) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`
        group
        relative
        flex
        w-full
        items-center
        gap-4
        overflow-visible
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
              bg-white/3
              hover:border-white/10
              hover:bg-white/6
            `
        }
      `}
    >
      {/* Active Glow */}
      {active && (
        <motion.div
          layoutId="playlist-active"
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-2xl
            bg-linear-to-r
            from-cyan-500/10
            via-sky-500/10
            to-blue-500/10
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
          bg-zinc-800
        "
      >
        {song.cover && !imageError ? (
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
            onError={() => setImageError(true)}
            unoptimized={song.cover?.startsWith(
              "http"
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm font-medium text-zinc-500">
              {song.title
                ?.charAt(0)
                .toUpperCase() || "?"}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className="
            pointer-events-none
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
          {active && isPlaying ? (
            <Pause
              size={22}
              fill="white"
              className="text-white"
            />
          ) : (
            <Play
              size={22}
              fill="white"
              className="text-white"
            />
          )}
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
          relative
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
              gap-0.5
            "
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="
                  w-0.75
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
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(song.id);
          }}
          className="
            rounded-full
            p-2
            text-zinc-500
            opacity-0
            transition-all
            hover:text-pink-400
            group-hover:opacity-100
          "
          aria-label={
            isFavorite
              ? `Remove ${song.title} from favorites`
              : `Add ${song.title} to favorites`
          }
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "fill-pink-400 text-pink-400"
                : ""
            }
          />
        </button>

        {/* More Menu */}
        <div
          ref={menuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((open) => !open);
            }}
            className="
              rounded-full
              p-2
              text-zinc-500
              opacity-0
              transition-all
              hover:bg-white/10
              hover:text-white
              group-hover:opacity-100
            "
            aria-label={`More options for ${song.title}`}
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div
              className="
                absolute
                right-0
                top-full
                z-50
                mt-2
                w-48
                overflow-hidden
                rounded-xl
                border
                border-white/10
                bg-zinc-900
                p-1
                shadow-2xl
              "
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                type="button"
                onClick={handleAddToQueue}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-zinc-300
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <ListPlus size={16} />
                Add to Queue
              </button>

              <button
                type="button"
                onClick={handlePlayNext}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-2.5
                  text-left
                  text-sm
                  text-zinc-300
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <ListMusic size={16} />
                Play Next
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default memo(PlaylistItem);