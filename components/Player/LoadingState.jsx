"use client";

import {
  LoaderCircle,
  Music4,
} from "lucide-react";

export default function LoadingState() {
  return (
    <div
      className="
        relative
        flex
        min-h-700px
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-3xl
      "
    >
      {/* Ambient Glow */}
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-105
          w-105
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/15
          blur-[140px]
          animate-pulse
        "
      />

      {/* Floating Blur */}
      <div
        className="
          absolute
          right-10
          top-10
          h-56
          w-56
          rounded-full
          bg-blue-500/10
          blur-[90px]
          animate-[float_8s_ease-in-out_infinite]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          w-full
          flex-col
          items-center
          justify-center
          px-8
          text-center
        "
      >
        {/* Vinyl */}
        <div
          className="
            relative
            mb-10
            flex
            h-40
            w-40
            items-center
            justify-center
            rounded-full
            bg-[radial-gradient(circle,#4b5563_0%,#111827_45%,#000_100%)]
            shadow-[0_30px_80px_rgba(0,0,0,.65)]
          "
        >
          <LoaderCircle
            size={52}
            className="
              animate-spin
              text-cyan-300
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
              inset-11
              rounded-full
              border
              border-white/5
            "
          />

          <div
            className="
              absolute
              h-5
              w-5
              rounded-full
              bg-zinc-300
            "
          />
        </div>

        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
          "
        >
          Loading your music
        </h1>

        <p
          className="
            mt-4
            max-w-md
            text-zinc-400
            leading-relaxed
          "
        >
          Scanning your library, reading metadata,
          extracting album artwork and preparing the
          player.
        </p>

        {/* Fake progress */}

        <div
          className="
            mt-10
            h-2
            w-full
            max-w-sm
            overflow-hidden
            rounded-full
            bg-white/10
          "
        >
          <div
            className="
              h-full
              w-1/3
              rounded-full
              bg-linear-to-r
              from-cyan-400
              via-blue-500
              to-indigo-500
              animate-[loading_1.3s_linear_infinite]
            "
          />
        </div>

        <div
          className="
            mt-12
            flex
            items-center
            gap-3
            text-zinc-500
          "
        >
          <Music4 size={18} />

          <span>
            Preparing your playlist...
          </span>
        </div>
      </div>
    </div>
  );
}