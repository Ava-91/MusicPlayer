"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaylistItem from "./PlaylistItem";

export default function Playlist({
  songs,
  currentIndex,
  isPlaying,
  search = "",
  onSelectSong,
}) {
  const activeSongRef = useRef(null);

  // ===========================================
  // Filter songs
  // ===========================================

  const filteredSongs = useMemo(() => {
    if (!search.trim()) {
      return songs;
    }

    const query = search.toLowerCase();

    return songs.filter((song) =>
      `${song.title} ${song.artist} ${song.album}`
        .toLowerCase()
        .includes(query)
    );
  }, [songs, search]);

  // ===========================================
  // Scroll active song into view
  // ===========================================

  useEffect(() => {
    if (!activeSongRef.current) return;

    activeSongRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [currentIndex]);

  // ===========================================
  // Empty Search
  // ===========================================

  if (filteredSongs.length === 0) {
    return (
      <div className="flex h-full flex-col">

        <div
          className="
            sticky
            top-0
            z-10

            mb-4

            border-b
            border-white/10

            bg-black/40
            backdrop-blur-xl

            pb-4
          "
        >
          <h2
            className="
              text-xl
              font-bold
            "
          >
            Playlist
          </h2>

          <p className="text-sm text-zinc-400">
            0 results
          </p>
        </div>

        <div
          className="
            flex
            flex-1
            items-center
            justify-center
            text-center
          "
        >
          <div className="space-y-2">

            <p className="text-lg font-semibold">
              Nothing found
            </p>

            <p className="text-zinc-500">
              Try another search.
            </p>

          </div>
        </div>

      </div>
    );
  }

  // ===========================================
  // UI
  // ===========================================

  return (
    <div className="flex h-full flex-col">

      {/* Header */}

      <div
        className="
          sticky
          top-0
          z-20

          mb-5

          border-b
          border-white/10

          bg-black/40
          backdrop-blur-xl

          pb-4
        "
      >
        <div className="flex items-end justify-between">

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Playlist
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-zinc-400
              "
            >
              {filteredSongs.length} songs
            </p>

          </div>

          <span
            className="
              rounded-full
              border
              border-white/10

              bg-white/5

              px-3
              py-1

              text-xs
              text-zinc-400
            "
          >
            Local Library
          </span>

        </div>
      </div>

      {/* Songs */}

      <motion.div
        layout
        className="
          flex-1
          space-y-2
          overflow-y-auto
          pr-2

          scrollbar-thin
          scrollbar-thumb-white/10
        "
      >
        <AnimatePresence initial={false}>

          {filteredSongs.map((song) => {
            const originalIndex = songs.findIndex(
              (s) => s.audio === song.audio
            );

            const active =
              originalIndex === currentIndex;

            return (
              <motion.div
                key={song.audio}
                layout
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                }}
                transition={{
                  duration: 0.2,
                }}
                ref={
                  active
                    ? activeSongRef
                    : null
                }
              >
                <PlaylistItem
                  song={song}
                  active={active}
                  isPlaying={isPlaying}
                  onClick={() =>
                    onSelectSong(originalIndex)
                  }
                />
              </motion.div>
            );
          })}

        </AnimatePresence>
      </motion.div>

    </div>
  );
}