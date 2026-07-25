"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const DEFAULT_COVER = "/covers/default.jpg";

export default function AlbumCover({
  cover,
  title,
  isPlaying,
}) {
  const [image, setImage] = useState(cover || DEFAULT_COVER);
  const [loaded, setLoaded] = useState(false);

  const [bgColor, setBgColor] = useState("rgb(40,40,40)");

  // ===========================
  // Song changed
  // ===========================

  useEffect(() => {
    setImage(cover || DEFAULT_COVER);
    setLoaded(false);
  }, [cover]);

  // ===========================
  // Extract average color
  // ===========================

  useEffect(() => {
    let cancelled = false;

    const fac = new FastAverageColor();

    async function getColor() {
      try {
        const color = await fac.getColorAsync(
          cover || DEFAULT_COVER
        );

        if (!cancelled) {
          setBgColor(color.rgb);
        }
      } catch {
        if (!cancelled) {
          setBgColor("rgb(40,40,40)");
        }
      }
    }

    getColor();

    return () => {
      cancelled = true;
      fac.destroy();
    };
  }, [cover]);

  return (
    <div className="relative mx-auto h-80 w-80">

      {/* Dynamic ambient glow */}

      <div
        className="absolute inset-0 scale-125 rounded-full blur-[95px] transition-all duration-700"
        style={{
          background: bgColor,
          opacity: .35
        }}
      />

      {/* Secondary glow */}

      <div
        className="absolute inset-8 rounded-full blur-[70px] transition-all duration-700"
        style={{
          background: bgColor,
          opacity: .25
        }}
      />

      {/* Billie glow */}

      <div
        className="
          absolute
          inset-0
          rounded-full
          bg-blue-500/10
          blur-[90px]
          animate-pulse
        "
      />

      {/* Floating */}

      <div
        className="
          absolute
          inset-0
          animate-[float_6s_ease-in-out_infinite]
        "
      >

        {/* Vinyl */}

        <div
          className={`
            absolute
            left-1/2
            top-1/2
            h-67.5
            w-67.5
            -translate-x-1/2
            -translate-y-1/2
            rounded-full

            bg-[radial-gradient(circle,#5a5a5a_0%,#222_30%,#111_60%,#000_100%)]

            shadow-[0_30px_90px_rgba(0,0,0,.75)]

            transition-transform
            duration-700

            ${
              isPlaying
                ? "animate-[spin_8s_linear_infinite]"
                : ""
            }
          `}
        >

          {/* Grooves */}

          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/[0.035]"
              style={{
                inset: `${14 + i * 7}px`,
              }}
            />
          ))}

          {/* Reflection */}

          <div
            className="
              absolute
              left-12
              top-6
              h-36
              w-8
              rotate-[-28deg]
              rounded-full
              bg-white/10
              blur-md
            "
          />

          {/* Center */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-16
              w-16
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-linear-to-br
              from-zinc-300
              to-zinc-700
              shadow-inner
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-3
              w-3
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-black
            "
          />

        </div>

        {/* Album */}

        <div
          className="
            absolute
            inset-0
            overflow-hidden
            rounded-[30px]

            border
            border-white/10

            bg-zinc-900

            shadow-[0_25px_80px_rgba(0,0,0,.65)]

            backdrop-blur-xl
          "
        >

          {!loaded && (
            <div
              className="
                absolute
                inset-0
                animate-pulse
                bg-zinc-800
              "
            />
          )}

          <Image
            key={image}
            src={image}
            alt={title}
            fill
            priority
            sizes="320px"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setImage(DEFAULT_COVER);
            }}
            className={`
              object-cover
              transition-all
              duration-700

              ${
                loaded
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-110"
              }
            `}
          />

          {/* Glass */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-linear-to-br
              from-white/18
              via-transparent
              to-transparent
            "
          />

          {/* Bottom fade */}

          <div
            className="
              absolute
              inset-0
              bg-linear-to-t
              from-black/45
              via-transparent
              to-transparent
            "
          />

          {/* Colored overlay */}

          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(to top, ${bgColor}33, transparent 70%)`
            }}
          />

        </div>

      </div>

    </div>
  );
}