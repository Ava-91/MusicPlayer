"use client";

import { memo } from "react";
import { Heart, Play, Pause } from "lucide-react";

// Memoized PlaylistItem to prevent unnecessary re-renders
const PlaylistItem = memo(({ 
  song, 
  index, 
  isActive, 
  isPlaying, 
  isFavorite, 
  onSelect, 
  onToggleFavorite 
}) => {
  return (
    <div
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(index);
        }
      }}
      className={`
        group
        flex
        cursor-pointer
        items-center
        gap-4
        rounded-xl
        p-3
        transition-all
        duration-200
        hover:bg-white/5
        ${isActive ? 'bg-white/10' : ''}
      `}
    >
      {/* Play/Pause Icon */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
        {isActive && isPlaying ? (
          <div className="flex h-full w-full items-center justify-center bg-blue-500/20">
            <Pause size={20} className="text-blue-400" />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            {isActive ? (
              <Play size={20} className="text-blue-400" />
            ) : (
              <span className="text-sm text-zinc-500">{index + 1}</span>
            )}
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3 className={`
          truncate text-sm font-medium
          ${isActive ? 'text-blue-400' : 'text-white'}
        `}>
          {song.title}
        </h3>
        <p className="truncate text-xs text-zinc-400">{song.artist}</p>
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(song.id);
        }}
        className="
          p-2
          text-zinc-500
          transition-colors
          hover:text-red-400
        "
      >
        <Heart
          size={18}
          className={isFavorite ? 'fill-red-400 text-red-400' : ''}
        />
      </button>
    </div>
  );
});

PlaylistItem.displayName = 'PlaylistItem';

export default function Playlist({
  songs,
  currentSongId,
  isPlaying,
  favorites = [],
  onSelectSong,
  onToggleFavorite,
}) {
  // Convert favorites to Set for O(1) lookups
  const favoriteSet = new Set(favorites);

  return (
    <div className="space-y-1">
      {songs.length === 0 ? (
        <div className="py-12 text-center text-zinc-500">
          <p className="text-sm">No songs found</p>
        </div>
      ) : (
        songs.map((song, index) => (
          <PlaylistItem
            key={song.id}
            song={song}
            index={index}
            isActive={song.id === currentSongId}
            isPlaying={isPlaying}
            isFavorite={favoriteSet.has(song.id)}
            onSelect={onSelectSong}
            onToggleFavorite={onToggleFavorite}
          />
        ))
      )}
    </div>
  );
}