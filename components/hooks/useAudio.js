"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function useAudio(
  playlist = [],
  initialIndex = 0,
  queueApi = null
) {
  const audioRef = useRef(null);

  /*
   * --------------------------------------------------
   * Playback source
   * --------------------------------------------------
   */

  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);

  const [currentSong, setCurrentSong] =
    useState(
      playlist[initialIndex] || null
    );

  /*
   * When the current song comes from the queue,
   * currentIndex is -1 because it does not belong
   * to the library playlist.
   */
  const [isQueueSong, setIsQueueSong] =
    useState(false);

  /*
   * --------------------------------------------------
   * Player state
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * Volume
   * --------------------------------------------------
   */

  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") {
      return 1;
    }

    const saved =
      localStorage.getItem("volume");

    const value =
      saved !== null
        ? Number(saved)
        : 1;

    return Number.isFinite(value)
      ? Math.max(0, Math.min(1, value))
      : 1;
  });

  const [muted, setMuted] =
    useState(false);

  /*
   * --------------------------------------------------
   * Playback speed
   * --------------------------------------------------
   */

  const [playbackRate, setPlaybackRate] =
    useState(() => {
      if (typeof window === "undefined") {
        return 1;
      }

      const saved =
        localStorage.getItem("speed");

      const value =
        saved !== null
          ? Number(saved)
          : 1;

      return Number.isFinite(value)
        ? value
        : 1;
    });

  /*
   * --------------------------------------------------
   * Repeat
   * --------------------------------------------------
   */

  const [repeatMode, setRepeatMode] =
    useState(() => {
      if (typeof window === "undefined") {
        return "off";
      }

      return (
        localStorage.getItem("repeat") ||
        "off"
      );
    });

  /*
   * --------------------------------------------------
   * Shuffle
   * --------------------------------------------------
   */

  const [shuffle, setShuffle] =
    useState(() => {
      if (typeof window === "undefined") {
        return false;
      }

      return (
        localStorage.getItem("shuffle") ===
        "true"
      );
    });

  /*
   * --------------------------------------------------
   * Queue helpers
   * --------------------------------------------------
   */

  const getQueue = useCallback(() => {
    if (!queueApi) {
      return [];
    }

    return Array.isArray(queueApi.queue)
      ? queueApi.queue
      : [];
  }, [queueApi]);

  const removeQueueSong = useCallback(
    (index) => {
      if (
        !queueApi ||
        typeof queueApi.removeFromQueue !==
          "function"
      ) {
        return;
      }

      queueApi.removeFromQueue(index);
    },
    [queueApi]
  );

  /*
   * --------------------------------------------------
   * Create audio element
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = new Audio();

    audio.preload = "metadata";
    audio.volume = volume;
    audio.muted = muted;
    audio.playbackRate = playbackRate;

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  /*
   * --------------------------------------------------
   * Load current song
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    setLoadingSong(true);

    audio.pause();

    audio.src = currentSong.audio;

    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setLoadingSong(false);

      if (isPlaying) {
        audio
          .play()
          .catch(() => {
            setIsPlaying(false);
          });
      }
    };

    const handleError = () => {
      setLoadingSong(false);
      setIsPlaying(false);

      console.error(
        "Error loading audio:",
        currentSong.audio
      );
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "error",
        handleError
      );
    };
  }, [currentSong, isPlaying]);

  /*
   * --------------------------------------------------
   * Play / Pause
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio
        .play()
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  /*
   * --------------------------------------------------
   * Time / Duration / Buffer
   * --------------------------------------------------
   */

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

    const updateProgress = () => {
      if (audio.buffered.length === 0) {
        return;
      }

      try {
        setBuffered(
          audio.buffered.end(
            audio.buffered.length - 1
          )
        );
      } catch {
        // Ignore invalid buffered ranges.
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
      updateProgress
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
        updateProgress
      );
    };
  }, []);

  /*
   * --------------------------------------------------
   * Volume
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  /*
   * --------------------------------------------------
   * Mute
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = muted;
  }, [muted]);

  /*
   * --------------------------------------------------
   * Playback speed
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  /*
   * --------------------------------------------------
   * Persist settings
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * Play / Pause controls
   * --------------------------------------------------
   */

  const play = useCallback(() => {
    if (!currentSong) {
      return;
    }

    setIsPlaying(true);
  }, [currentSong]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  /*
   * --------------------------------------------------
   * Seek
   * --------------------------------------------------
   */

  const seek = useCallback(
    (time) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      const maxTime =
        Number.isFinite(duration) &&
        duration > 0
          ? duration
          : 0;

      const value = Math.max(
        0,
        Math.min(time, maxTime)
      );

      audio.currentTime = value;

      setCurrentTime(value);
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

  /*
   * --------------------------------------------------
   * Volume controls
   * --------------------------------------------------
   */

  const changeVolume = useCallback(
    (value) => {
      const nextVolume = Math.max(
        0,
        Math.min(1, Number(value))
      );

      setVolume(nextVolume);

      if (nextVolume > 0 && muted) {
        setMuted(false);
      }
    },
    [muted]
  );

  const adjustVolume = useCallback(
    (amount) => {
      setVolume((previous) =>
        Math.max(
          0,
          Math.min(
            1,
            previous + amount
          )
        )
      );

      if (amount > 0 && muted) {
        setMuted(false);
      }
    },
    [muted]
  );

  const toggleMute = useCallback(() => {
    setMuted((value) => !value);
  }, []);

  /*
   * --------------------------------------------------
   * Repeat
   * --------------------------------------------------
   */

  const cycleRepeat = useCallback(() => {
    setRepeatMode((current) => {
      if (current === "off") {
        return "all";
      }

      if (current === "all") {
        return "one";
      }

      return "off";
    });
  }, []);

  /*
   * --------------------------------------------------
   * Shuffle
   * --------------------------------------------------
   */

  const toggleShuffle = useCallback(() => {
    setShuffle((value) => !value);
  }, []);

  /*
   * --------------------------------------------------
   * Playback speed
   * --------------------------------------------------
   */

  const togglePlaybackRate = useCallback(() => {
    const speeds = [
      1,
      1.25,
      1.5,
      2,
    ];

    setPlaybackRate((current) => {
      const currentPosition =
        speeds.indexOf(current);

      const nextPosition =
        currentPosition === -1
          ? 0
          : (currentPosition + 1) %
            speeds.length;

      return speeds[nextPosition];
    });
  }, []);

  /*
   * --------------------------------------------------
   * Select library song
   * --------------------------------------------------
   */

  const selectSong = useCallback(
    (index) => {
      if (
        index < 0 ||
        index >= playlist.length
      ) {
        return;
      }

      const song = playlist[index];

      setCurrentIndex(index);
      setCurrentSong(song);
      setIsQueueSong(false);
      setIsPlaying(true);
    },
    [playlist]
  );

  /*
   * --------------------------------------------------
   * Play a queue song
   * --------------------------------------------------
   */

  const playQueueSong = useCallback(
    (song) => {
      if (!song) {
        return;
      }

      setCurrentIndex(-1);
      setCurrentSong(song);
      setIsQueueSong(true);
      setIsPlaying(true);
    },
    []
  );

  /*
   * --------------------------------------------------
   * Next Song
   *
   * Priority:
   *
   * 1. Queue
   * 2. Library
   * 3. Repeat all
   * 4. Stop
   * --------------------------------------------------
   */

  const nextSong = useCallback(() => {
    /*
     * Queue always takes priority over the
     * normal library.
     */
    const currentQueue = getQueue();

    if (currentQueue.length > 0) {
      const nextQueuedSong =
        currentQueue[0];

      removeQueueSong(0);

      playQueueSong(nextQueuedSong);

      return;
    }

    /*
     * If the current song was a queue song,
     * there is no playlist index to increment.
     *
     * Once its queue is exhausted, continue
     * from the beginning of the library.
     */
    if (isQueueSong) {
      if (!playlist.length) {
        setIsPlaying(false);
        return;
      }

      if (shuffle) {
        if (playlist.length === 1) {
          setCurrentIndex(0);
          setCurrentSong(playlist[0]);
          setIsQueueSong(false);
          setIsPlaying(true);
          return;
        }

        let randomIndex;

        do {
          randomIndex = Math.floor(
            Math.random() *
              playlist.length
          );
        } while (
          randomIndex === currentIndex
        );

        setCurrentIndex(randomIndex);
        setCurrentSong(
          playlist[randomIndex]
        );
        setIsQueueSong(false);
        setIsPlaying(true);

        return;
      }

      setCurrentIndex(0);
      setCurrentSong(playlist[0]);
      setIsQueueSong(false);
      setIsPlaying(true);

      return;
    }

    /*
     * Normal library shuffle.
     */
    if (shuffle) {
      if (playlist.length <= 1) {
        if (
          repeatMode === "all" &&
          playlist.length === 1
        ) {
          setCurrentIndex(0);
          setCurrentSong(playlist[0]);
          setIsPlaying(true);
        }

        return;
      }

      let randomIndex;

      do {
        randomIndex = Math.floor(
          Math.random() *
            playlist.length
        );
      } while (
        randomIndex === currentIndex
      );

      setCurrentIndex(randomIndex);
      setCurrentSong(
        playlist[randomIndex]
      );
      setIsPlaying(true);

      return;
    }

    /*
     * End of normal library.
     */
    if (
      currentIndex >=
      playlist.length - 1
    ) {
      if (repeatMode === "all") {
        setCurrentIndex(0);
        setCurrentSong(playlist[0]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      return;
    }

    /*
     * Normal next library song.
     */
    const nextIndex =
      currentIndex + 1;

    setCurrentIndex(nextIndex);
    setCurrentSong(
      playlist[nextIndex]
    );
    setIsPlaying(true);
  }, [
    currentIndex,
    getQueue,
    isQueueSong,
    playlist,
    playQueueSong,
    removeQueueSong,
    repeatMode,
    shuffle,
  ]);

  /*
   * --------------------------------------------------
   * Previous Song
   * --------------------------------------------------
   */

  const previousSong = useCallback(() => {
    if (!currentSong) {
      return;
    }

    /*
     * If the song has already played for more
     * than three seconds, restart it.
     */
    if (currentTime > 3) {
      seek(0);
      return;
    }

    /*
     * Queue songs don't have a library index.
     *
     * We restart the current queue song instead
     * of trying to navigate backwards through
     * the queue.
     */
    if (isQueueSong) {
      seek(0);
      return;
    }

    if (!playlist.length) {
      return;
    }

    /*
     * Shuffle previous.
     */
    if (shuffle) {
      if (playlist.length === 1) {
        return;
      }

      let randomIndex;

      do {
        randomIndex = Math.floor(
          Math.random() *
            playlist.length
        );
      } while (
        randomIndex === currentIndex
      );

      setCurrentIndex(randomIndex);
      setCurrentSong(
        playlist[randomIndex]
      );
      setIsPlaying(true);

      return;
    }

    /*
     * Go to previous library song.
     */
    if (currentIndex === 0) {
      setCurrentIndex(
        playlist.length - 1
      );

      setCurrentSong(
        playlist[playlist.length - 1]
      );
    } else {
      const previousIndex =
        currentIndex - 1;

      setCurrentIndex(previousIndex);
      setCurrentSong(
        playlist[previousIndex]
      );
    }

    setIsPlaying(true);
  }, [
    currentIndex,
    currentSong,
    currentTime,
    isQueueSong,
    playlist,
    seek,
    shuffle,
  ]);

  /*
   * --------------------------------------------------
   * Track ended
   * --------------------------------------------------
   */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleEnded = () => {
      /*
       * Repeat one always wins.
       */
      if (repeatMode === "one") {
        audio.currentTime = 0;

        audio
          .play()
          .catch(() => {
            setIsPlaying(false);
          });

        return;
      }

      /*
       * Otherwise continue to the queue/library.
       */
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

  /*
   * --------------------------------------------------
   * Keep current library song valid when the
   * filtered playlist changes.
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!playlist.length) {
      return;
    }

    /*
     * Never replace a currently playing queue song
     * just because the library changed.
     */
    if (isQueueSong) {
      return;
    }

    const currentSongExists =
      playlist.some(
        (song) =>
          song.id === currentSong?.id
      );

    if (!currentSongExists) {
      setCurrentIndex(0);
      setCurrentSong(playlist[0]);
      setIsPlaying(false);
    }
  }, [
    currentSong?.id,
    isQueueSong,
    playlist,
  ]);

  /*
   * --------------------------------------------------
   * Return API
   * --------------------------------------------------
   */

  return {
    audioRef,

    currentSong,
    currentIndex,
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