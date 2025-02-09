export async function POST(req) {
    try {
      const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
      const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
      const MASTER_WALLET_ADDRESS = process.env.MASTER_WALLET_ADDRESS;
  
      if (!PRIVY_APP_ID || !PRIVY_APP_SECRET || !MASTER_WALLET_ADDRESS) {
        return new Response(JSON.stringify({ error: "Missing Privy credentials" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const { wallet } = await req.json();
      if (!wallet) {
        return new Response(JSON.stringify({ error: "Wallet address is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Fetch artist balance
      const artistRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/getArtist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
  
      if (!artistRes.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch artist data" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const artistData = await artistRes.json();
      if (artistData.error || !artistData.artist) {
        return new Response(JSON.stringify({ error: artistData.error || "Artist not found" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const balance = parseFloat(artistData.artist.balance);
      const artistId = artistData.artist.artistId;
  
      if (balance === 0) {
        return new Response(JSON.stringify({ error: "Insufficient balance" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Send transaction
      console.log(wallet,balance,MASTER_WALLET_ADDRESS,PRIVY_APP_ID,PRIVY_APP_SECRET)
      const txResponse = await fetch(`https://api.privy.io/v1/wallets/${MASTER_WALLET_ADDRESS}/rpc`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString("base64")}`,
          "Content-Type": "application/json",
          "privy-app-id": PRIVY_APP_ID,
        },
        body: JSON.stringify({
          method: "eth_sendTransaction",
          caip2: "eip155:84532",
          params: {
            transaction: {
              to: wallet, // Send to artist's wallet
              value: balance,
            },
          },
        }),
      });
  
      if (!txResponse.ok) {
        const errorData = await txResponse.json();
        console.log(errorData)
        return new Response(JSON.stringify({ error: errorData.message || "Transaction failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const txResult = await txResponse.json();
  
      // Update artist balance to 0
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/updateBalance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId, balance: "0" }),
      });
  
      return new Response(JSON.stringify({ success: true, transaction: txResult }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
        console.log(error)
      return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  