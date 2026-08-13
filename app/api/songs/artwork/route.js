import fs from "fs";
import path from "path";
import { parseFile } from "music-metadata";

export async function GET(request) {
  const { searchParams } =
    new URL(request.url);

  const filename =
    searchParams.get("file");

  if (!filename) {
    return new Response("Missing file", {
      status: 400,
    });
  }

  const songsFolder = path.join(
    process.cwd(),
    "public",
    "songs"
  );

  const filePath = path.join(
    songsFolder,
    filename
  );

  /*
   * Prevent requests from escaping public/songs.
   */
  if (
    path.dirname(filePath) !==
    songsFolder
  ) {
    return new Response("Invalid file", {
      status: 400,
    });
  }

  if (!fs.existsSync(filePath)) {
    return new Response("File not found", {
      status: 404,
    });
  }

  try {
    const metadata =
      await parseFile(filePath);

    const picture =
      metadata.common.picture?.[0];

    if (!picture) {
      return new Response(
        "No artwork found",
        {
          status: 404,
        }
      );
    }

    return new Response(
      Buffer.from(picture.data),
      {
        headers: {
          "Content-Type": picture.format,
          "Cache-Control":
            "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (error) {
  console.warn("Couldn't read artwork:", filename, error);

    return new Response(
      "Couldn't read artwork",
      {
        status: 500,
      }
    );
  }
}