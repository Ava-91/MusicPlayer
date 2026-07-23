import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";

export async function GET() {
  const songsFolder = path.join(
    process.cwd(),
    "public",
    "songs"
  );

  const files = fs
    .readdirSync(songsFolder)
    .filter((file) =>
      file.endsWith(".mp3") ||
      file.endsWith(".ogg") ||
      file.endsWith(".m4a")
    );

  const songs = await Promise.all(
    files.map(async (file, index) => {
      const filePath = path.join(
        songsFolder,
        file
      );

      try {
        const metadata = await parseFile(filePath);

        const common = metadata.common;
        const format = metadata.format;

        let cover = "/covers/default.jpg";

        if (
          common.picture &&
          common.picture.length > 0
        ) {
          const picture = common.picture[0];

          const base64 = Buffer.from(
            picture.data
          ).toString("base64");

          cover = `data:${picture.format};base64,${base64}`;
        }

        return {
          id: index + 1,

          title:
            common.title ||
            file.replace(/\.(mp3|ogg|m4a)$/i, ""),

          artist:
            common.artist ||
            "Unknown Artist",

          album:
            common.album ||
            "Unknown Album",

          year:
            common.year ||
            null,

          duration:
            format.duration || 0,

          audio:
            `/songs/${file}`,

          cover,
        };
      } catch (error) {
        console.log(
          "Metadata error:",
          file
        );

        return {
          id: index + 1,

          title:
            file.replace(".mp3", ""),

          artist:
            "Unknown Artist",

          album:
            "Unknown Album",

          duration: 0,

          audio:
            `/songs/${file}`,

          cover:
            "/covers/default.jpg",
        };
      }
    })
  );

  return Response.json(songs);
}