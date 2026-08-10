"use client";

import { useEffect } from "react";
import usePlaylist from "./hooks/usePlaylist";
import useAudio from "./hooks/useAudio";
import useKeyboard from "./hooks/useKeyboard";

import PlayerCard from "./Player/PlayerCard";
import LoadingState from "./Player/LoadingState";
import ErrorState from "./Player/ErrorState";
import EmptyState from "./Player/EmptyState";

export default function MusicPlayer() {
  const playlist = usePlaylist();

  const player = useAudio(
    playlist.filteredSongs,
    0
  );

  useKeyboard({
    togglePlay: player.togglePlay,
    nextSong: player.nextSong,
    previousSong: player.previousSong,
    seekForward: player.seekForward,
    seekBackward: player.seekBackward,
    toggleMute: player.toggleMute,
    adjustVolume: player.adjustVolume,
    cycleRepeat: player.cycleRepeat,
    toggleShuffle: player.toggleShuffle,
  });

  // When the filtered playlist changes,
  // ensure the current song still exists.
  useEffect(() => {
    if (!playlist.filteredSongs.length) {
      return;
    }

    const currentExists =
      playlist.filteredSongs.some(
        (song) =>
          song.id === player.currentSong?.id
      );

    // If the current song no longer exists
    // in the filtered playlist, select the first song.
    if (!currentExists) {
      player.selectSong(0);
    }
  }, [
    playlist.filteredSongs,
    player.currentSong?.id,
  ]);

  // Loading state
  if (playlist.loading) {
    return <LoadingState />;
  }

  // Error state
  if (playlist.error) {
    return <ErrorState />;
  }

  // Empty state
  if (!playlist.songs.length) {
    return <EmptyState />;
  }

  return (
    <PlayerCard
      songs={playlist.filteredSongs}
      search={playlist.search}
      favorites={playlist.favorites}
      sortBy={playlist.sortBy}

      currentSong={player.currentSong}
      currentSongId={
        player.currentSong?.id
      }
      currentIndex={player.currentIndex}

      isPlaying={player.isPlaying}
      currentTime={player.currentTime}
      duration={player.duration}
      buffered={player.buffered}

      volume={player.volume}
      muted={player.muted}
      playbackRate={player.playbackRate}
      repeatMode={player.repeatMode}
      shuffle={player.shuffle}

      loadingSong={player.loadingSong}
      audioRef={player.audioRef}

      onPlayPause={
        player.togglePlay
      }
      onNext={player.nextSong}
      onPrevious={
        player.previousSong
      }

      onSeek={player.seek}
      onSeekForward={
        player.seekForward
      }
      onSeekBackward={
        player.seekBackward
      }

      onVolume={
        player.setVolume
      }
      onMute={
        player.toggleMute
      }

      onPlaybackRate={
        player.togglePlaybackRate
      }
      onRepeat={
        player.cycleRepeat
      }
      onShuffle={
        player.toggleShuffle
      }

      onSelectSong={
        player.selectSong
      }

      onSearch={
        playlist.setSearch
      }
      onSort={
        playlist.setSortBy
      }

      onToggleFavorite={
        playlist.toggleFavorite
      }

      onRefresh={
        playlist.refresh
      }

      onSearchChange={
        playlist.setSearch
      }
      onSearchClear={
        playlist.clearSearch
      }
    />
  );
}