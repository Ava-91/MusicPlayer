"use client";

import { useAudio } from "./hooks/useAudio";
import { useKeyboard } from "./hooks/useKeyboard";

import PlayerCard from "./Player/PlayerCard";
import LoadingState from "./Player/LoadingState";
import ErrorState from "./Player/ErrorState";
import EmptyState from "./Player/EmptyState";

export default function MusicPlayer() {
  const player = useAudio();

  useKeyboard({
    isPlaying: player.isPlaying,
    onPlayPause: player.togglePlay,
    onNext: player.nextSong,
    onPrevious: player.previousSong,
  });

  if (player.loading) {
    return <LoadingState />;
  }

  if (player.error) {
    return <ErrorState message={player.error} />;
  }

  if (!player.currentSong) {
    return <EmptyState />;
  }

  return (
    <PlayerCard
      songs={player.songs}
      currentSong={player.currentSong}
      currentIndex={player.currentIndex}
      isPlaying={player.isPlaying}
      currentTime={player.currentTime}
      duration={player.duration}
      volume={player.volume}
      audioRef={player.audioRef}
      onPlayPause={player.togglePlay}
      onNext={player.nextSong}
      onPrevious={player.previousSong}
      onSeek={player.seek}
      onVolume={player.setVolume}
      onSelectSong={player.selectSong}
    />
  );
}