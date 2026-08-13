"use client";

import { useState } from "react";
import { Clock3, ListMusic, Music2 } from "lucide-react";
import { motion } from "framer-motion";

import KeyboardShortcutsHelp from "./KeyboardShortcutsHelp";
import AlbumCover from "./AlbumCover";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import Playlist from "./Playlist";
import Queue from "./Queue";
import RecentlyPlayed from "./RecentlyPlayed";
import VolumeSlider from "./VolumeSlider";
import SearchBar from "./SearchBar";

export default function PlayerCard({
  songs = [],
  search,
  favorites,
  onSelectSong,
  onSearchChange,
  onSearchClear,
  onToggleFavorite,

  currentSong,
  currentSongId,

  isPlaying,
  currentTime,
  duration,
  buffered,
  loadingSong,

  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolume,
  onMute,
  onShuffle,
  onRepeat,

  volume,
  muted,

  shuffle,
  repeatMode,

  recentlyPlayed = [],
  onPlayRecentlyPlayed,
  onClearRecentlyPlayed,
  onRemoveRecentlyPlayed,

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

  const tabClass = (view) =>
    `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
      activeView === view
        ? "border-white text-white"
        : "border-transparent text-zinc-500 hover:text-zinc-300"
    }`;

  return (
    <section className="flex h-full min-h-0 w-full min-w-0 gap-6">
      {/* Left player */}

      <div className="flex h-full min-h-0 w-112.5 shrink-0 flex-col px-6">
        {/* Album cover */}

        <div className="flex min-h-0 flex-1 items-center justify-center">
          {currentSong ? (
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <AlbumCover
                cover={currentSong.cover}
                title={currentSong.title}
              />
            </motion.div>
          ) : (
            <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-zinc-600">
              <Music2 size={48} strokeWidth={1.25} />
            </div>
          )}
        </div>

        {/* Song information */}

        <div className="mt-6 h-17 shrink-0 space-y-2 text-center">
          <h1 className="truncate text-4xl font-bold">
            {currentSong?.title || "No song selected"}
          </h1>

          <p className="truncate text-lg text-zinc-400">
            {currentSong?.artist || "Choose a song to start playing"}
          </p>
        </div>

        {/* Progress */}

        <div className="mt-6 shrink-0">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            buffered={buffered}
            onSeek={onSeek}
          />
        </div>

        {/* Controls */}

        <div className="mt-6 shrink-0 space-y-5 pb-2">
          <Controls
            isPlaying={isPlaying}
            shuffle={shuffle}
            repeatMode={repeatMode}
            loading={loadingSong}
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

      {/* Right library / queue / recently played */}

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/20">
        {/* Header */}

        <div className="flex h-22 shrink-0 items-center gap-3 border-b border-white/10 p-6">
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
                    {queue.length} {queue.length === 1 ? "song" : "songs"}
                  </p>
                </div>
              </div>
            )}

            {activeView === "recentlyPlayed" && (
              <div className="flex h-10 items-center">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Recently Played
                  </h2>

                  <p className="text-xs text-zinc-500">
                    {recentlyPlayed.length}{" "}
                    {recentlyPlayed.length === 1 ? "song" : "songs"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <KeyboardShortcutsHelp />
        </div>

        {/* Tabs */}

        <div
          role="tablist"
          aria-label="Music player views"
          className="flex h-13 shrink-0 border-b border-white/10 px-6"
        >
          {/* Library */}

          <button
            type="button"
            role="tab"
            aria-selected={activeView === "library"}
            tabIndex={activeView === "library" ? 0 : -1}
            onClick={() => setActiveView("library")}
            className={tabClass("library")}
          >
            <Music2 size={16} />
            Library
          </button>

          {/* Queue */}

          <button
            type="button"
            role="tab"
            aria-selected={activeView === "queue"}
            tabIndex={activeView === "queue" ? 0 : -1}
            onClick={() => setActiveView("queue")}
            className={tabClass("queue")}
          >
            <ListMusic size={16} />
            Queue

            {queue.length > 0 && (
              <span className="min-w-5 rounded-full bg-white/10 px-1.5 py-0.5 text-center text-[10px] text-zinc-400">
                {queue.length}
              </span>
            )}
          </button>

          {/* Recently played */}

          <button
            type="button"
            role="tab"
            aria-selected={activeView === "recentlyPlayed"}
            tabIndex={activeView === "recentlyPlayed" ? 0 : -1}
            onClick={() => setActiveView("recentlyPlayed")}
            className={tabClass("recentlyPlayed")}
          >
            <Clock3 size={16} />
            Recent

            {recentlyPlayed.length > 0 && (
              <span className="min-w-5 rounded-full bg-white/10 px-1.5 py-0.5 text-center text-[10px] text-zinc-400">
                {recentlyPlayed.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}

        <div className="min-h-0 flex-1 overflow-hidden p-6">
          <div className="h-full min-h-0">
            {/* Library */}

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

            {/* Queue */}

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

            {/* Recently played */}

            {activeView === "recentlyPlayed" && (
              <RecentlyPlayed
                recentlyPlayed={recentlyPlayed}
                currentSongId={currentSongId}
                isPlaying={isPlaying}
                onPlayRecentlyPlayed={onPlayRecentlyPlayed}
                onClearRecentlyPlayed={onClearRecentlyPlayed}
                onRemoveRecentlyPlayed={onRemoveRecentlyPlayed}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}