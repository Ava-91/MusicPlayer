"use client";

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

  if (playlist.loading) {
    return <LoadingState />;
  }

  if (playlist.error) {
    return <ErrorState />;
  }

  if (!playlist.songs.length) {
    return <EmptyState />;
  }

  return (
    <PlayerCard
      songs={playlist.filteredSongs}
      search={playlist.search}
      favorites={playlist.favorites}
      sortBy={playlist.sortBy}

      /* =====================================================
         QUEUE
      ====================================================== */

      queue={queue.queue}
      onAddToQueue={queue.addToQueue}
      onPlayNext={queue.playNext}
      onRemoveFromQueue={queue.removeFromQueue}
      onMoveInQueue={queue.moveInQueue}
      onMoveQueueUp={queue.moveUp}
      onMoveQueueDown={queue.moveDown}
      onClearQueue={queue.clearQueue}

      /* =====================================================
         RECENTLY PLAYED
      ====================================================== */

      recentlyPlayed={player.recentlyPlayed}
      onPlayRecentlyPlayed={
        player.playRecentlyPlayed
      }
      onClearRecentlyPlayed={
        player.clearRecentlyPlayed
      }

      /* =====================================================
         CURRENT SONG
      ====================================================== */

      currentSong={player.currentSong}
      currentSongId={player.currentSong?.id}
      currentIndex={player.currentIndex}

      /* =====================================================
         PLAYBACK STATE
      ====================================================== */

      isPlaying={player.isPlaying}
      currentTime={player.currentTime}
      duration={player.duration}
      buffered={player.buffered}
      loadingSong={player.loadingSong}
      audioRef={player.audioRef}

      /* =====================================================
         VOLUME
      ====================================================== */

      volume={player.volume}
      muted={player.muted}
      onVolume={player.setVolume}
      onMute={player.toggleMute}

      /* =====================================================
         PLAYBACK MODES
      ====================================================== */

      playbackRate={player.playbackRate}
      repeatMode={player.repeatMode}
      shuffle={player.shuffle}

      onPlayPause={player.togglePlay}
      onNext={player.nextSong}
      onPrevious={player.previousSong}

      /* =====================================================
         SEEKING
      ====================================================== */

      onSeek={player.seek}
      onSeekForward={player.seekForward}
      onSeekBackward={player.seekBackward}

      /* =====================================================
         PLAYBACK CONTROLS
      ====================================================== */

      onPlaybackRate={
        player.togglePlaybackRate
      }
      onRepeat={player.cycleRepeat}
      onShuffle={player.toggleShuffle}

      /* =====================================================
         SONG SELECTION
      ====================================================== */

      onSelectSong={player.selectSong}

      /* =====================================================
         SEARCH / SORT
      ====================================================== */

      onSearch={playlist.setSearch}
      onSearchChange={playlist.setSearch}
      onSearchClear={playlist.clearSearch}
      onSort={playlist.setSortBy}

      /* =====================================================
         FAVORITES
      ====================================================== */

      onToggleFavorite={
        playlist.toggleFavorite
      }

      /* =====================================================
         PLAYLIST
      ====================================================== */

      onRefresh={playlist.refresh}
    />
  );
}