"use client";

import { memo } from "react";
import Image from "next/image";
import {
  Heart,
  Play,
  Pause,
  ListPlus,
  ListMusic,
} from "lucide-react";

const DEFAULT_COVER = "/covers/default.jpg";

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
    const cover = song.cover || DEFAULT_COVER;

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
          ${isActive ? "bg-white/10" : ""}
        `}
      >
        {/* Album Cover */}
        <div
          className="
            relative
            h-12
            w-12
            shrink-0
            overflow-hidden
            rounded-lg
            bg-zinc-800
          "
        >
          <Image
            src={cover}
            alt={`${song.title} cover`}
            fill
            sizes="48px"
            className="object-cover"
          />

          {/* Play/Pause Overlay */}
          <div
            className={`
              absolute
              inset-0
              flex
              items-center
              justify-center
              transition-all
              duration-200
              ${
                isActive
                  ? "bg-black/40 opacity-100"
                  : "bg-black/50 opacity-0 group-hover:opacity-100"
              }
            `}
          >
            {isActive && isPlaying ? (
              <Pause
                size={18}
                className="text-white"
              />
            ) : (
              <Play
                size={18}
                className="translate-x-0.5 text-white"
              />
            )}
          </div>
        </div>

        {/* Song Info */}
        <div className="min-w-0 flex-1">
          <h3
            className={`
              truncate
              text-sm
              font-medium
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
  songs = [],
  currentSongId,
  isPlaying,
  favorites = [],
  onSelectSong,
  onToggleFavorite,
  onAddToQueue,
  onPlayNext,
}) {
  const favoriteSet = new Set(favorites);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
        <p className="text-sm">No songs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {songs.map((song, index) => (
        <PlaylistItem
          key={song.id}
          song={song}
          index={index}
          isActive={song.id === currentSongId}
          isPlaying={isPlaying}
          isFavorite={favoriteSet.has(song.id)}
          onSelect={onSelectSong}
          onToggleFavorite={onToggleFavorite}
          onAddToQueue={onAddToQueue}
          onPlayNext={onPlayNext}
        />
      ))}
    </div>
  );
}