"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function BackgroundGlow({
  color = "rgb(40,40,40)",
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={color}
        initial={{
          opacity: 0,
          scale: 0.85,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          backgroundColor: color,
        }}
        exit={{
          opacity: 0,
          scale: 1.15,
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
          rounded-[40px]
        "
      >
        {/* Main glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            opacity-40
            blur-[140px]
          "
          style={{
            backgroundColor: color,
          }}
        />

        {/* Secondary glow */}
        <div
          className="
            absolute
            left-[20%]
            top-[25%]
            h-72
            w-72
            rounded-full
            opacity-20
            blur-[120px]
          "
          style={{
            backgroundColor: color,
          }}
        />

        {/* Bottom glow */}
        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-60
            w-80
            -translate-x-1/2
            rounded-full
            opacity-25
            blur-[110px]
          "
          style={{
            backgroundColor: color,
          }}
        />

        {/* Glass overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-white/[0.05]
            via-transparent
            to-black/30
            backdrop-blur-[90px]
          "
        />
      </motion.div>
    </AnimatePresence>
  );
}