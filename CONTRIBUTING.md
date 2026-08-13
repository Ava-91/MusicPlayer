# Contributing to MusicPlayer

Thank you for your interest in contributing to MusicPlayer! 🎧

MusicPlayer is a local-first music player built with Next.js, React, and Tailwind CSS. Contributions are welcome, whether you're fixing a bug, improving the UI, adding a feature, or improving the documentation.

Please read this guide before opening a pull request.

---

## 📋 Before You Start

Before making changes, check the existing:

- [Issues](https://github.com/Ava-91/MusicPlayer/issues)
- [Pull requests](https://github.com/Ava-91/MusicPlayer/pulls)

For larger changes, consider opening an Issue first to discuss the idea before implementing it.

Please avoid working on an issue that is already assigned to someone else unless you have discussed it with them.

---

## 🍴 Fork and Clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/MusicPlayer.git
cd MusicPlayer
````

Add the original repository as an upstream remote if you plan to keep your fork synchronized:

```bash
git remote add upstream https://github.com/Ava-91/MusicPlayer.git
```

---

## 🛠️ Development Setup

### Requirements

MusicPlayer currently uses:

* Node.js 24 LTS or newer LTS-compatible version
* npm
* Git

Check your installed versions:

```bash
node --version
npm --version
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 🎵 Local Music Library

MusicPlayer is designed to work with music stored locally on the user's machine.

For local development, place your own audio files in:

```text
public/
└── songs/
    ├── song1.mp3
    ├── song2.m4a
    └── ...
```

Supported audio formats currently include:

* `.mp3`
* `.m4a`
* `.wav`
* `.flac`
* `.ogg`
* `.opus`

The application automatically scans the directory and extracts available metadata and embedded artwork.

### ⚠️ Do not commit copyrighted music

The `public/songs/` directory is intended for local development and is ignored by Git.

Do **not** commit commercial music, copyrighted audio, or other media that you do not have permission to redistribute.

If you need audio files for testing, use music that you created yourself or audio that you are legally allowed to redistribute.

---

## 📜 Available Commands

The following commands are available through `package.json`.

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Lint

```bash
npm run lint
```

Runs ESLint and checks the project for linting problems.

### Type-check

```bash
npm run type-check
```

Runs TypeScript's type checker without generating files.

### Production build

```bash
npm run build
```

Creates an optimized production build.

### Start production server

```bash
npm run start
```

Starts the previously built production application.

### Formatting

If formatting changes are made, use the project's configured Prettier tooling and ensure the resulting files follow the existing project formatting conventions.

---

## 🌿 Branching

Please create a separate branch for your work instead of committing directly to `main`.

Use a descriptive branch name:

```text
feature/queue-management
fix/audio-loading
docs/contributing-guide
refactor/player-controls
```

Recommended prefixes:

* `feature/` — new functionality
* `fix/` — bug fixes
* `docs/` — documentation changes
* `refactor/` — code restructuring without changing behavior
* `chore/` — maintenance and tooling changes

Example:

```bash
git checkout -b feature/queue-management
```

---

## 💬 Commit Messages

Keep commit messages short and descriptive.

Use a conventional prefix where appropriate:

```text
feat: add queue management
fix: prevent player layout from collapsing
docs: add contributing guide
refactor: simplify audio state handling
chore: update dependencies
```

A good commit message should describe **what changed**, not the entire implementation process.

### Examples

Good:

```text
fix: prevent progress thumb from clipping
```

```text
docs: add MusicPlayer README preview
```

Less useful:

```text
updated stuff
```

```text
changes
```

---

## 🔍 Before Opening a Pull Request

Before submitting a PR, run the project's checks:

```bash
npm run lint
npm run type-check
npm run build
npm audit
```

Make sure:

* ESLint reports no errors.
* Type-checking succeeds.
* The production build succeeds.
* `npm audit` does not report known vulnerabilities.
* Your changes do not introduce unnecessary warnings or errors.
* You have tested the affected functionality locally.

If your changes affect playback, metadata, artwork, queues, or other audio functionality, test those behaviors manually as well.

---

## 📦 Pull Requests

When opening a pull request:

1. Keep the PR focused on one feature, fix, or documentation change.
2. Explain what you changed.
3. Explain why the change was needed.
4. Mention any important implementation details.
5. Include screenshots or recordings when they help demonstrate UI changes.
6. Link the relevant Issue when applicable.

For example:

```md
## Summary

- Added queue reordering
- Added remove-from-queue controls
- Improved empty queue state

Closes #XX
```

Avoid combining unrelated changes into one PR unless they are necessary for the same task.

---

## 🐛 Reporting Bugs

If you find a bug, please open an Issue.

Include:

* A clear description of the problem.
* Steps to reproduce it.
* What you expected to happen.
* What actually happened.
* Your browser and operating system when relevant.
* Relevant error messages or console output.
* Screenshots or recordings when useful.

A useful bug report might look like:

```text
### Bug

The progress bar does not update after switching tracks.

### Steps to reproduce

1. Start playing a song.
2. Select another song.
3. Observe the progress bar.

### Expected behavior

The progress bar should reset and follow the newly selected song.

### Actual behavior

The previous song's progress remains visible.
```

Please remove personal information from logs and screenshots before posting them.

---

## 💡 Proposing Features

Feature requests are welcome.

Before opening one, check whether a similar Issue already exists.

When proposing a feature, explain:

* What the feature should do.
* Why it would be useful.
* How you expect it to work.
* Any relevant UI or technical considerations.

For larger features, discussing the design before implementation can help avoid duplicated or unnecessary work.

---

## 🎨 UI and Code Contributions

When modifying the interface:

* Follow the existing visual style.
* Prefer reusable components over duplicated UI code.
* Keep responsive behavior in mind.
* Preserve keyboard accessibility where applicable.
* Use existing project dependencies when they already provide the required functionality.

When modifying application logic:

* Keep components focused.
* Prefer clear and maintainable React patterns.
* Avoid unnecessary state or effects.
* Keep audio-related behavior synchronized with the HTML audio element.

---

## 🔒 Local-First Design

MusicPlayer is intentionally **local-first**.

The application is designed to scan and play music provided by the user rather than acting as a cloud music service or a Spotify-style streaming platform.

Contributions should preserve this principle unless a change has been explicitly discussed and approved.

Do not add functionality that assumes the project hosts or distributes copyrighted music.

---

## 📄 Documentation Contributions

Documentation improvements are welcome.

When changing documentation:

* Keep instructions accurate to the current codebase.
* Avoid duplicating information unnecessarily.
* Use clear examples.
* Update documentation when a feature or command changes.

---

## 🤝 Pull Request Review

After opening a PR, maintainers may request changes.

Please treat review comments as part of the contribution process. If changes are requested, update your branch and push the new commits.

A PR may be reviewed for:

* Correctness
* Maintainability
* Accessibility
* Performance
* Security
* Consistency with the existing architecture
* Documentation quality
* Compatibility with the project's local-first design

---

## ❤️ Thank You

Thank you for helping improve MusicPlayer!

Whether you're fixing a small bug, improving the documentation, polishing the interface, or adding a larger feature, every thoughtful contribution is appreciated.

Happy coding! 🎧