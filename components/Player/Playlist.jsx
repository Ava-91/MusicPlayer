"use client";

import { memo } from "react";
import {
  Heart,
  Play,
  Pause,
  ListPlus,
  ListMusic,
} from "lucide-react";

// Memoized PlaylistItem to prevent unnecessary re-renders
const PlaylistItem = memo(
  ({
    song,
    index,
    isActive,
    isPlaying,
    isFavorite,
    onSelect,
    onToggleFavorite,
    onAddToQueue,
    onPlayNext,
  }) => {
    return (
      <div
        onClick={() => onSelect(index)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" ||
            e.key === " "
          ) {
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
          ${isActive ? "bg-white/10" : ""}
        `}
      >
        {/* Play/Pause Icon */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
          {isActive && isPlaying ? (
            <div className="flex h-full w-full items-center justify-center bg-blue-500/20">
              <Pause
                size={20}
                className="text-blue-400"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-800">
              {isActive ? (
                <Play
                  size={20}
                  className="text-blue-400"
                />
              ) : (
                <span className="text-sm text-zinc-500">
                  {index + 1}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="min-w-0 flex-1">
          <h3
            className={`
              truncate text-sm font-medium
              ${
                isActive
                  ? "text-blue-400"
                  : "text-white"
              }
            `}
          >
            {song.title}
          </h3>

          <p className="truncate text-xs text-zinc-400">
            {song.artist}
          </p>
        </div>

        {/* Queue Actions */}
        <div
          className="
            flex
            shrink-0
            items-center
            gap-1
            opacity-0
            transition-opacity
            group-hover:opacity-100
            focus-within:opacity-100
          "
        >
          {/* Add to Queue */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddToQueue(song);
            }}
            className="
              rounded-lg
              p-2
              text-zinc-500
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
            aria-label={`Add ${song.title} to queue`}
            title="Add to queue"
          >
            <ListPlus size={18} />
          </button>

          {/* Play Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayNext(song);
            }}
            className="
              rounded-lg
              p-2
              text-zinc-500
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
            aria-label={`Play ${song.title} next`}
            title="Play next"
          >
            <ListMusic size={18} />
          </button>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(song.id);
          }}
          className="
            shrink-0
            rounded-lg
            p-2
            text-zinc-500
            transition-colors
            hover:bg-white/10
            hover:text-red-400
          "
          aria-label={
            isFavorite
              ? `Remove ${song.title} from favorites`
              : `Add ${song.title} to favorites`
          }
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "fill-red-400 text-red-400"
                : ""
            }
          />
        </button>
      </div>
    );
  }
);

PlaylistItem.displayName = "PlaylistItem";

export default function Playlist({
  songs,
  currentSongId,
  isPlaying,
  favorites = [],
  onSelectSong,
  onToggleFavorite,
  onAddToQueue,
  onPlayNext,
}) {
  // Convert favorites to Set for O(1) lookups
  const favoriteSet = new Set(favorites);

  return (
    <div className="space-y-1">
      {songs.length === 0 ? (
        <div className="py-12 text-center text-zinc-500">
          <p className="text-sm">
            No songs found
          </p>
        </div>
      ) : (
        songs.map((song, index) => (
          <PlaylistItem
            key={song.id}
            song={song}
            index={index}
            isActive={
              song.id === currentSongId
            }
            isPlaying={isPlaying}
            isFavorite={favoriteSet.has(
              song.id
            )}
            onSelect={onSelectSong}
            onToggleFavorite={
              onToggleFavorite
            }
            onAddToQueue={
              onAddToQueue
            }
            onPlayNext={onPlayNext}
          />
        ))
      )}
    </div>
  );
}