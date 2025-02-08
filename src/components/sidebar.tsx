'use client'
import { Button } from "@/components/ui/button"
import { Home, Library, ListMusic, Plus, Search } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import SearchWindow from "@/components/search-window"
import { useState } from "react"
import { Track } from "@/hooks/use-audio-player"
import { usePrivy } from "@privy-io/react-auth";
import { useSendTransaction } from '@privy-io/react-auth';
import type { UnsignedTransactionRequest, SendTransactionModalUIOptions } from '@privy-io/react-auth';

export function Sidebar() {
  const { sendTransaction } = useSendTransaction();
  const [toAddress, setToAddress] = useState<string>('0x7FA08A32EfFD1ac1217C8cEBe2fA3e6f395c3FC2');
  const [amount, setAmount] = useState<string>('0.0002');
  const [playlistName,setPlaylistName]=useState("");
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])
  function addPlaylist(): void {
    const existingList = JSON.parse(localStorage.getItem('playlistList') || '[]');
    existingList.push(playlistName);
    localStorage.setItem('playlistList', JSON.stringify(existingList));
    localStorage.setItem(playlistName,JSON.stringify(selectedTracks))
  }
  const { ready, authenticated, user, login, logout } = usePrivy();
  if (!ready) {
    return null;
  }
  const handleSendTransaction = async () => {
    if (!toAddress || !amount) {
      alert('Please enter a valid address and amount.');
      return;
    }

    // Convert the amount to wei (1 ETH = 10^18 wei)
    const valueInWei = BigInt(parseFloat(amount) * 10 ** 18).toString();

    const unsignedTx: UnsignedTransactionRequest = {
      to: toAddress,
      chainId: 84532, // Mainnet
      value: `0x${parseInt(valueInWei).toString(16)}`, // Convert to hexadecimal
    };

    const uiConfig: SendTransactionModalUIOptions = {
      description: `You are about to send ${amount} ETH to ${toAddress}.`,
      buttonText: 'Confirm Transaction',
    };

    try {
      const { hash } = await sendTransaction(unsignedTx, { uiOptions: uiConfig });
      alert(`Transaction sent! Hash: ${hash}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="w-64 bg-card border-r flex flex-col h-screen p-4">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Tunify</h1>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/library">
                <Library className="mr-2 h-4 w-4" />
                Your Library
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <span>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Playlist
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create New Playlist</AlertDialogTitle>
                      <Input type="text" placeholder="Enter Playlist Name" value={playlistName} onChange={(e)=>{setPlaylistName(e.target.value)}} />
                      <SearchWindow
                        checked={true}
                        onSelectionChange={(selectedTracks) => setSelectedTracks(selectedTracks)}
                      />
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={addPlaylist}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/myplaylists">
                <ListMusic className="mr-2 h-4 w-4" />
                My Playlists
              </Link>
            </Button>
          </div>
        </div>

      </div>
      {ready && authenticated ? (
        <>
        <Button onClick={handleSendTransaction}
        variant="ghost" className="rounded-lg">
          Transfer
        </Button><Button onClick={logout} variant="destructive" className="rounded-lg">
            Log Out
        </Button>
        </>
        ) : (
          <Button onClick={login} variant="default"  className="rounded-lg" >Log In</Button>
        )}
    </div>
  )
}

