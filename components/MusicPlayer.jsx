"use client";

import { useEffect } from "react";

import usePlaylist from "./hooks/usePlaylist";
import useQueue from "./hooks/useQueue";
import useAudio from "./hooks/useAudio";
import useKeyboard from "./hooks/useKeyboard";

import PlayerCard from "./Player/PlayerCard";
import LoadingState from "./Player/LoadingState";
import ErrorState from "./Player/ErrorState";
import EmptyState from "./Player/EmptyState";

export default function MusicPlayer() {
  const playlist = usePlaylist();
  const queue = useQueue();

  const player = useAudio(
    playlist.filteredSongs,
    0,
    queue
  );

  /*
   * Keyboard controls
   */
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

  /*
   * Keep the current song valid when
   * the filtered playlist changes.
   */
  useEffect(() => {
    if (!playlist.filteredSongs.length) {
      return;
    }

    const currentExists =
      playlist.filteredSongs.some(
        (song) =>
          song.id === player.currentSong?.id
      );

    if (!currentExists) {
      player.selectSong(0);
    }
  }, [
    playlist.filteredSongs,
    player.currentSong?.id,
  ]);

  /*
   * Loading state
   */
  if (playlist.loading) {
    return <LoadingState />;
  }

  /*
   * Error state
   */
  if (playlist.error) {
    return <ErrorState />;
  }

  /*
   * Empty library state
   */
  if (!playlist.songs.length) {
    return <EmptyState />;
  }

  return (
    <PlayerCard
      /* =========================
         Library
         ========================= */
      songs={playlist.filteredSongs}
      search={playlist.search}
      favorites={playlist.favorites}
      sortBy={playlist.sortBy}

      /* =========================
         Queue
         ========================= */
      queue={queue.queue}

      onAddToQueue={queue.addToQueue}

      onPlayNext={queue.playNext}

      onRemoveFromQueue={
        queue.removeFromQueue
      }

      onMoveInQueue={
        queue.moveInQueue
      }

      onMoveQueueUp={
        queue.moveUp
      }

      onMoveQueueDown={
        queue.moveDown
      }

      onClearQueue={
        queue.clearQueue
      }

      /* =========================
         Current Song
         ========================= */
      currentSong={player.currentSong}

      currentSongId={
        player.currentSong?.id
      }

      currentIndex={player.currentIndex}

      /* =========================
         Playback
         ========================= */
      isPlaying={player.isPlaying}

      currentTime={player.currentTime}

      duration={player.duration}

      buffered={player.buffered}

      loadingSong={player.loadingSong}

      audioRef={player.audioRef}

      /* =========================
         Volume
         ========================= */
      volume={player.volume}

      muted={player.muted}

      onVolume={
        player.setVolume
      }

      onMute={
        player.toggleMute
      }

      /* =========================
         Playback Settings
         ========================= */
      playbackRate={
        player.playbackRate
      }

      repeatMode={
        player.repeatMode
      }

      shuffle={
        player.shuffle
      }

      /* =========================
         Main Controls
         ========================= */
      onPlayPause={
        player.togglePlay
      }

      onNext={
        player.nextSong
      }

      onPrevious={
        player.previousSong
      }

      /* =========================
         Seeking
         ========================= */
      onSeek={
        player.seek
      }

      onSeekForward={
        player.seekForward
      }

      onSeekBackward={
        player.seekBackward
      }

      /* =========================
         Playback Options
         ========================= */
      onPlaybackRate={
        player.togglePlaybackRate
      }

      onRepeat={
        player.cycleRepeat
      }

      onShuffle={
        player.toggleShuffle
      }

      /* =========================
         Song Selection
         ========================= */
      onSelectSong={
        player.selectSong
      }

      /* =========================
         Search / Sorting
         ========================= */
      onSearch={
        playlist.setSearch
      }

      onSearchChange={
        playlist.setSearch
      }

      onSearchClear={
        playlist.clearSearch
      }

      onSort={
        playlist.setSortBy
      }

      /* =========================
         Favorites
         ========================= */
      onToggleFavorite={
        playlist.toggleFavorite
      }

      /* =========================
         Playlist
         ========================= */
      onRefresh={
        playlist.refresh
      }
    />
  );
}