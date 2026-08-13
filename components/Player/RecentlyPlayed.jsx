"use client";

import Image from "next/image";
import { Clock3, Play, Trash2 } from "lucide-react";

export default function RecentlyPlayed({
  songs = [],
  currentSongId,
  isPlaying,
  onSelectSong,
  onRemove,
  onClear,
}) {
  if (songs.length === 0) {
    return (
      <section className="flex h-full min-h-0 flex-col">
        <header className="mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <Clock3
              size={18}
              className="text-zinc-400"
            />

            <h2 className="text-lg font-semibold text-white">
              Recently Played
            </h2>
          </div>

          <p className="mt-1 text-xs text-zinc-500">
            Songs you have listened to recently.
          </p>
        </header>

        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            items-center
            justify-center
            gap-3
            rounded-2xl
            border
            border-white/5
            bg-white/[0.02]
            text-center
          "
        >
          <Clock3
            size={32}
            strokeWidth={1.5}
            className="text-zinc-700"
          />

          <div>
            <p className="text-sm font-medium text-zinc-400">
              No recently played songs
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Songs you play will appear here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="mb-5 flex shrink-0 items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Clock3
              size={18}
              className="text-zinc-400"
            />

            <h2 className="text-lg font-semibold text-white">
              Recently Played
            </h2>
          </div>

          <p className="mt-1 text-xs text-zinc-500">
            {songs.length}{" "}
            {songs.length === 1 ? "song" : "songs"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            px-2.5
            py-1.5
            text-xs
            text-zinc-500
            transition
            hover:bg-white/10
            hover:text-red-400
          "
        >
          <Trash2 size={14} />
          Clear
        </button>
      </header>

      <div
        className="
          min-h-0
          flex-1
          space-y-2
          overflow-y-auto
          pr-1
        "
      >
        {songs.map((song) => {
          const current =
            song.id === currentSongId;

          return (
            <div
              key={song.id}
              className={`
                group
                flex
                items-center
                gap-3
                rounded-xl
                border
                p-2
                transition
                ${
                  current
                    ? "border-white/15 bg-white/10"
                    : "border-transparent hover:border-white/10 hover:bg-white/5"
                }
              `}
            >
              <button
                type="button"
                onClick={() => onSelectSong?.(song)}
                aria-label={`Play ${song.title}`}
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
                {song.cover ? (
                  <Image
                    src={song.cover}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      text-zinc-600
                    "
                  >
                    ♪
                  </span>
                )}

                <span
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    opacity-0
                    transition
                    group-hover:opacity-100
                  "
                >
                  <Play
                    size={16}
                    className="fill-white text-white"
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => onSelectSong?.(song)}
                className="min-w-0 flex-1 text-left"
              >
                <p
                  className={`
                    truncate
                    text-sm
                    font-medium
                    ${
                      current
                        ? "text-white"
                        : "text-zinc-300"
                    }
                  `}
                >
                  {song.title}
                </p>

                <p className="truncate text-xs text-zinc-500">
                  {song.artist || "Unknown artist"}
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  onRemove?.(song.id)
                }
                aria-label={`Remove ${song.title} from recently played`}
                className="
                  shrink-0
                  rounded-md
                  p-1.5
                  text-zinc-600
                  opacity-0
                  transition
                  hover:bg-white/10
                  hover:text-red-400
                  group-hover:opacity-100
                  focus:opacity-100
                "
              >
                <Trash2 size={14} />
              </button>

              {current && isPlaying && (
                <span
                  className="
                    mr-1
                    h-2
                    w-2
                    shrink-0
                    rounded-full
                    bg-white
                  "
                  aria-label="Currently playing"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}