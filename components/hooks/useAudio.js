"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const getStoredNumber = (
  key,
  fallback,
  min,
  max
) => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const value = Number(localStorage.getItem(key));

  return Number.isFinite(value)
    ? clamp(value, min, max)
    : fallback;
};

const getStoredBoolean = (key) =>
  typeof window !== "undefined" &&
  localStorage.getItem(key) === "true";

const getStoredRepeat = () =>
  typeof window !== "undefined"
    ? localStorage.getItem("repeat") || "off"
    : "off";

export default function useAudio(
  playlist = [],
  initialIndex = 0,
  queueApi = null
) {
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);

  const [currentSong, setCurrentSong] =
    useState(
      () => playlist[initialIndex] || null
    );

  const [isQueueSong, setIsQueueSong] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [buffered, setBuffered] =
    useState(0);

  const [loadingSong, setLoadingSong] =
    useState(false);

  const [volume, setVolume] = useState(() =>
    getStoredNumber("volume", 1, 0, 1)
  );

  const [muted, setMuted] = useState(false);

  const [playbackRate, setPlaybackRate] =
    useState(() =>
      getStoredNumber(
        "speed",
        1,
        0.25,
        4
      )
    );

  const [repeatMode, setRepeatMode] =
    useState(getStoredRepeat);

  const [shuffle, setShuffle] = useState(() =>
    getStoredBoolean("shuffle")
  );

  /*
   * Resolve the song used by the player.
   *
   * When the playlist is initially empty, currentSong
   * is null. Once the API finishes loading the playlist,
   * the first song becomes available without needing
   * a setState call inside an effect.
   */
  const activeSong =
    isQueueSong
      ? currentSong
      : currentSong ||
        playlist[initialIndex] ||
        playlist[0] ||
        null;

  const activeIndex =
    isQueueSong
      ? -1
      : currentSong
        ? playlist.findIndex(
            (song) =>
              song.id === currentSong.id
          )
        : initialIndex < playlist.length
          ? initialIndex
          : playlist.length > 0
            ? 0
            : -1;

  /* Queue helpers */

  const removeQueueSong = useCallback(
    (index) => {
      queueApi?.removeFromQueue?.(index);
    },
    [queueApi]
  );

  /* Audio element */

  useEffect(() => {
    const audio = new Audio();

    audio.preload = "metadata";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  /* Sync audio settings */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
    audio.muted = muted;
    audio.playbackRate = playbackRate;
  }, [volume, muted, playbackRate]);

  /* Load current song */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !activeSong?.audio) {
      return;
    }

    audio.pause();
    audio.src = activeSong.audio;
    audio.load();

    const handleMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );

      setLoadingSong(false);

      if (isPlaying) {
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    };

    const handleError = () => {
      setLoadingSong(false);
      setIsPlaying(false);

      console.error(
        "Error loading audio:",
        activeSong.audio
      );
    };

    audio.addEventListener(
      "loadedmetadata",
      handleMetadata
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleMetadata
      );

      audio.removeEventListener(
        "error",
        handleError
      );
    };
  }, [activeSong, isPlaying]);

  /* Playback */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (!isPlaying) {
      audio.pause();
      return;
    }

    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [isPlaying]);

  /* Audio events */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const updateBuffered = () => {
      if (!audio.buffered.length) return;

      try {
        setBuffered(
          audio.buffered.end(
            audio.buffered.length - 1
          )
        );
      } catch {
        // Buffered range may change while reading.
      }
    };

    audio.addEventListener(
      "timeupdate",
      updateTime
    );

    audio.addEventListener(
      "durationchange",
      updateDuration
    );

    audio.addEventListener(
      "progress",
      updateBuffered
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        updateTime
      );

      audio.removeEventListener(
        "durationchange",
        updateDuration
      );

      audio.removeEventListener(
        "progress",
        updateBuffered
      );
    };
  }, []);

  /* Persist settings */

  useEffect(() => {
    localStorage.setItem(
      "volume",
      String(volume)
    );
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(
      "speed",
      String(playbackRate)
    );
  }, [playbackRate]);

  useEffect(() => {
    localStorage.setItem(
      "repeat",
      repeatMode
    );
  }, [repeatMode]);

  useEffect(() => {
    localStorage.setItem(
      "shuffle",
      String(shuffle)
    );
  }, [shuffle]);

  /* Play / pause */

  const play = useCallback(() => {
    if (activeSong) {
      setIsPlaying(true);
    }
  }, [activeSong]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!activeSong) return;

    setIsPlaying((value) => !value);
  }, [activeSong]);

  /* Seeking */

  const seek = useCallback(
    (time) => {
      const audio = audioRef.current;

      if (!audio) return;

      const max = Number.isFinite(duration)
        ? Math.max(duration, 0)
        : 0;

      const nextTime = clamp(
        Number(time) || 0,
        0,
        max
      );

      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [duration]
  );

  const seekForward = useCallback(
    (seconds = 10) => {
      seek(currentTime + seconds);
    },
    [currentTime, seek]
  );

  const seekBackward = useCallback(
    (seconds = 10) => {
      seek(currentTime - seconds);
    },
    [currentTime, seek]
  );

  /* Volume */

  const changeVolume = useCallback(
    (value) => {
      const next = clamp(
        Number(value) || 0,
        0,
        1
      );

      setVolume(next);

      if (next > 0) {
        setMuted(false);
      }
    },
    []
  );

  const adjustVolume = useCallback(
    (amount) => {
      setVolume((value) =>
        clamp(value + amount, 0, 1)
      );

      if (amount > 0) {
        setMuted(false);
      }
    },
    []
  );

  const toggleMute = useCallback(() => {
    setMuted((value) => !value);
  }, []);

  /* Repeat / shuffle / speed */

  const cycleRepeat = useCallback(() => {
    setRepeatMode((mode) => {
      if (mode === "off") return "all";
      if (mode === "all") return "one";
      return "off";
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((value) => !value);
  }, []);

  const togglePlaybackRate = useCallback(
    () => {
      const speeds = [
        1,
        1.25,
        1.5,
        2,
      ];

      setPlaybackRate((current) => {
        const index =
          speeds.indexOf(current);

        return speeds[
          index === -1
            ? 0
            : (index + 1) % speeds.length
        ];
      });
    },
    []
  );

  /* Song selection */

  const selectSong = useCallback(
    (index) => {
      if (
        index < 0 ||
        index >= playlist.length
      ) {
        return;
      }

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(index);
      setCurrentSong(playlist[index]);
      setIsQueueSong(false);
      setIsPlaying(true);
    },
    [playlist]
  );

  const playQueueSong = useCallback(
    (song) => {
      if (!song) return;

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(-1);
      setCurrentSong(song);
      setIsQueueSong(true);
      setIsPlaying(true);
    },
    []
  );

  /* Random song */

  const getRandomIndex = useCallback(() => {
    if (playlist.length <= 1) {
      return 0;
    }

    let index;

    do {
      index = Math.floor(
        Math.random() *
          playlist.length
      );
    } while (index === activeIndex);

    return index;
  }, [activeIndex, playlist.length]);

  /* Next */

  const nextSong = useCallback(() => {
    const currentQueue =
      Array.isArray(queueApi?.queue)
        ? queueApi.queue
        : [];

    if (
      !playlist.length &&
      !currentQueue.length
    ) {
      setIsPlaying(false);
      return;
    }

    /* Queue always has priority. */

    if (currentQueue.length) {
      const next =
        currentQueue[0];

      removeQueueSong(0);
      playQueueSong(next);

      return;
    }

    /* Queue finished → return to library. */

    if (isQueueSong) {
      if (!playlist.length) {
        setIsPlaying(false);
        return;
      }

      const index = shuffle
        ? getRandomIndex()
        : 0;

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(index);
      setCurrentSong(
        playlist[index]
      );
      setIsQueueSong(false);
      setIsPlaying(true);

      return;
    }

    /* Library shuffle. */

    if (shuffle) {
      if (playlist.length === 1) {
        if (repeatMode === "all") {
          setLoadingSong(true);
          setCurrentTime(0);
          setDuration(0);
          setBuffered(0);

          setCurrentIndex(0);
          setCurrentSong(playlist[0]);
          setIsPlaying(true);
        }

        return;
      }

      const index =
        getRandomIndex();

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(index);
      setCurrentSong(
        playlist[index]
      );
      setIsPlaying(true);

      return;
    }

    /* End of library. */

    if (
      activeIndex >=
      playlist.length - 1
    ) {
      if (repeatMode === "all") {
        setLoadingSong(true);
        setCurrentTime(0);
        setDuration(0);
        setBuffered(0);

        setCurrentIndex(0);
        setCurrentSong(playlist[0]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      return;
    }

    /* Normal next. */

    const nextIndex =
      activeIndex + 1;

    if (
      nextIndex < 0 ||
      nextIndex >= playlist.length
    ) {
      setIsPlaying(false);
      return;
    }

    setLoadingSong(true);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);

    setCurrentIndex(nextIndex);
    setCurrentSong(
      playlist[nextIndex]
    );
    setIsPlaying(true);
  }, [
    activeIndex,
    getRandomIndex,
    isQueueSong,
    playlist,
    playQueueSong,
    queueApi,
    removeQueueSong,
    repeatMode,
    shuffle,
  ]);

  /* Previous */

  const previousSong = useCallback(() => {
    if (!activeSong) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (isQueueSong) {
      seek(0);
      return;
    }

    if (!playlist.length) {
      return;
    }

    if (shuffle) {
      if (playlist.length === 1) {
        return;
      }

      const index =
        getRandomIndex();

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(index);
      setCurrentSong(
        playlist[index]
      );
      setIsPlaying(true);

      return;
    }

    const index =
      activeIndex <= 0
        ? playlist.length - 1
        : activeIndex - 1;

    setLoadingSong(true);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);

    setCurrentIndex(index);
    setCurrentSong(
      playlist[index]
    );
    setIsPlaying(true);
  }, [
    activeIndex,
    activeSong,
    currentTime,
    getRandomIndex,
    isQueueSong,
    playlist,
    seek,
    shuffle,
  ]);

  /* Track ended */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;

        audio.play().catch(() => {
          setIsPlaying(false);
        });

        return;
      }

      nextSong();
    };

    audio.addEventListener(
      "ended",
      handleEnded
    );

    return () => {
      audio.removeEventListener(
        "ended",
        handleEnded
      );
    };
  }, [nextSong, repeatMode]);

  /* Current library index */

  const currentLibraryIndex =
    !isQueueSong
      ? activeIndex
      : -1;

  return {
    audioRef,

    currentSong: activeSong,
    currentIndex: activeIndex,

    currentTime,
    duration,
    buffered,

    volume,
    muted,
    playbackRate,

    repeatMode,
    shuffle,

    loadingSong,
    isPlaying,

    isQueueSong,
    currentLibraryIndex,

    setCurrentIndex,
    setVolume,
    setPlaybackRate,
    setRepeatMode,
    setShuffle,
    setMuted,

    play,
    pause,
    togglePlay,

    nextSong,
    previousSong,

    seek,
    seekForward,
    seekBackward,

    changeVolume,
    adjustVolume,
    toggleMute,

    cycleRepeat,
    toggleShuffle,
    togglePlaybackRate,

    selectSong,
    playQueueSong,
  };
}