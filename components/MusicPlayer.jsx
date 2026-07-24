"use client";

import { useEffect, useRef, useState } from "react";

import AlbumCover from "./AlbumCover";
import Controls from "./Controls";
import { supabase } from "@/lib/supabase";

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const audioRef = useRef(null);

  const currentSong = songs[currentIndex];

  // =========================
  // Load songs from Supabase
  // =========================

  useEffect(() => {
    async function loadSongs() {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("id");

      if (error) {
        setError(error.message);
      } else {
        setSongs(data || []);
      }

      setLoading(false);
    }

    loadSongs();
  }, []);

  // =========================
  // Play / Pause
  // =========================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // =========================
  // Song Changed
  // =========================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) return;

    audio.load();

    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentSong]);

  // =========================
  // Controls
  // =========================

  function handlePlayPause() {
    setIsPlaying((prev) => !prev);
  }

  function handleNext() {
    if (!songs.length) return;

    setCurrentIndex((prev) => (prev + 1) % songs.length);
  }

  function handlePrevious() {
    if (!songs.length) return;

    setCurrentIndex((prev) =>
      prev === 0 ? songs.length - 1 : prev - 1
    );
  }

  function handleSelectSong(index) {
    setCurrentIndex(index);
    setIsPlaying(true);
  }

  function handleSeek(e) {
    const audio = audioRef.current;

    if (!audio) return;

    const value = Number(e.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  }

  // =========================
  // Helpers
  // =========================

  function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-zinc-300">Loading playlist...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-300">
          Couldn't load playlist
        </h2>

        <p className="mt-2 text-zinc-400">{error}</p>
      </div>
    );
  }

  // =========================
  // No songs
  // =========================

  if (!currentSong) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-xl font-semibold">No songs found</h2>

        <p className="mt-2 text-zinc-400">
          Upload some songs to Supabase.
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <section className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

      <audio
        ref={audioRef}
        src={currentSong.audio}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={handleNext}
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
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full cursor-pointer accent-blue-500"
        />

        <div className="flex justify-between text-xs text-zinc-400">
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

      <div className="space-y-3 border-t border-white/10 pt-6">

        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Playlist
        </h2>

        <div className="max-h-60 space-y-2 overflow-y-auto pr-1">

          {songs.map((song, index) => (
            <button
              key={song.id}
              type="button"
              onClick={() => handleSelectSong(index)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all ${
                currentIndex === index
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="h-14 w-14 rounded-xl object-cover"
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
                <span className="text-lg text-blue-400">
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