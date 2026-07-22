"use client";

import { useEffect, useRef, useState } from "react";
import songs from "@/data/songs.json";

import AlbumCover from "./AlbumCover";
import Controls from "./Controls";

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentSong = songs[currentIndex];

  function handlePlayPause() {
    setIsPlaying((prev) => !prev);
  }

  function handleNext() {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  }

  function handlePrevious() {
    setCurrentIndex((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
  }
  function handleSelectSong(index) {
    setCurrentIndex(index);
  }
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();
    setCurrentTime(0);

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }0
  }, [currentSong, isPlaying]);
  function handleSeek(e) {
  const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  }
  function formatTime(time) {
  if (!time || Number.isNaN(time)) {
    return "0:00";
  }
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;}
  return (
        <section
      className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-8
        backdrop-blur-xl
        shadow-2xl
        space-y-8
      "
    >
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onEnded={handleNext}
        onLoadedMetadata={() =>
          setDuration(audioRef.current.duration)
        }
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current.currentTime)
        }
      />

      <AlbumCover
        cover={currentSong.cover}
        title={currentSong.title}
        isPlaying={isPlaying}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold">
          {currentSong.title}
        </h1>

        <p className="mt-2 text-zinc-400">
          {currentSong.artist}
        </p>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="
            w-full
            cursor-pointer
            accent-blue-500
          "
        />

        <div
          className="
            flex
            justify-between
            text-xs
            text-zinc-400
          "
        >
          <span>{formatTime(currentTime)}</span>

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <Controls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <div
        className="
          border-t
          border-white/10
          pt-6
          space-y-3
        "
      >
        <h2
          className="
            text-sm
            font-semibold
            uppercase
            tracking-widest
            text-zinc-400
          "
        >
          Playlist
        </h2>

        <div
          className="
            max-h-60
            space-y-2
            overflow-y-auto
            pr-1
          "
        >
          {songs.map((song, index) => (
            <button
              key={song.title}
              type="button"
              onClick={() => handleSelectSong(index)}
              className={`
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border
                p-3
                text-left
                transition-all

                ${
                  currentIndex === index
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }
              `}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="
                  h-14
                  w-14
                  rounded-xl
                  object-cover
                "
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {song.title}
                </p>

                <p className="truncate text-sm text-zinc-400">
                  {song.artist}
                </p>
              </div>

              {currentIndex === index && (
                <span className="text-blue-400">
                  {isPlaying ? "♫" : "▶"}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}