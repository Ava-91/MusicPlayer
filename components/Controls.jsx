export default function Controls({
  isPlaying,
  onPlayPause,
}) {
  return (
    <div
      className="
        flex
        justify-center
        items-center
        gap-6
      "
    >
      <button
        className="
          w-12
          h-12
          rounded-full
          bg-white/5
          border
          border-white/10
          hover:bg-white/10
          transition
          text-xl
        "
      >
        ⏮
      </button>

      <button
        onClick={onPlayPause}
        className="
          w-16
          h-16
          rounded-full
          bg-blue-600
          hover:bg-blue-500
          transition
          shadow-[0_0_40px_rgba(37,99,235,.45)]
          text-2xl
        "
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      <button
        className="
          w-12
          h-12
          rounded-full
          bg-white/5
          border
          border-white/10
          hover:bg-white/10
          transition
          text-xl
        "
      >
        ⏭
      </button>
    </div>
  );
}