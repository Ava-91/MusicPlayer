"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function useAudio(
  playlist = [],
  initialIndex = 0
) {
  const audioRef = useRef(null);

  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 1;

    const saved = localStorage.getItem("volume");

    return saved !== null
      ? Number(saved)
      : 1;
  });

  const [muted, setMuted] =
    useState(false);

  const [playbackRate, setPlaybackRate] =
    useState(() => {
      if (typeof window === "undefined")
        return 1;

      const saved =
        localStorage.getItem("speed");

      return saved !== null
        ? Number(saved)
        : 1;
    });

  const [repeatMode, setRepeatMode] =
    useState(() => {
      if (typeof window === "undefined")
        return "off";

      const saved =
        localStorage.getItem("repeat");

      return saved || "off";
    });

  const [shuffle, setShuffle] =
    useState(() => {
      if (typeof window === "undefined")
        return false;

      const saved =
        localStorage.getItem("shuffle");

      return saved === "true";
    });

  const [buffered, setBuffered] =
    useState(0);

  const [loadingSong, setLoadingSong] =
    useState(false);

  const currentSong =
    playlist[currentIndex] || null;

  // Create Audio Element
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

  // Load Song
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) return;

    setLoadingSong(true);

    audio.pause();
    audio.src = currentSong.audio;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
      setLoadingSong(false);

      if (isPlaying) {
        audio
          .play()
          .catch(() => setIsPlaying(false));
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
      handleLoaded
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoaded
      );

      audio.removeEventListener(
        "error",
        handleError
      );
    };
  }, [currentSong, isPlaying]);

  // Play / Pause
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio
        .play()
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Time / Buffer
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    const updateProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(
          audio.buffered.end(
            audio.buffered.length - 1
          )
        );
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

  // Volume
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  // Mute
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.muted = muted;
  }, [muted]);

  // Playback Speed
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  // Persist Volume
  useEffect(() => {
    localStorage.setItem(
      "volume",
      String(volume)
    );
  }, [volume]);

  // Persist Playback Speed
  useEffect(() => {
    localStorage.setItem(
      "speed",
      String(playbackRate)
    );
  }, [playbackRate]);

  // Persist Repeat
  useEffect(() => {
    localStorage.setItem(
      "repeat",
      repeatMode
    );
  }, [repeatMode]);

  // Persist Shuffle
  useEffect(() => {
    localStorage.setItem(
      "shuffle",
      String(shuffle)
    );
  }, [shuffle]);

  // Controls
  const play = () => {
    if (!currentSong) return;

    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((playing) => !playing);
  };

  // Seek
  const seek = (time) => {
    const audio = audioRef.current;

    if (!audio) return;

    const value = Math.max(
      0,
      Math.min(time, duration || 0)
    );

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const seekForward = (sec = 10) => {
    seek(currentTime + sec);
  };

  const seekBackward = (sec = 10) => {
    seek(currentTime - sec);
  };

  // Volume
  const changeVolume = (value) => {
    setVolume(
      Math.max(
        0,
        Math.min(1, value)
      )
    );

    // If user changes volume manually,
    // make sure audio is no longer muted.
    if (value > 0 && muted) {
      setMuted(false);
    }
  };

  // Keyboard volume control
  // amount is expected to be between -1 and 1.
  // +0.05 = +5%
  // -0.05 = -5%
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

  const toggleMute = () => {
    setMuted((value) => !value);
  };

  // Repeat
  const cycleRepeat = () => {
    if (repeatMode === "off") {
      setRepeatMode("all");
      return;
    }

    if (repeatMode === "all") {
      setRepeatMode("one");
      return;
    }

    setRepeatMode("off");
  };

  // Shuffle
  const toggleShuffle = () => {
    setShuffle((value) => !value);
  };

  // Playback Speed
  const togglePlaybackRate = () => {
    const speeds = [
      1,
      1.25,
      1.5,
      2,
    ];

    const currentPosition =
      speeds.indexOf(playbackRate);

    const nextPosition =
      (currentPosition + 1) %
      speeds.length;

    setPlaybackRate(
      speeds[nextPosition]
    );
  };

  // Select Song
  const selectSong = (index) => {
    if (
      index < 0 ||
      index >= playlist.length
    ) {
      return;
    }

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }

    setIsPlaying(true);
  };

  // Next Song
  const nextSong = () => {
    if (!playlist.length) return;

    if (shuffle) {
      if (playlist.length === 1) return;

      let random;

      do {
        random = Math.floor(
          Math.random() *
            playlist.length
        );
      } while (
        random === currentIndex
      );

      setCurrentIndex(random);
      setIsPlaying(true);

      return;
    }

    if (
      currentIndex ===
      playlist.length - 1
    ) {
      if (repeatMode === "all") {
        setCurrentIndex(0);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }

      return;
    }

    setCurrentIndex(
      (index) => index + 1
    );

    setIsPlaying(true);
  };

  // Previous Song
  const previousSong = () => {
    if (!playlist.length) return;

    if (currentTime > 3) {
      seek(0);
      return;
    }

    if (shuffle) {
      if (playlist.length === 1) return;

      let random;

      do {
        random = Math.floor(
          Math.random() *
            playlist.length
        );
      } while (
        random === currentIndex
      );

      setCurrentIndex(random);
      setIsPlaying(true);

      return;
    }

    if (currentIndex === 0) {
      setCurrentIndex(
        playlist.length - 1
      );
    } else {
      setCurrentIndex(
        (index) => index - 1
      );
    }

    setIsPlaying(true);
  };

  // Track Ended
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;

        audio
          .play()
          .catch(() =>
            setIsPlaying(false)
          );

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
    repeatMode,
    shuffle,
    currentIndex,
    playlist,
    currentTime,
  ]);

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
  };
}