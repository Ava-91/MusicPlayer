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
  const [activeView, setActiveView] =
    useState("library");

  // Guard against missing song
  if (!currentSong) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-400">
        No matching song found.
      </div>
    );
  }

  return (
    <section className="flex h-full gap-6">
      {/* Left Player */}
      <motion.div
        layout
        className="
          flex
          w-112.5
          shrink-0
          flex-col
          justify-between
          px-6
        "
      >
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
          exit={{
            opacity: 0,
            y: -15,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <AlbumCover
            cover={currentSong.cover}
            title={currentSong.title}
          />
        </motion.div>

        <div className="space-y-2 text-center">
          <h1 className="truncate text-4xl font-bold">
            {currentSong.title}
          </h1>

          <p className="truncate text-lg text-zinc-400">
            {currentSong.artist}
          </p>
        </div>

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />

        <div className="space-y-5">
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
      </motion.div>

      {/* Right Library / Queue */}
      <div
        className="
          flex
          flex-1
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-black/20
        "
      >
        {/* Search + Keyboard Help */}
        <div
          className="
            flex
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

        {/* Library / Queue Tabs */}
        <div
          className="
            flex
            border-b
            border-white/10
            px-6
          "
        >
          <button
            type="button"
            onClick={() =>
              setActiveView("library")
            }
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
            onClick={() =>
              setActiveView("queue")
            }
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
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {activeView === "library" && (
            <Playlist
              songs={songs}
              currentSongId={currentSongId}
              isPlaying={isPlaying}
              favorites={favorites}
              onSelectSong={onSelectSong}
              onToggleFavorite={
                onToggleFavorite
              }
              onAddToQueue={
                onAddToQueue
              }
              onPlayNext={onPlayNext}
            />
          )}

          {activeView === "queue" && (
            <Queue
              queue={queue}
              currentSongId={currentSongId}
              onRemoveFromQueue={
                onRemoveFromQueue
              }
              onMoveInQueue={
                onMoveInQueue
              }
              onMoveQueueUp={
                onMoveQueueUp
              }
              onMoveQueueDown={
                onMoveQueueDown
              }
              onClearQueue={
                onClearQueue
              }
            />
          )}
        </div>
      </div>
    </section>
  );
}