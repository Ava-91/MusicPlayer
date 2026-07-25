"use client";

import { Music4 } from "lucide-react";

export default function EmptyState() {
  return (
    <div
      className="
        flex
        min-h-520px
        flex-col
        items-center
        justify-center
        rounded-3xl
        border
        border-dashed
        border-white/10
        bg-white/5
        p-10
        text-center
        backdrop-blur-xl
      "
    >
      <div
        className="
          mb-8
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-full
          bg-linear-to-br
          from-blue-500/20
          via-cyan-400/10
          to-purple-500/20
          shadow-[0_0_80px_rgba(59,130,246,.15)]
        "
      >
        <Music4
          size={54}
          className="text-blue-400"
        />
      </div>

      <h2
        className="
          text-3xl
          font-bold
          tracking-tight
          text-white
        "
      >
        Your library is empty
      </h2>

      <p
        className="
          mt-4
          max-w-md
          text-zinc-400
          leading-relaxed
        "
      >
        Drop your music files into
      </p>

      <code
        className="
          mt-3
          rounded-xl
          border
          border-white/10
          bg-black/40
          px-4
          py-2
          font-mono
          text-sm
          text-cyan-300
        "
      >
        public/songs
      </code>

      <p
        className="
          mt-8
          text-sm
          text-zinc-500
          leading-relaxed
        "
      >
        Supported formats:
        <br />
        MP3 • FLAC • WAV • OGG • OPUS • M4A
      </p>

      <div
        className="
          mt-10
          rounded-2xl
          border
          border-blue-500/20
          bg-blue-500/10
          px-5
          py-3
          text-sm
          text-blue-300
        "
      >
        The playlist is generated automatically.
        <br />
        No configuration required.
      </div>
    </div>
  );
}