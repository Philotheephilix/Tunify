import fs from "fs";
import path from "path";

const filePath = path.resolve("./data/artists.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { artistId, balance } = body;

    if (!artistId) {
      return new Response(JSON.stringify({ error: "Artist ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const rawData = fs.readFileSync(filePath, "utf8");
    const artists = JSON.parse(rawData);

    const artistIndex = artists.findIndex((a) => a.artistId === artistId);
    if (artistIndex === -1) {
      return new Response(JSON.stringify({ error: "Artist not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    artists[artistIndex].balance = balance;
    fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
