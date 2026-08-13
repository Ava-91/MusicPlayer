"use client";

import { useCallback, useState } from "react";

export default function useQueue() {
  const [queue, setQueue] = useState([]);

  /**
   * Add a song to the end of the queue.
   *
   * Duplicate songs are allowed.
   */
  const addToQueue = useCallback((song) => {
    if (!song) {
      return;
    }

    setQueue((currentQueue) => [
      ...currentQueue,
      song,
    ]);
  }, []);

  /**
   * Add a song to the front of the queue.
   *
   * This means the song will be played
   * before every other queued song.
   */
  const playNext = useCallback((song) => {
    if (!song) {
      return;
    }

    setQueue((currentQueue) => [
      song,
      ...currentQueue,
    ]);
  }, []);

  /**
   * Remove a song from the queue by index.
   *
   * We remove by index because duplicate
   * songs are allowed.
   */
  const removeFromQueue = useCallback((index) => {
    setQueue((currentQueue) => {
      if (
        index < 0 ||
        index >= currentQueue.length
      ) {
        return currentQueue;
      }

      return currentQueue.filter(
        (_, queueIndex) =>
          queueIndex !== index
      );
    });
  }, []);

  /**
   * Remove the first song from the queue.
   *
   * Useful when a queued song starts playing.
   */
  const removeFirst = useCallback(() => {
    setQueue((currentQueue) => {
      if (!currentQueue.length) {
        return currentQueue;
      }

      return currentQueue.slice(1);
    });
  }, []);

  /**
   * Move a queue item from one position
   * to another.
   */
  const moveInQueue = useCallback(
    (fromIndex, toIndex) => {
      setQueue((currentQueue) => {
        if (
          fromIndex < 0 ||
          fromIndex >= currentQueue.length ||
          toIndex < 0 ||
          toIndex >= currentQueue.length ||
          fromIndex === toIndex
        ) {
          return currentQueue;
        }

        const nextQueue = [...currentQueue];

        const [movedSong] =
          nextQueue.splice(
            fromIndex,
            1
          );

        nextQueue.splice(
          toIndex,
          0,
          movedSong
        );

        return nextQueue;
      });
    },
    []
  );

  /**
   * Move a song one position upward.
   */
  const moveUp = useCallback((index) => {
    setQueue((currentQueue) => {
      if (
        index <= 0 ||
        index >= currentQueue.length
      ) {
        return currentQueue;
      }

      const nextQueue = [...currentQueue];

      [
        nextQueue[index - 1],
        nextQueue[index],
      ] = [
        nextQueue[index],
        nextQueue[index - 1],
      ];

      return nextQueue;
    });
  }, []);

  /**
   * Move a song one position downward.
   */
  const moveDown = useCallback((index) => {
    setQueue((currentQueue) => {
      if (
        index < 0 ||
        index >= currentQueue.length - 1
      ) {
        return currentQueue;
      }

      const nextQueue = [...currentQueue];

      [
        nextQueue[index],
        nextQueue[index + 1],
      ] = [
        nextQueue[index + 1],
        nextQueue[index],
      ];

      return nextQueue;
    });
  }, []);

  /**
   * Remove every song from the queue.
   */
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  /**
   * Replace the entire queue.
   */
  const setQueueItems = useCallback((songs) => {
    if (!Array.isArray(songs)) {
      setQueue([]);
      return;
    }

    setQueue(songs.filter(Boolean));
  }, []);

  return {
    queue,

    addToQueue,
    playNext,

    removeFromQueue,
    removeFirst,

    moveInQueue,
    moveUp,
    moveDown,

    clearQueue,
    setQueueItems,
  };
}