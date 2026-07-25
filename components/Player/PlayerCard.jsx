"use client";

import { motion, AnimatePresence } from "framer-motion";

import AlbumCover from "./AlbumCover";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import Playlist from "./Playlist";
import VolumeSlider from "./VolumeSlider";
import SearchBar from "./SearchBar";
import BackgroundGlow from "./BackgroundGlow";

export default function PlayerCard({
  songs,
  currentSong,
  currentIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  audioRef,

  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  setVolume,
  onSelectSong,
}) {
  return (
    <>
      <BackgroundGlow cover={currentSong.cover} />

      <section
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-7xl
          gap-8
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
            sticky
            top-8
            flex
            w-[420px]
            shrink-0
            flex-col
            space-y-8
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.audio}
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
                duration: .35,
              }}
            >
              <AlbumCover
                cover={currentSong.cover}
                title={currentSong.title}
                isPlaying={isPlaying}
              />
            </motion.div>
          </AnimatePresence>

          <div className="space-y-2 text-center">
            <h1
              className="
                truncate
                text-4xl
                font-bold
              "
            >
              {currentSong.title}
            </h1>

            <p
              className="
                truncate
                text-lg
                text-zinc-400
              "
            >
              {currentSong.artist}
            </p>
          </div>

          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={(time) => {
                audioRef.current.currentTime = time;
                onSeek(time);
            }}
            />

          <Controls
            isPlaying={isPlaying}
            onPlayPause={onPlayPause}
            onPrevious={onPrevious}
            onNext={onNext}
          />

          <VolumeSlider
            volume={volume}
            onChange={setVolume}
            />

          <audio
            ref={audioRef}
            src={currentSong.audio}
            preload="metadata"
          />
        </motion.div>

        {/* Right Playlist */}
        <div
          className="
            flex-1
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-black/20
            p-6
          "
        >
          <SearchBar />

          <Playlist
            songs={songs}
            currentIndex={currentIndex}
            isPlaying={isPlaying}
            onSelectSong={onSelectSong}
          />
        </div>
      </section>
    </>
  );
}