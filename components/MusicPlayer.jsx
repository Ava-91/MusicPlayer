"use client";

import songs from "@/data/songs.json";

import AlbumCover from "./AlbumCover";
import SongInfo from "./SongInfo";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import Playlist from "./Playlist";

export default function MusicPlayer() {
  return (
    <div className="w-full max-w-6xl rounded-3xl bg-white/5 p-8 backdrop-blur-xl">

      <AlbumCover />

      <SongInfo />

      <ProgressBar />

      <Controls />

      <VolumeControl />

      <Playlist songs={songs} />

    </div>
  );
}