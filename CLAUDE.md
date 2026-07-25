# CLAUDE.md

This repository contains a local desktop-style music player built with Next.js.

Please read this document before generating or modifying code.

---

# Stack

* Next.js 16 App Router
* React 19
* JavaScript
* Tailwind CSS 4
* Framer Motion
* Lucide React

---

# Architecture

Business logic belongs inside custom hooks.

UI belongs inside components.

Current architecture:

```
components/
├── Player/
├── hooks/
│   ├── useAudio.js
│   ├── usePlaylist.js
│   └── useKeyboard.js
└── MusicPlayer.jsx
```

Do not move application logic into UI components unless absolutely necessary.

---

# Design Principles

The project aims for a premium desktop music player aesthetic.

Characteristics:

* glassmorphism
* soft shadows
* smooth animations
* rounded corners
* dark appearance
* minimal interface
* responsive layout

Do not redesign the interface unless explicitly requested.

---

# Code Guidelines

Prefer:

* small reusable functions
* early returns
* readable code
* consistent naming
* composition over duplication

Avoid:

* unnecessary abstraction
* giant components
* unnecessary libraries
* excessive comments

---

# Audio Behavior

Music is loaded dynamically from:

```
public/songs/
```

The playlist should automatically update whenever songs change.

Searching, filtering, or empty playlists must never crash the player.

Playback state should remain stable whenever possible.

---

# Performance

When appropriate:

* memoize expensive calculations
* memoize list items
* avoid unnecessary renders
* avoid duplicate state

Do not optimize prematurely if it hurts readability.

---

# Error Handling

Always handle:

* missing songs
* missing artwork
* failed fetch requests
* empty search results
* invalid metadata

The application should continue functioning even if no playable files exist.

---

# Styling

Use Tailwind utilities.

Prefer existing spacing and sizing conventions.

Avoid introducing arbitrary values unless they improve consistency.

Keep animations subtle.

---

# Project Philosophy

The goal is not simply to make the application work.

The goal is to build maintainable, reusable, well-structured code while preserving a polished user experience.

Whenever multiple solutions exist:

1. Prefer correctness.
2. Prefer readability.
3. Prefer consistency with the existing project.
4. Prefer smaller changes over complete rewrites.

If a requested change conflicts with the current architecture, preserve the architecture unless instructed otherwise.
