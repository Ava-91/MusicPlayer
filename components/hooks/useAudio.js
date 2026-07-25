"use client";
import { useEffect, useRef, useState } from "react";

export default function useAudio(playlist = [], initialIndex = 0) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState("off");
  const [shuffle, setShuffle] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [loadingSong, setLoadingSong] = useState(false);
  const currentSong = playlist[currentIndex] || null;

  // Create Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;
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

    const handleLoaded = () => {
      setDuration(audio.duration || 0);
      setLoadingSong(false);
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    };

    const handleError = () => {
      setLoadingSong(false);
      setIsPlaying(false);
      console.error("Error loading audio:", currentSong.audio);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("error", handleError);
    };
  }, [currentSong]);

  // Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const updateProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("progress", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("progress", updateProgress);
    };
  }, []);

  // Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  // Persist volume
  useEffect(() => {
    const saved = localStorage.getItem("volume");
    if (saved !== null) {
      setVolume(Number(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("volume", volume);
  }, [volume]);

  // Persist playback speed
  useEffect(() => {
    const saved = localStorage.getItem("speed");
    if (saved) {
      setPlaybackRate(Number(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("speed", playbackRate);
  }, [playbackRate]);

  // Persist repeat & shuffle
  useEffect(() => {
    const repeat = localStorage.getItem("repeat");
    const shuffleSaved = localStorage.getItem("shuffle");

    if (repeat) setRepeatMode(repeat);
    if (shuffleSaved) setShuffle(shuffleSaved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("repeat", repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    localStorage.setItem("shuffle", shuffle);
  }, [shuffle]);

  // Controls
  const play = () => {
    if (!currentSong) return;
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);
  const togglePlay = () => setIsPlaying(p => !p);

  const seek = time => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Math.max(0, Math.min(time, duration || 0));
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const seekForward = (sec = 10) => seek(currentTime + sec);
  const seekBackward = (sec = 10) => seek(currentTime - sec);
  const changeVolume = value => setVolume(Math.max(0, Math.min(1, value)));
  const toggleMute = () => setMuted(m => !m);

  const cycleRepeat = () => {
    if (repeatMode === "off") return setRepeatMode("all");
    if (repeatMode === "all") return setRepeatMode("one");
    setRepeatMode("off");
  };

  const toggleShuffle = () => setShuffle(s => !s);

  const togglePlaybackRate = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(next);
  };

  // Song
  const selectSong = index => {
    if (index < 0 || index >= playlist.length) return;
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
    setIsPlaying(true);
  };

  // Previous/Next
  const nextSong = () => {
    if (!playlist.length) return;
    
    if (shuffle) {
      if (playlist.length === 1) return;
      let random;
      do {
        random = Math.floor(Math.random() * playlist.length);
      } while (random === currentIndex);
      setCurrentIndex(random);
      setIsPlaying(true);
      return;
    }
    
    if (currentIndex === playlist.length - 1) {
      if (repeatMode === "all") {
        setCurrentIndex(0);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      return;
    }
    
    setCurrentIndex(i => (i + 1) % playlist.length);
    setIsPlaying(true);
  };

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
        random = Math.floor(Math.random() * playlist.length);
      } while (random === currentIndex);
      setCurrentIndex(random);
      setIsPlaying(true);
      return;
    }
    
    if (currentIndex === 0) {
      setCurrentIndex(playlist.length - 1);
    } else {
      setCurrentIndex(i => i - 1);
    }
    setIsPlaying(true);
  };

  // Ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      nextSong();
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [repeatMode, shuffle, currentIndex, playlist, nextSong]);

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
    toggleMute,
    cycleRepeat,
    toggleShuffle,
    togglePlaybackRate,
    selectSong
  };
}