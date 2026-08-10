"use client";

import { motion } from "framer-motion";

import KeyboardShortcutsHelp from "./KeyboardShortcutsHelp";
import AlbumCover from "./AlbumCover";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import Playlist from "./Playlist";
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
}) {
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

      {/* Right Playlist */}
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
            <SearchBar
              value={search}
              onChange={onSearchChange}
              onClear={onSearchClear}
            />
          </div>

          <KeyboardShortcutsHelp />
        </div>

        {/* Scrollable Playlist */}
        <div className="flex-1 overflow-y-auto p-6">
          <Playlist
            songs={songs}
            currentSongId={currentSongId}
            isPlaying={isPlaying}
            favorites={favorites}
            onSelectSong={onSelectSong}
            onToggleFavorite={
              onToggleFavorite
            }
          />
        </div>
      </div>
    </section>
  );
}