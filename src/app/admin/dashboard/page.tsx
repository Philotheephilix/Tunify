"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";

// Define TypeScript interface for Artist
interface Artist {
  balance: string;
  artistId: string;
  wallet: string;
  email?: string;
  displayName: string;
}

export default function ArtistProfile() {
  const { user, authenticated, ready ,logout} = usePrivy();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<boolean>(false);

  useEffect(() => {
    async function fetchArtist() {
      if (!authenticated || !user?.wallet?.address) return;

      try {
        const res = await fetch("/api/getArtist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: user.wallet.address }),
        });

        if (!res.ok) throw new Error("Failed to fetch artist data");

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setArtist(data.artist);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (ready) fetchArtist();
  }, [authenticated, ready, user]);

  const handleWithdraw = async () => {
    if (!artist || parseFloat(artist.balance) === 0 || withdrawing) return;

    setWithdrawing(true);
    try {
      // Call empty withdraw API
      await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: artist.wallet  }),
      });

      // Update balance to 0 in UI (assuming withdrawal clears balance)
      setArtist((prev) => prev ? { ...prev, balance: "0" } : prev);
    } catch (err) {
      console.error("Withdraw failed:", err);
    } finally {
      setWithdrawing(false);
    }
  };

  if (!authenticated) {
    return <p className="text-center text-gray-400">Please log in to view your profile.</p>;
  }

  if (loading) {
    return <p className="text-center text-gray-400">Loading artist details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  function handleLogout(): void {
    logout();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-500">Artist Profile</h1>
      {artist ? (
        <Card className="p-6 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg text-center max-w-lg">
          <p className="text-gray-400 text-lg mb-2">
            <span className="font-semibold text-white">ID:</span> {artist.artistId}
          </p>
          <p className="text-gray-400 text-lg mb-2">
            <span className="font-semibold text-white">Wallet:</span> {artist.wallet}
          </p>
          <p className="text-gray-400 text-lg mb-2">
            <span className="font-semibold text-white">Balance:</span> {artist.balance}
          </p>
          {artist.email && (
            <p className="text-gray-400 text-lg mb-4">
              <span className="font-semibold text-white">Email:</span> {artist.email}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg" onClick={handleLogout}>
              Logout
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={parseFloat(artist.balance) === 0 || withdrawing}
              className={`w-full sm:w-auto font-semibold px-6 py-2 rounded-lg 
                ${parseFloat(artist.balance) === 0 || withdrawing 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-500 text-white"}`}
            >
              {withdrawing ? "Processing..." : "Withdraw Balance"}
            </Button>
          </div>
        </Card>
      ) : (
        <p className="text-gray-400">Artist not found.</p>
      )}
    </div>
  );
}
