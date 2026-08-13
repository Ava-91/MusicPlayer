"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const RECENTLY_PLAYED_KEY = "recentlyPlayed";
const MAX_RECENTLY_PLAYED = 10;

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

const getStoredRepeat = () => {
  if (typeof window === "undefined") {
    return "off";
  }

  const value = localStorage.getItem("repeat");

  return ["off", "all", "one"].includes(value)
    ? value
    : "off";
};

const getStoredRecentlyPlayed = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(
      RECENTLY_PLAYED_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((song) => song?.id)
      .slice(0, MAX_RECENTLY_PLAYED);
  } catch {
    return [];
  }
};

const saveRecentlyPlayed = (history) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      RECENTLY_PLAYED_KEY,
      JSON.stringify(history)
    );
  } catch (error) {
    console.error(
      "Failed to save recently played history:",
      error
    );
  }
};

const createRecentlyPlayedEntry = (song) => ({
  ...song,
  playedAt: Date.now(),
});

const addRecentlyPlayed = (
  history,
  song
) => {
  if (!song?.id) {
    return history;
  }

  const withoutSong = history.filter(
    (item) => item.id !== song.id
  );

  return [
    createRecentlyPlayedEntry(song),
    ...withoutSong,
  ].slice(0, MAX_RECENTLY_PLAYED);
};

export default function useAudio(
  playlist = [],
  initialIndex = 0,
  queueApi = null
) {
  const audioRef = useRef(null);

  /*
   * Prevent the same song from being recorded repeatedly
   * while it remains the currently loaded song.
   */
  const lastRecordedSongIdRef =
    useRef(null);

  /*
   * Keep the initial index valid when the playlist is
   * temporarily empty while data is loading.
   */
  const safeInitialIndex =
    initialIndex >= 0 &&
    initialIndex < playlist.length
      ? initialIndex
      : 0;

  const [currentIndex, setCurrentIndex] =
    useState(safeInitialIndex);

  const [currentSong, setCurrentSong] =
    useState(
      () =>
        playlist[safeInitialIndex] ||
        null
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
    getStoredNumber(
      "volume",
      1,
      0,
      1
    )
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
   * Recently played is owned by this hook so the rest
   * of the player does not need to access localStorage.
   */
  const [
    recentlyPlayed,
    setRecentlyPlayed,
  ] = useState(getStoredRecentlyPlayed);

  /*
   * Resolve the song actually used by the player.
   */
  const activeSong =
    isQueueSong
      ? currentSong
      : currentSong ||
        playlist[safeInitialIndex] ||
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
        : safeInitialIndex <
            playlist.length
          ? safeInitialIndex
          : playlist.length > 0
            ? 0
            : -1;

  /* =========================================================
     QUEUE HELPERS
  ========================================================= */

  const removeQueueSong = useCallback(
    (index) => {
      queueApi?.removeFromQueue?.(index);
    },
    [queueApi]
  );

  /* =========================================================
     AUDIO ELEMENT
  ========================================================= */

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

  /* =========================================================
     AUDIO SETTINGS
  ========================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
    audio.muted = muted;
    audio.playbackRate = playbackRate;
  }, [
    volume,
    muted,
    playbackRate,
  ]);

  /* =========================================================
     LOAD CURRENT SONG
  ========================================================= */

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
  }, [
    activeSong,
    isPlaying,
  ]);

  /* =========================================================
     PLAY / PAUSE SYNCHRONIZATION
  ========================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!isPlaying) {
      audio.pause();
      return;
    }

    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [isPlaying]);

  /* =========================================================
     AUDIO EVENTS
  ========================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const updateBuffered = () => {
      if (!audio.buffered.length) {
        return;
      }

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

  /* =========================================================
     RECENTLY PLAYED
  ========================================================= */

  /*
   * Record the song when playback actually begins.
   *
   * This means merely selecting a song does not add it to
   * history if the browser fails to start playback.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !activeSong?.id) {
      return;
    }

    const handlePlay = () => {
      if (
        lastRecordedSongIdRef.current ===
        activeSong.id
      ) {
        return;
      }

      lastRecordedSongIdRef.current =
        activeSong.id;

      setRecentlyPlayed((current) => {
        const updated = addRecentlyPlayed(
          current,
          activeSong
        );

        saveRecentlyPlayed(updated);

        return updated;
      });
    };

    audio.addEventListener(
      "play",
      handlePlay
    );

    return () => {
      audio.removeEventListener(
        "play",
        handlePlay
      );
    };
  }, [activeSong]);

  /*
   * A different song is allowed to create a new history
   * entry, even if it was previously played in this session.
   */
  useEffect(() => {
    if (!activeSong?.id) {
      lastRecordedSongIdRef.current = null;
      return;
    }

    if (
      lastRecordedSongIdRef.current !==
      activeSong.id
    ) {
      lastRecordedSongIdRef.current = null;
    }
  }, [activeSong]);

  /*
   * Clear the complete local listening history.
   */
  const clearRecentlyPlayed =
    useCallback(() => {
      setRecentlyPlayed([]);

      if (typeof window !== "undefined") {
        localStorage.removeItem(
          RECENTLY_PLAYED_KEY
        );
      }

      lastRecordedSongIdRef.current = null;
    }, []);

  /*
   * Remove one specific entry.
   *
   * This is optional UI functionality but keeps the hook
   * ready if the Recently Played component gets per-song
   * removal later.
   */
  const removeRecentlyPlayed =
    useCallback((songId) => {
      if (!songId) {
        return;
      }

      setRecentlyPlayed((current) => {
        const updated = current.filter(
          (song) => song.id !== songId
        );

        saveRecentlyPlayed(updated);

        return updated;
      });
    }, []);

  /* =========================================================
     PERSIST SETTINGS
  ========================================================= */

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

  /* =========================================================
     PLAY / PAUSE
  ========================================================= */

  const play = useCallback(() => {
    if (!activeSong) {
      return;
    }

    setIsPlaying(true);
  }, [activeSong]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!activeSong) {
      return;
    }

    setIsPlaying((value) => !value);
  }, [activeSong]);

  /* =========================================================
     SEEKING
  ========================================================= */

  const seek = useCallback(
    (time) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

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

  /* =========================================================
     VOLUME
  ========================================================= */

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
        clamp(
          value + amount,
          0,
          1
        )
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

  /* =========================================================
     REPEAT / SHUFFLE / SPEED
  ========================================================= */

  const cycleRepeat = useCallback(() => {
    setRepeatMode((mode) => {
      if (mode === "off") {
        return "all";
      }

      if (mode === "all") {
        return "one";
      }

      return "off";
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((value) => !value);
  }, []);

  const togglePlaybackRate =
    useCallback(() => {
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
            : (index + 1) %
              speeds.length
        ];
      });
    }, []);

  /* =========================================================
     SONG SELECTION
  ========================================================= */

  const selectSong = useCallback(
    (index) => {
      if (
        index < 0 ||
        index >= playlist.length
      ) {
        return;
      }

      const song = playlist[index];

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(index);
      setCurrentSong(song);
      setIsQueueSong(false);
      setIsPlaying(true);

      lastRecordedSongIdRef.current = null;
    },
    [playlist]
  );

  /*
   * Play a song directly from Recently Played.
   *
   * If the song still exists in the current playlist,
   * use the normal library selection path. Otherwise,
   * load it as a standalone song.
   */
  const playRecentlyPlayed =
    useCallback(
      (song) => {
        if (!song?.id) {
          return;
        }

        const playlistIndex =
          playlist.findIndex(
            (item) =>
              item.id === song.id
          );

        if (playlistIndex !== -1) {
          selectSong(playlistIndex);
          return;
        }

        setLoadingSong(true);
        setCurrentTime(0);
        setDuration(0);
        setBuffered(0);

        setCurrentIndex(-1);
        setCurrentSong(song);
        setIsQueueSong(true);
        setIsPlaying(true);

        lastRecordedSongIdRef.current = null;
      },
      [playlist, selectSong]
    );

  const playQueueSong = useCallback(
    (song) => {
      if (!song) {
        return;
      }

      setLoadingSong(true);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);

      setCurrentIndex(-1);
      setCurrentSong(song);
      setIsQueueSong(true);
      setIsPlaying(true);

      lastRecordedSongIdRef.current = null;
    },
    []
  );

  /* =========================================================
     RANDOM SONG
  ========================================================= */

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
    } while (
      index === activeIndex
    );

    return index;
  }, [
    activeIndex,
    playlist.length,
  ]);

  /* =========================================================
     NEXT SONG
  ========================================================= */

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

      lastRecordedSongIdRef.current = null;

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
          setCurrentSong(
            playlist[0]
          );
          setIsPlaying(true);

          lastRecordedSongIdRef.current =
            null;
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

      lastRecordedSongIdRef.current =
        null;

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
        setCurrentSong(
          playlist[0]
        );
        setIsPlaying(true);

        lastRecordedSongIdRef.current =
          null;
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

    lastRecordedSongIdRef.current = null;
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

  /* =========================================================
     PREVIOUS SONG
  ========================================================= */

  const previousSong = useCallback(() => {
    if (!activeSong) {
      return;
    }

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

      lastRecordedSongIdRef.current = null;

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

    lastRecordedSongIdRef.current = null;
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

  /* =========================================================
     TRACK ENDED
  ========================================================= */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

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
  }, [
    nextSong,
    repeatMode,
  ]);

  /* =========================================================
     CURRENT LIBRARY INDEX
  ========================================================= */

  const currentLibraryIndex =
    !isQueueSong
      ? activeIndex
      : -1;

  /* =========================================================
     RETURN API
  ========================================================= */

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

    /* Recently Played */

    recentlyPlayed,
    clearRecentlyPlayed,
    removeRecentlyPlayed,
    playRecentlyPlayed,

    /* State setters */

    setCurrentIndex,
    setVolume,
    setPlaybackRate,
    setRepeatMode,
    setShuffle,
    setMuted,

    /* Playback */

    play,
    pause,
    togglePlay,

    nextSong,
    previousSong,

    /* Seeking */

    seek,
    seekForward,
    seekBackward,

    /* Volume */

    changeVolume,
    adjustVolume,
    toggleMute,

    /* Playback modes */

    cycleRepeat,
    toggleShuffle,
    togglePlaybackRate,

    /* Songs */

    selectSong,
    playQueueSong,
  };
}