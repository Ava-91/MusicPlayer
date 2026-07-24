"use client";

import Image from "next/image";

export default function AlbumCover({
  cover,
  title,
  isPlaying,
}) {
  return (
    <div className="relative mx-auto h-72 w-72">

      {/* Vinyl */}
      <div
        className={`
          absolute
          left-1/2
          top-1/2
          h-64
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[radial-gradient(circle,#444_0%,#111_55%,#000_100%)]
          transition-all
          duration-500

          ${
            isPlaying
              ? "animate-[spin_8s_linear_infinite]"
              : ""
          }
        `}
      >
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-5
            w-5
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-zinc-300
        "
        />

        <div
          className="
            absolute
            inset-5
            rounded-full
            border
            border-white/5
        "
        />

        <div
          className="
            absolute
            inset-10
            rounded-full
            border
            border-white/5
        "
        />

        <div
          className="
            absolute
            inset-16
            rounded-full
            border
            border-white/5
        "
        />
      </div>

      {/* Album Cover */}
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-zinc-900
          shadow-[0_20px_60px_rgba(30,64,175,0.35)]
        "
      >
        <Image
          src={cover}
          alt={title}
          fill
          priority
          className="
            object-cover
            transition-transform
            duration-500
            hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/40
            via-transparent
            to-transparent
          "
        />
      </div>
    </div>
  );
}