import fs from "fs";
import path from "path";

const filePath = path.resolve("./data/artists.json");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { artistId, balance } = req.body;
    if (!artistId) return res.status(400).json({ error: "Artist ID is required" });

    const rawData = fs.readFileSync(filePath, "utf8");
    const artists = JSON.parse(rawData);

    const artistIndex = artists.findIndex((a) => a.artistId === artistId);
    if (artistIndex === -1) return res.status(404).json({ error: "Artist not found" });

    artists[artistIndex].balance = balance;

    fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
