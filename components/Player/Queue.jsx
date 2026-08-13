"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Play,
  Trash2,
  X,
} from "lucide-react";

export default function Queue({
  queue = [],
  currentSongId,
  onRemoveFromQueue,
  onMoveQueueUp,
  onMoveQueueDown,
  onClearQueue,
}) {
  if (!queue.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-500">
        <ListMusic size={32} strokeWidth={1.5} />
        <p className="text-sm">Your queue is empty.</p>
        <p className="text-xs text-zinc-600">
          Add songs from your library.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Queue</h2>
          <p className="text-xs text-zinc-500">
            {queue.length} {queue.length === 1 ? "song" : "songs"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClearQueue}
          aria-label="Clear queue"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-red-400"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {queue.map((song, index) => {
          const current = song.id === currentSongId;

          return (
            <div
              key={`${song.id}-${index}`}
              className={`group flex items-center gap-3 rounded-xl border p-2 transition ${
                current
                  ? "border-white/15 bg-white/10"
                  : "border-transparent hover:border-white/10 hover:bg-white/5"
              }`}
            >
              <span className="w-5 shrink-0 text-center text-xs text-zinc-600">
                {current ? (
                  <Play
                    size={12}
                    className="mx-auto fill-current"
                  />
                ) : (
                  index + 1
                )}
              </span>

              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                {song.cover ? (
                  <Image
                    src={song.cover}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs text-zinc-600">
                    ♪
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p
                  className={`truncate text-sm font-medium ${
                    current ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {song.title}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {song.artist}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => onMoveQueueUp(index)}
                  disabled={index === 0}
                  aria-label={`Move ${song.title} up`}
                  className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-20"
                >
                  <ChevronUp size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onMoveQueueDown(index)}
                  disabled={index === queue.length - 1}
                  aria-label={`Move ${song.title} down`}
                  className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-20"
                >
                  <ChevronDown size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveFromQueue(index)}
                  aria-label={`Remove ${song.title} from queue`}
                  className="rounded-md p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}