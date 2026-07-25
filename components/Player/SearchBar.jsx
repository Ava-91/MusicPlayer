"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onClear,
}) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="
          pointer-events-none
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-zinc-500
        "
      />

      <input
        type="text"
        placeholder="Search songs, artists..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-white/5
          py-3
          pl-11
          pr-11
          text-sm
          text-white
          placeholder:text-zinc-500
          backdrop-blur-xl
          outline-none
          transition-all
          duration-300

          focus:border-blue-500/50
          focus:bg-white/10
          focus:ring-2
          focus:ring-blue-500/20
        "
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-zinc-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}