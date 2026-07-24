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

export async function GET() {
  const songsFolder = path.join(
    process.cwd(),
    "public",
    "songs"
  );

  if (!fs.existsSync(songsFolder)) {
    return Response.json([]);
  }

  const files = fs
    .readdirSync(songsFolder)
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    })
    .sort((a, b) =>
      titleFromFilename(a).localeCompare(
        titleFromFilename(b)
      )
    );

  const songs = await Promise.all(
    files.map(async (file, index) => {
      const filePath = path.join(
        songsFolder,
        file
      );

      const fallbackTitle =
        titleFromFilename(file);

      const fallbackCover =
        findLocalCover(file);

      try {
        const metadata =
          await parseFile(filePath);

        const common = metadata.common;
        const format = metadata.format;

        let cover = fallbackCover;

        if (
          common.picture &&
          common.picture.length > 0
        ) {
          const picture =
            common.picture[0];

          const base64 = Buffer.from(
            picture.data
          ).toString("base64");

          cover = `data:${picture.format};base64,${base64}`;
        }

        return {
          id: index + 1,

          title:
            common.title ||
            fallbackTitle,

          artist:
            common.artist ||
            "Unknown Artist",

          album:
            common.album ||
            "Unknown Album",

          year:
            common.year ?? null,

          duration:
            format.duration ?? 0,

          audio: `/songs/${file}`,

          cover,
        };
      } catch (err) {
        console.log(
          `Couldn't read metadata from ${file}`
        );

        return {
          id: index + 1,

          title: fallbackTitle,

          artist: "Unknown Artist",

          album: "Unknown Album",

          year: null,

          duration: 0,

          audio: `/songs/${file}`,

          cover: fallbackCover,
        };
      }
    })
  );

  return Response.json(songs);
}