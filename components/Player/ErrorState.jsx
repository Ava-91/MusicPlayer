"use client";

import {
  CircleAlert,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

export default function ErrorState({
  error,
  onRetry,
}) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-red-500/25 bg-red-500/5 backdrop-blur-3xl">
      {/* Background */}

      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/10 blur-[140px]" />

      <div className="relative z-10 flex min-h-650px flex-col items-center justify-center px-8 text-center">
        {/* Icon */}

        <div className="mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-red-500/15 shadow-[0_0_80px_rgba(239,68,68,.2)]">
          <CircleAlert size={56} className="text-red-400" />
        </div>

        <h1 className="text-4xl font-bold">
          Couldn&apos;t load your music
        </h1>

        <p className="mt-5 max-w-xl text-zinc-400 leading-relaxed">
          Something prevented the music library from
          loading.
        </p>

        <div className="mt-8 max-w-xl rounded-2xl border border-red-500/20 bg-black/30 px-5 py-4 font-mono text-left text-sm text-red-300 wrap-break-word">
          {error || "Unknown error"}
        </div>

        {/* Suggestions */}

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <FolderOpen size={22} className="text-cyan-400" />

            <span className="font-semibold">
              Things to check
            </span>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>
              • Verify your music is inside
              <code className="ml-1 text-cyan-300">
                public/songs
              </code>
            </li>

            <li>
              • Make sure your audio files aren&apos;t
              corrupted.
            </li>

            <li>
              • Restart the development server.
            </li>

            <li>
              • Check the browser console for more
              information.
            </li>
          </ul>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="mt-10 flex items-center gap-3 rounded-2xl bg-linear-to-r from-red-500 to-red-600 px-7 py-4 font-semibold text-white shadow-[0_15px_40px_rgba(239,68,68,.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(239,68,68,.45)] active:scale-95"
        >
          <RefreshCw size={20} />
          Try Again
        </button>
      </div>
    </div>
  );
}