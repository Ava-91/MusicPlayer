"use client";

import { motion, AnimatePresence } from "framer-motion";

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

  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolume,
  onSelectSong,
  onSearchChange,
  onSearchClear,
  onToggleFavorite,
}) {
  // Guard against missing song (Error 1)
  if (!currentSong) {
    return (
      <section
        className="
          relative
          mx-auto
          flex
          h-[85vh]
          min-h-[700px]
          w-full
          max-w-7xl
          items-center
          justify-center
          rounded-[36px]
          border
          border-white/10
          bg-white/5
          backdrop-blur-3xl
          shadow-[0_30px_80px_rgba(0,0,0,.55)]
        "
      >
        <p className="text-zinc-400">No matching song found.</p>
      </section>
    );
  }

  return (
    <section
      className="
        relative
        mx-auto
        flex
        h-[85vh]
        min-h-[700px]
        w-full
        max-w-7xl
        gap-8
        overflow-visible
        rounded-[36px]
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-3xl
        shadow-[0_30px_80px_rgba(0,0,0,.55)]
      "
    >
      {/* Left Player */}
      <motion.div
        layout
        className="
          flex
          w-[450px]
          shrink-0
          flex-col
          justify-between
          px-6
        "
      >
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: .35 }}
            >
              <AlbumCover
                cover={currentSong.cover}
                title={currentSong.title}
                isPlaying={isPlaying}
              />
            </motion.div>
          </AnimatePresence>

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
        </div>

        <div className="space-y-5">
          <Controls
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onPrevious={onPrevious}
            onNext={onNext}
          />

          <VolumeSlider
            volume={volume}
            onChange={onVolume}
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
        {/* Search Bar - Fixed at top */}
        <div className="border-b border-white/10 p-6">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            onClear={onSearchClear}
          />
        </div>

        {/* Scrollable Playlist */}
        <div className="flex-1 overflow-y-auto p-6">
          <Playlist
            songs={songs}
            currentSongId={currentSongId}
            isPlaying={isPlaying}
            favorites={favorites}
            onSelectSong={onSelectSong}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </div>
    </section>
  );
}