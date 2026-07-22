import fs from "fs";
import path from "path";

export async function GET() {
  const songsFolder = path.join(process.cwd(), "public", "songs");

  const files = fs
    .readdirSync(songsFolder)
    .filter((file) => file.endsWith(".mp3"));

  const songs = files.map((file, index) => ({
    id: index + 1,

    title: file.replace(".mp3", ""),

    artist: "Unknown Artist",

    audio: `/songs/${file}`,

    cover: "/covers/default.jpg",
  }));

  return Response.json(songs);
}