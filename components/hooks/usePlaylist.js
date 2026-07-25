"use client";

import { useEffect, useMemo, useState } from "react";

export default function usePlaylist() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [favorites, setFavorites] = useState([]);

  // Load Playlist
  useEffect(() => {
    async function loadSongs() {
      try {
        setLoading(true);
        const response = await fetch("/api/songs");
        if (!response.ok) {
          throw new Error("Couldn't load playlist.");
        }
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        setError(err.message || "Unknown error.");
      } finally {
        setLoading(false);
      }
    }
    loadSongs();
  }, []);

  // Favorites
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  // Search & Filter
  const filteredSongs = useMemo(() => {
    let list = [...songs];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(song =>
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "artist":
        list.sort((a, b) => a.artist.localeCompare(b.artist));
        break;
      case "newest":
        list.reverse();
        break;
      default:
        list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [songs, search, sortBy]);

  // Helpers
  function clearSearch() {
    setSearch("");
  }

  function refresh() {
    setLoading(true);
    fetch("/api/songs")
      .then(res => res.json())
      .then(data => {
        setSongs(data);
        setError("");
      })
      .catch(() => {
        setError("Couldn't refresh playlist.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    songs,
    filteredSongs,
    loading,
    error,
    search,
    sortBy,
    favorites,
    setSongs,
    setSearch,
    setSortBy,
    toggleFavorite,
    clearSearch,
    refresh
  };
}