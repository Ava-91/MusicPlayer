# 🎧 MusicPlayer

A modern music player built with **Next.js**, **React**, and **Tailwind CSS**.

Designed with a cinematic dark interface, smooth animations, automatic metadata extraction, and a clean component-based architecture.

---

## ✨ Features

- 🎵 Automatic music folder scanning
- 📝 MP3 metadata extraction
- 🎤 Song, artist and album information
- 🖼️ Embedded album artwork support
- ▶️ Play / Pause
- ⏮️ Previous / Next track
- ⏱️ Live progress bar with seeking
- 🔊 Volume control
- ❤️ Favorite songs
- 🔎 Real-time search
- 📂 Automatic playlist generation
- 💾 Persistent favorites
- 💿 Automatic duration detection
- ✨ Smooth Framer Motion animations
- 🌙 Responsive glassmorphism UI

---

## 🛠️ Tech Stack

<p>
<img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,js,nodejs,git,github,vscode"/>
</p>

### Libraries

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide React
- music-metadata
- Node.js

---

## 📂 Project Structure

```
public/
└── songs/
├── song1.mp3
├── song2.mp3
└── ...
```

The application automatically scans the `public/songs` folder and extracts metadata from every supported audio file.

No playlist JSON is required.

---

## 🎵 Supported Metadata

The player automatically reads:

- Title
- Artist
- Album
- Duration
- Embedded cover artwork

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Ava-91/MusicPlayer
cd musicplayer
````

Install dependencies

```bash
npm install
```

Create a folder for your music

```
public/
└── songs/
```

Copy your `.mp3` files into the `public/songs` folder.

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

## 🚧 Current Features

* ✅ Music playback
* ✅ Automatic playlist generation
* ✅ Search
* ✅ Favorites
* ✅ Volume control
* ✅ Album artwork
* ✅ Metadata extraction
* ✅ Animated UI
* ✅ Responsive layout

---

## 📋 Planned Features

* ⬜ Shuffle mode
* ⬜ Repeat mode
* ⬜ Playback speed
* ⬜ Mute button
* ⬜ Keyboard shortcuts improvements
* ⬜ Lyrics support
* ⬜ Audio visualizer
* ⬜ Queue management
* ⬜ Electron desktop version

---

## 💙 Why I made this

I wanted to build a real music player instead of another tutorial project. This project helped me learn about media APIs, metadata extraction, reusable React hooks, component architecture, and building polished interfaces with Next.js.

---

## 🎀 Developer

Built by **Ava** ✨

> Turning bugs into features and CSS suffering into pretty interfaces.
