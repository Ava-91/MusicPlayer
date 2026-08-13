"use client";

import { useState } from "react";
import { ListMusic, Music2 } from "lucide-react";
import { motion } from "framer-motion";

import KeyboardShortcutsHelp from "./KeyboardShortcutsHelp";
import AlbumCover from "./AlbumCover";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import Playlist from "./Playlist";
import Queue from "./Queue";
import VolumeSlider from "./VolumeSlider";
import SearchBar from "./SearchBar";

export default function PlayerCard({
  songs,
  currentSong,
  currentSongId,
  isPlaying,
  currentTime,
  duration,
  volume,
  search,
  favorites,
  shuffle,
  muted,
  onMute,
  repeatMode,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolume,
  onSelectSong,
  onSearchChange,
  onSearchClear,
  onToggleFavorite,
  onShuffle,
  onRepeat,

  // Queue
  queue = [],
  onAddToQueue,
  onPlayNext,
  onRemoveFromQueue,
  onMoveInQueue,
  onMoveQueueUp,
  onMoveQueueDown,
  onClearQueue,
}) {
  const [activeView, setActiveView] = useState("library");

  /*
   * Keep the player stable even when the right panel changes
   * between Library and an empty/populated Queue.
   */
  if (!currentSong) {
    return (
      <section className="flex h-full min-h-0 gap-6">
        <div
          className="
            flex
            w-112.5
            shrink-0
            items-center
            justify-center
            px-6
          "
        >
          <p className="text-sm text-zinc-500">
            No song selected.
          </p>
        </div>

        <div
          className="
            min-h-0
            min-w-0
            flex-1
            rounded-3xl
            border
            border-white/10
            bg-black/20
          "
        />
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 w-full gap-6">
      {/* =====================================================
          LEFT PLAYER
      ====================================================== */}

      <div
        className="
          flex
          h-full
          w-112.5
          min-h-0
          shrink-0
          flex-col
          px-6
        "
      >
        {/* Album cover area */}

        <div className="flex min-h-0 flex-1 items-center justify-center">
          <motion.div
            key={currentSong.id}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            className="w-full"
          >
            <AlbumCover
              cover={currentSong.cover}
              title={currentSong.title}
            />
          </motion.div>
        </div>

        {/* Song information */}

        <div className="mt-6 shrink-0 space-y-2 text-center">
          <h1 className="truncate text-4xl font-bold">
            {currentSong.title}
          </h1>

          <p className="truncate text-lg text-zinc-400">
            {currentSong.artist}
          </p>
        </div>

        {/* Progress */}

        <div className="mt-6 shrink-0">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
          />
        </div>

        {/* Controls */}

        <div className="mt-6 shrink-0 space-y-5 pb-2">
          <Controls
            isPlaying={isPlaying}
            shuffle={shuffle}
            repeatMode={repeatMode}
            onPlayPause={onPlayPause}
            onPrevious={onPrevious}
            onNext={onNext}
            onShuffle={onShuffle}
            onRepeat={onRepeat}
          />

          <VolumeSlider
            volume={volume}
            muted={muted}
            onChange={onVolume}
            onMute={onMute}
          />
        </div>
      </div>

      {/* =====================================================
          RIGHT LIBRARY / QUEUE
      ====================================================== */}

      <div
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-black/20
        "
      >
        {/* Search / Queue header */}

        <div
          className="
            flex
            h-22
            shrink-0
            items-center
            gap-3
            border-b
            border-white/10
            p-6
          "
        >
          <div className="min-w-0 flex-1">
            {activeView === "library" && (
              <SearchBar
                value={search}
                onChange={onSearchChange}
                onClear={onSearchClear}
              />
            )}

            {activeView === "queue" && (
              <div className="flex h-10 items-center">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Playback Queue
                  </h2>

                  <p className="text-xs text-zinc-500">
                    {queue.length}{" "}
                    {queue.length === 1
                      ? "song"
                      : "songs"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <KeyboardShortcutsHelp />
        </div>

        {/* Tabs */}

        <div
          className="
            flex
            h-13
            shrink-0
            border-b
            border-white/10
            px-6
          "
        >
          <button
            type="button"
            onClick={() => setActiveView("library")}
            className={`
              flex
              items-center
              gap-2
              border-b-2
              px-4
              py-3
              text-sm
              font-medium
              transition
              ${
                activeView === "library"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            <Music2 size={16} />
            Library
          </button>

          <button
            type="button"
            onClick={() => setActiveView("queue")}
            className={`
              flex
              items-center
              gap-2
              border-b-2
              px-4
              py-3
              text-sm
              font-medium
              transition
              ${
                activeView === "queue"
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }
            `}
          >
            <ListMusic size={16} />

            Queue

            {queue.length > 0 && (
              <span
                className="
                  rounded-full
                  bg-white/10
                  px-1.5
                  py-0.5
                  text-[10px]
                  text-zinc-400
                "
              >
                {queue.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {activeView === "library" && (
            <Playlist
              songs={songs}
              currentSongId={currentSongId}
              isPlaying={isPlaying}
              favorites={favorites}
              onSelectSong={onSelectSong}
              onToggleFavorite={onToggleFavorite}
              onAddToQueue={onAddToQueue}
              onPlayNext={onPlayNext}
            />
          )}

          {activeView === "queue" && (
            <Queue
              queue={queue}
              currentSongId={currentSongId}
              onRemoveFromQueue={onRemoveFromQueue}
              onMoveInQueue={onMoveInQueue}
              onMoveQueueUp={onMoveQueueUp}
              onMoveQueueDown={onMoveQueueDown}
              onClearQueue={onClearQueue}
            />
          )}
        </div>
      </div>
    </section>
  );
}