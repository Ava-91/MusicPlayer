# AGENTS.md

## Project Overview

MusicPlayer is a modern local music player built with:

* Next.js 16 (App Router)
* React 19
* Tailwind CSS 4
* JavaScript (no TypeScript)
* Framer Motion
* Lucide React

The application scans the `public/songs` directory, extracts MP3 metadata through the API layer, and builds the playlist automatically.

---

## Development Goals

When modifying this project:

* Preserve the existing UI style.
* Prefer improving existing components over replacing them.
* Keep the application responsive.
* Prioritize readability over clever code.
* Avoid unnecessary dependencies.
* Maintain smooth animations without sacrificing performance.

---

## Coding Style

### General

* Use functional React components.
* Use React Hooks.
* Avoid class components.
* Prefer early returns.
* Prefer descriptive variable names.
* Avoid deeply nested conditionals.
* Avoid duplicated logic.

---

### Components

Each component should have one responsibility.

Good examples:

* AlbumCover
* ProgressBar
* Controls
* Playlist
* SearchBar
* VolumeSlider

Do not merge unrelated UI into large components.

---

### Hooks

Reusable logic belongs inside custom hooks.

Current hooks include:

* useAudio
* usePlaylist
* useKeyboard

Keep hooks focused on behavior rather than UI.

---

### Styling

Use Tailwind CSS utilities.

Avoid:

* inline styles
* custom CSS files unless absolutely necessary

Maintain the current glassmorphism design language:

* rounded corners
* soft borders
* translucent backgrounds
* subtle gradients
* smooth transitions

---

## Performance

Prefer:

* memo()
* useMemo()
* useCallback() when appropriate

Avoid unnecessary re-renders.

Avoid recreating functions inside large lists unless required.

---

## File Structure

```
app/
components/
components/hooks/
public/songs/
public/covers/
```

Keep files organized by responsibility.

---

## Audio

Music is loaded dynamically.

Do not hardcode playlists.

Songs originate from:

```
public/songs/
```

Metadata is generated automatically through the API.

---

## UI Rules

Maintain:

* centered desktop layout
* fixed player panel
* independently scrollable playlist
* responsive behavior
* smooth Framer Motion transitions

Do not introduce page scrolling unless necessary.

---

## Error Handling

Gracefully handle:

* empty playlists
* failed metadata extraction
* missing artwork
* missing metadata
* invalid files

The player should never crash because a search returns zero songs.

---

## Commands

Install

```bash
npm install
```

Development

```bash
npm run dev
```

Production

```bash
npm run build
npm start
```

Lint

```bash
npm run lint
```

---

## Pull Request Expectations

Changes should:

* preserve existing functionality
* avoid breaking APIs
* avoid unnecessary refactors
* keep files reasonably small
* follow the existing architecture

When fixing bugs, prefer the smallest correct fix over rewriting large portions of the project.
