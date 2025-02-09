import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.resolve("./data/artists.json");

export async function POST(req) {
  try {
    const { user } = await req.json();
    
    if (!user || !user.wallet?.address) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    let artists = [];
    
    // Read the existing file
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      artists = JSON.parse(fileData);
    }

    // Check if user already exists
    const existingArtist = artists.find((a) => a.wallet === user.wallet.address);
    if (existingArtist) {
      return NextResponse.json({ message: "User already registered", artistId: existingArtist.artistId });
    }

    // Generate new artist ID
    const newArtistId = `AR${artists.length + 1}`;
    const newArtist = {
      artistId: newArtistId,
      wallet: user.wallet.address,
      email: user.email || null,
      displayName: user.displayName || "Unknown",
      balance:0,
    };

    artists.push(newArtist);

    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(artists, null, 2));

    return NextResponse.json({ message: "Artist registered", artistId: newArtistId });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
