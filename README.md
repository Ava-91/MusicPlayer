# 🎧 MusicPlayer

A modern, local-first music player built with **Next.js**, **React**, and **Tailwind CSS**.

MusicPlayer is designed to turn a local music collection into a polished, cinematic listening experience — with automatic metadata extraction, album artwork, favorites, search, playback controls, and a full playback queue.

Your music stays on your machine. No cloud music library is required.

---

## ✨ Features

### 🎵 Music Library

- 🎵 Automatic scanning of the local `public/songs` folder
- 📝 Automatic audio metadata extraction
- 🎤 Title, artist, and album information
- 💿 Automatic duration detection
- 🖼️ Embedded album artwork support
- 🖼️ Local cover fallback support
- 🔎 Real-time library search
- 📂 Automatic playlist generation

### ▶️ Playback

- ▶️ Play / Pause
- ⏮️ Previous track
- ⏭️ Next track
- ⏱️ Live progress tracking
- 🎯 Seek through tracks
- 🔀 Shuffle mode
- 🔁 Repeat modes
- 🎚️ Playback speed control
- 🔊 Volume control
- 🔇 Mute / Unmute

### 📋 Queue

- ➕ Add songs to the queue
- ⏭️ Play a song next
- ⬆️ Move queued songs up
- ⬇️ Move queued songs down
- ❌ Remove songs from the queue
- 🗑️ Clear the entire queue
- 🎵 Queue playback automatically continues through queued songs

### ❤️ Personalization

- ❤️ Favorite songs
- 💾 Persistent favorites
- 💾 Persistent volume settings
- 💾 Persistent playback speed
- 💾 Persistent repeat mode
- 💾 Persistent shuffle preference

### 🎨 Interface

- 🌙 Cinematic dark interface
- ✨ Framer Motion animations
- 🪟 Glassmorphism-inspired UI
- 📱 Responsive layout
- 🎛️ Component-based player architecture
- 🖼️ Animated album artwork
- 🎨 Modern Tailwind CSS styling

---

## 🛠️ Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,js,nodejs,git,github,vscode" alt="Tech stack" />
</p>

### Core

- **Next.js 16**
- **React 19**
- **Tailwind CSS 4**
- **JavaScript**
- **Node.js**

### Libraries

- **Framer Motion** — animations
- **Lucide React** — icons
- **music-metadata** — audio metadata extraction

---

## 📂 Project Structure

```text
MusicPlayer/
├── app/
│   ├── api/
│   │   └── songs/
│   │       ├── route.js
│   │       └── artwork/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── hooks/
│   │   └── useAudio.js
│   │
│   └── Player/
│       ├── AlbumCover.jsx
│       ├── Controls.jsx
│       ├── KeyboardShortcutsHelp.jsx
│       ├── PlayerCard.jsx
│       ├── Playlist.jsx
│       ├── ProgressBar.jsx
│       ├── Queue.jsx
│       ├── SearchBar.jsx
│       └── VolumeSlider.jsx
│
├── public/
│   ├── covers/
│   │   └── default.jpg
│   │
│   └── songs/
│       └── your-music-files
│
├── next.config.ts
├── package.json
└── README.md
````

---

## 🎵 Local Music Library

MusicPlayer uses a **local-first** architecture.

Place your music files inside:

```text
public/
└── songs/
    ├── song.mp3
    ├── another-song.m4a
    └── ...
```

The application automatically scans the directory and creates the music library.

You don't need to manually create a playlist JSON file.

### Supported audio formats

* `.mp3`
* `.m4a`
* `.wav`
* `.flac`
* `.ogg`
* `.opus`

### Metadata

MusicPlayer can automatically extract:

* Title
* Artist
* Album
* Year
* Duration
* Embedded album artwork

If a file doesn't contain metadata, MusicPlayer falls back to information derived from the filename.

---

## 🖼️ Album Artwork

MusicPlayer uses a fallback system for album artwork.

It first checks whether the audio file contains embedded artwork.

If embedded artwork isn't available, it looks for a matching image inside:

```text
public/
└── covers/
```

For example:

```text
public/
├── songs/
│   └── song.mp3
│
└── covers/
    └── song.jpg
```

Supported cover formats include:

* `.jpg`
* `.jpeg`
* `.png`
* `.webp`
* `.avif`

If no artwork is available, the default cover is used:

```text
/covers/default.jpg
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ava-91/MusicPlayer.git
cd MusicPlayer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your music

Create the music directory if it doesn't already exist:

```text
public/
└── songs/
```

Then place your local music files inside it.

> Music files in `public/songs` are intentionally excluded from Git. Add your own music files after cloning the repository.

### 4. Start the development server

```bash
npm run dev
```

### 5. Open MusicPlayer

Visit:

```text
http://localhost:3000
```

---

## 🧪 Development Commands

Run the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript checking:

```bash
npm run type-check
```

Create a production build:

```bash
npm run build
```

Check installed package vulnerabilities:

```bash
npm audit
```

---

## 🔒 Local-First Design

MusicPlayer is designed around keeping your music local.

Your audio files are read from:

```text
public/songs/
```

The application doesn't require a cloud music storage service or an online music library.

This also means the repository does **not** contain personal music files.

The `.gitignore` excludes:

```text
/public/songs/
```

so local music files aren't accidentally committed to Git.

---

## 📋 Current Status

### Implemented

* [x] Local music library
* [x] Automatic music scanning
* [x] Metadata extraction
* [x] Embedded album artwork
* [x] Local cover fallback
* [x] Automatic duration detection
* [x] Play / Pause
* [x] Previous / Next
* [x] Progress bar
* [x] Seeking
* [x] Volume control
* [x] Mute / Unmute
* [x] Playback speed
* [x] Shuffle
* [x] Repeat
* [x] Search
* [x] Favorites
* [x] Persistent player settings
* [x] Playback queue
* [x] Add to queue
* [x] Play next
* [x] Queue reordering
* [x] Queue removal
* [x] Queue clearing
* [x] Responsive interface
* [x] Animated UI

---

## 🗺️ Roadmap

Possible future improvements include:

* [ ] Improved keyboard shortcut system
* [ ] Lyrics support
* [ ] Audio visualizer
* [ ] Custom playlists
* [ ] Better library organization
* [ ] Album / artist browsing
* [ ] More advanced playback controls
* [ ] Improved mobile experience
* [ ] Electron desktop version

The roadmap may change as the project evolves.

---

## 💙 Why I Made This

I wanted to build a **real music player** instead of another tutorial project.

MusicPlayer has been a way for me to explore how real applications handle:

* Browser audio APIs
* Local media files
* Audio metadata
* Album artwork
* React state management
* Custom hooks
* Component architecture
* Persistent client-side settings
* Playback queues
* Responsive UI design
* Animations
* Next.js API routes

The goal isn't just to make the player work — it's to make it feel like an actual application.

---

## 🎀 Developer

Built by **Ava** ✨

> Turning bugs into features and CSS suffering into pretty interfaces.

---

## 📜 License

This project is intended for personal and educational use.

Music files are **not included** in the repository. Make sure you have the necessary rights to any music you add to your local library.
