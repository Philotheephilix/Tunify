import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.resolve("./data/artists.json");

export async function POST(req) {
  try {
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    // Read the existing file
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No artists data found" }, { status: 404 });
    }

    const data = fs.readFileSync(filePath, "utf-8");
    const artists = JSON.parse(data);

    // Find the artist by wallet address
    const artist = artists.find(a => a.wallet === wallet);

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    return NextResponse.json({ artist });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch artist data" }, { status: 500 });
  }
}
