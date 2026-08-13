# Support

Having trouble with MusicPlayer? This guide covers common setup, development, and usage problems.

MusicPlayer is **local-first**. Your music files are read from your local `public/songs` directory during development. The project does not require a cloud music service, account, or authentication.

---

## 🎵 Music files are not appearing

Make sure your audio files are inside:

```text
public/
└── songs/
    ├── song1.mp3
    ├── song2.m4a
    └── ...
```

MusicPlayer scans this directory automatically.

### Supported audio formats

The current supported formats are:

* `.mp3`
* `.m4a`
* `.wav`
* `.flac`
* `.ogg`
* `.opus`

Also check that:

* The file extension is correct.
* The file is actually a supported audio file.
* The development server has been restarted if necessary.
* The browser can normally play the audio file.

### Important: music files are not part of the repository

The `public/songs` directory is intended for your **local music library** and is ignored by Git.

Do not commit copyrighted music to the repository unless you have the necessary rights or permission to distribute it.

---

## 📝 Metadata is missing or incorrect

MusicPlayer uses audio metadata to obtain information such as:

* Title
* Artist
* Album
* Year
* Duration
* Embedded artwork

If a song does not contain metadata, MusicPlayer uses fallback values where possible.

For example, a file named:

```text
my_favorite_song.mp3
```

may be displayed using a title derived from its filename if no title metadata is available.

### How to fix metadata problems

Check the file's metadata using a suitable audio metadata editor and make sure fields such as **Title**, **Artist**, and **Album** are populated correctly.

After changing metadata, restart the development server or reload the application if the previous information is still displayed.

---

## 🖼️ Album artwork is missing

MusicPlayer can use embedded artwork from supported audio files.

If embedded artwork is unavailable, the application can fall back to locally provided artwork.

Make sure that:

* The image format is supported.
* The artwork is actually embedded in the audio file if you expect embedded artwork to be used.
* Any local cover file is placed in the expected `public/covers` directory.
* The image path is valid.

If artwork works for some songs but not others, the problem may be with the metadata or artwork stored in the individual audio files.

---

## 🚀 Development server does not start

First make sure you are using a supported Node.js version.

Then install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application should normally be available at:

```text
http://localhost:3000
```

If the server still fails to start, check the terminal output for the specific error.

---

## 📦 Dependency installation problems

If `npm install` fails:

1. Make sure Node.js and npm are installed.
2. Check that your Node.js version is compatible with the project.
3. Make sure you are running the command from the repository root.
4. Try installing the dependencies again.

You can check your versions with:

```bash
node --version
npm --version
```

If the dependency tree has become inconsistent, you can remove `node_modules` and reinstall:

```bash
rm -rf node_modules
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Avoid deleting lockfiles unless you specifically understand why doing so is necessary.

---

## 🧪 Type-check failures

Run:

```bash
npm run type-check
```

This runs TypeScript without generating output.

If it reports an error:

* Read the file and line number shown in the output.
* Check for incorrect types or missing properties.
* Make sure dependencies are installed.
* Check whether the error is caused by your local changes.

Do not ignore type-check failures when preparing a pull request.

---

## 🧹 Lint failures

Run:

```bash
npm run lint
```

ESLint checks the project's JavaScript, JSX, and related source files.

If linting fails:

1. Read the reported file and line number.
2. Fix the underlying issue.
3. Run the command again.

Do not disable an ESLint rule simply to make the check pass unless there is a clear reason and the change is justified.

---

## 🏗️ Production build failures

Run:

```bash
npm run build
```

The production build catches problems that may not appear during normal development.

If the build fails:

* Read the first meaningful error in the terminal.
* Check whether your recent changes caused the failure.
* Run `npm run lint` and `npm run type-check`.
* Make sure all dependencies are installed correctly.

A successful development server does not necessarily mean the production build will succeed.

---

## 🔍 Checking everything before opening a PR

Before submitting a pull request, run:

```bash
npm run lint
npm run type-check
npm run build
npm audit
```

Ideally, all four commands should complete successfully.

The project should also have no unexpected changes or untracked files:

```bash
git status
```

---

## 🌐 Browser-specific problems

Music playback can behave differently between browsers because browsers have different implementations and policies around:

* Audio formats and codecs
* Autoplay
* Media loading
* Caching
* `HTMLAudioElement` behavior

If MusicPlayer works in one browser but not another, first try:

1. Reloading the page.
2. Checking the browser console for errors.
3. Checking whether the audio file itself plays in that browser.
4. Testing with another supported audio file.
5. Testing in another supported browser.

When reporting a browser-specific problem, include the browser name and version.

---

## 🐛 Something still does not work?

If these troubleshooting steps do not solve the problem, open a GitHub Issue in the MusicPlayer repository.

When reporting a bug, include as much useful information as possible.

### Please include

**1. What happened**

Describe the problem clearly.

**2. What you expected**

Explain what you expected MusicPlayer to do.

**3. Steps to reproduce**

For example:

```text
1. Start the development server.
2. Add an MP3 file to public/songs.
3. Open MusicPlayer.
4. Select the song.
5. The player does not load the audio.
```

**4. Environment**

Include:

```text
Operating system:
Node.js version:
npm version:
Browser and version:
MusicPlayer version/commit:
```

**5. Error messages**

Include relevant terminal or browser-console errors.

For example:

```text
npm run lint

<error output here>
```

Avoid posting passwords, private credentials, API keys, or other sensitive information.

---

## 💡 Feature requests and suggestions

If you have an idea for improving MusicPlayer, open a GitHub Issue describing:

* What you would like to add or change.
* Why the feature would be useful.
* How you imagine it working.
* Any relevant examples or screenshots.

Please check existing Issues first to avoid creating duplicates.

---

## 🎧 Keeping MusicPlayer local-first

MusicPlayer is designed around a local music library.

Your audio files live on your own machine and are read from the project's local `public/songs` directory during development.

The project does not require:

* A cloud music library
* User accounts
* Authentication
* A remote music database
* Cloud storage for your songs

Please keep contributions consistent with this local-first architecture.

---

## 📌 Before opening an issue

If possible, verify:

```text
[ ] My music files are in public/songs
[ ] My audio format is supported
[ ] I checked the browser console
[ ] I checked the terminal output
[ ] npm run lint passes
[ ] npm run type-check passes
[ ] npm run build passes
[ ] I searched existing Issues
```

If the problem still exists after troubleshooting, please open an Issue with the relevant details.

Thank you for helping improve MusicPlayer! 🎧