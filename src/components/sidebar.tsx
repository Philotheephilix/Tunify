'use client';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSendTransaction } from '@privy-io/react-auth';
import type { UnsignedTransactionRequest, SendTransactionModalUIOptions } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Home, Library, ListMusic, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import SearchWindow from '@/components/search-window';
import { Track } from '@/hooks/use-audio-player';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export function Sidebar() {
  const { sendTransaction } = useSendTransaction();
  const [toAddress, setToAddress] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('0.002');
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Fetch the master wallet address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getMasterWallet');
        const data = await response.json();
        if (data.address) {
          setToAddress(data.address);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
    fetchAddress();
  }, []);

  // Add user to the JSON file on login
  useEffect(() => {
    if (ready && authenticated && user) {
      const userID = user?.id;
      const walletAddress = user?.wallet?.address;
      if (userID && walletAddress) {
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userID,
            walletAddress,
            balance: '0',
            minuteslistened: '0',
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to add user');
            }
            return response.json();
          })
          .then((data) => console.log('User added:', data))
          .catch((error) => console.error('Error adding user:', error));
      }
    }
  }, [ready, authenticated, user]);

  const handleSendTransaction = async () => {
    if (!toAddress || !amount) {
      alert('Please enter a valid address and amount.');
      return;
    }

    const valueInWei = BigInt(parseFloat(amount) * 10 ** 18).toString();
    const unsignedTx: UnsignedTransactionRequest = {
      to: toAddress,
      chainId: 84532, // Mainnet
      value: `0x${parseInt(valueInWei).toString(16)}`,
    };

    const uiConfig: SendTransactionModalUIOptions = {
      description: `You are about to send ${amount} ETH to ${toAddress}.`,
      buttonText: 'Confirm Transaction',
    };

    try {
      const { hash } = await sendTransaction(unsignedTx, { uiOptions: uiConfig });
      alert(`Transaction sent! Hash: ${hash}`);

      const userID = user?.id;
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID: userID,
          addBalance: amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user balance');
      }

      const data = await response.json();
      alert(`Balance updated: ${data.message}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  const addPlaylist = () => {
    const existingList = JSON.parse(localStorage.getItem('playlistList') || '[]');
    existingList.push(playlistName);
    localStorage.setItem('playlistList', JSON.stringify(existingList));
    localStorage.setItem(playlistName, JSON.stringify(selectedTracks));
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
                  <Input type="text" placeholder="Enter Playlist Name" value={playlistName} onChange={(e) => { setPlaylistName(e.target.value) }} />
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
      <div className="flex flex-col items-center gap-4 p-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Add Minutes</DialogTitle>
              <DialogDescription>5 min ~ 0.0005 USD ~  0.000000188 ETH</DialogDescription>
              <DialogDescription>Deposit a minimum of 0.002 ETH</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-4 gap-4">
              <Button onClick={handleSendTransaction} variant="default" className="rounded-lg">
                Transfer
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {ready && authenticated ? (
        <>
          <Button onClick={() => setIsOpen(true)} variant="ghost" className="rounded-lg">
            Transfer
          </Button>

          <Button onClick={logout} variant="destructive" className="rounded-lg">
            Log Out
          </Button>
        </>
      ) : (
        <Button onClick={login} variant="default" className="rounded-lg">Log In</Button>
      )}
    </div>
  );
}
