"use client";

import songs from "@/data/songs.json";
import { useState } from "react";

import AlbumCover from "./AlbumCover";
import Controls from "./Controls";

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  function handlePlayPause() {
    setIsPlaying(!isPlaying);
  }

  return (
    <section
      className="
      w-full
      max-w-md
      rounded-3xl
      bg-white/5
      border
      border-white/10
      backdrop-blur-xl
      shadow-2xl
      p-8
      space-y-8
    "
    >
      <AlbumCover
        cover={currentSong.cover}
        title={currentSong.title}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold">
          {currentSong.title}
        </h1>

        <p className="text-zinc-400 mt-2">
          {currentSong.artist}
        </p>
      </div>

      <Controls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    </section>
  );
}