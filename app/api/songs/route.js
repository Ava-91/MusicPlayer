import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";

const SUPPORTED_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".wav",
  ".flac",
  ".ogg",
  ".opus",
];

const DEFAULT_COVER = "/covers/default.jpg";

// Metadata is cached while the Next.js server process is running.
const metadataCache = new Map();

function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

function titleFromFilename(filename) {
  return removeExtension(filename)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findLocalCover(filename) {
  const coversFolder = path.join(
    process.cwd(),
    "public",
    "covers"
  );

  const name = removeExtension(filename);

  const possible = [
    `${name}.jpg`,
    `${name}.jpeg`,
    `${name}.png`,
    `${name}.webp`,
    `${name}.avif`,
  ];

  for (const cover of possible) {
    if (fs.existsSync(path.join(coversFolder, cover))) {
      return `/covers/${cover}`;
    }
  }

  return DEFAULT_COVER;
}

async function readSongMetadata(filePath, file) {
  const stat = fs.statSync(filePath);

  const cached = metadataCache.get(file);

  /*
   * Reuse metadata when the file hasn't changed.
   */
  if (
    cached &&
    cached.mtimeMs === stat.mtimeMs &&
    cached.size === stat.size
  ) {
    return cached.metadata;
  }

  try {
    const metadata = await parseFile(filePath);

    const common = metadata.common;
    const format = metadata.format;

    const result = {
      title:
        common.title ||
        titleFromFilename(file),

      artist:
        common.artist ||
        "Unknown Artist",

      album:
        common.album ||
        "Unknown Album",

      year:
        common.year ?? null,

      duration:
        Number.isFinite(format.duration)
          ? format.duration
          : 0,

      hasEmbeddedCover:
        Boolean(
          common.picture?.length
        ),
    };

    metadataCache.set(file, {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      metadata: result,
    });

    return result;
  } catch (error) {
    console.warn(
      `Couldn't read metadata from ${file}`
    );

    const fallback = {
      title: titleFromFilename(file),
      artist: "Unknown Artist",
      album: "Unknown Album",
      year: null,
      duration: 0,
      hasEmbeddedCover: false,
    };

    metadataCache.set(file, {
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      metadata: fallback,
    });

    return fallback;
  }
}

export async function GET() {
  const songsFolder = path.join(
    process.cwd(),
    "public",
    "songs"
  );

  if (!fs.existsSync(songsFolder)) {
    return Response.json([]);
  }

  let files;

  try {
    files = fs
      .readdirSync(songsFolder)
      .filter((file) => {
        const ext =
          path.extname(file).toLowerCase();

        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .sort((a, b) =>
        titleFromFilename(a).localeCompare(
          titleFromFilename(b)
        )
      );
  } catch (error) {
    console.error(
      "Failed to read songs directory:",
      error
    );

    return Response.json([]);
  }

  const songs = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(
        songsFolder,
        file
      );

      try {
        const metadata =
          await readSongMetadata(
            filePath,
            file
          );

        const localCover =
          findLocalCover(file);

        /*
         * Prefer a local cover when one exists.
         *
         * Embedded artwork is served separately
         * so the main API response stays lightweight.
         */
        const cover =
          localCover !== DEFAULT_COVER
            ? localCover
            : metadata.hasEmbeddedCover
              ? `/api/songs/artwork?file=${encodeURIComponent(file)}`
              : DEFAULT_COVER;

        return {
          id: file,

          title: metadata.title,

          artist: metadata.artist,

          album: metadata.album,

          year: metadata.year,

          duration: metadata.duration,

          audio: `/songs/${encodeURIComponent(file)}`,

          cover,
        };
      } catch (error) {
        /*
         * A single broken file must never
         * break the entire library.
         */
        console.warn(
          `Couldn't process ${file}:`,
          error
        );

        return {
          id: file,

          title: titleFromFilename(file),

          artist: "Unknown Artist",

          album: "Unknown Album",

          year: null,

          duration: 0,

          audio: `/songs/${encodeURIComponent(file)}`,

          cover: findLocalCover(file),
        };
      }
    })
  );

  return Response.json(songs);
}