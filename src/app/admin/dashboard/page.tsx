"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePrivy } from "@privy-io/react-auth";
// Mock data for income
const incomeData = [
  { id: 1, date: "2023-05-01", description: "Project A", amount: 5000 },
  { id: 2, date: "2023-05-15", description: "Consultation", amount: 1500 },
  { id: 3, date: "2023-05-30", description: "Workshop", amount: 3000 },
]

export default function Dashboard() {
  const { logout } = usePrivy();
  const [balance, setBalance] = useState(9500)
  interface Song {
    id: number;
    title: string;
    thumbnail: string;
    artist: string;
    duration: string;
    releaseDate: string;
  }
  
  const [songs, setSongs] = useState<Song[]>([])
  const [newSong, setNewSong] = useState({
    title: "",
    thumbnail: "",
    artist: "",
    duration: "",
    releaseDate: ""
  })
  const router = useRouter()

  const handleWithdraw = () => {
    if (balance > 0) {
      setBalance(0)
      alert(`Withdrawn $${balance.toFixed(2)}. New balance: $0.00`)
    } else {
      alert("No funds available to withdraw.")
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  const handleAddSong = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (newSong.title && newSong.thumbnail) {
      setSongs([...songs, { ...newSong, id: Date.now() }])
      setNewSong({
        title: "",
        thumbnail: "",
        artist: "",
        duration: "",
        releaseDate: ""
      })
    }
  }

  return (
    <div className="min-h-screen p-8 bg-black">
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Admin Dashboard</CardTitle>
            <CardDescription className="text-gray-400">Manage your income and songs</CardDescription>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-gray-300 border-gray-700 hover:bg-gray-800">
            Logout
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Current Balance</h2>
            <p className="text-2xl font-bold text-green-400">${balance.toFixed(2)}</p>
          </div>
          
          {/* Income Table */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Income History</h2>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Description</TableHead>
                  <TableHead className="text-right text-gray-400">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeData.map((income) => (
                  <TableRow key={income.id} className="border-gray-800">
                    <TableCell className="text-gray-300">{income.date}</TableCell>
                    <TableCell className="text-gray-300">{income.description}</TableCell>
                    <TableCell className="text-right text-gray-300">${income.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Add Song Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Add New Song</h2>
            <form onSubmit={handleAddSong} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={newSong.title}
                    onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-gray-300"
                    placeholder="Enter song title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-gray-300">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={newSong.thumbnail}
                    onChange={(e) => setNewSong({...newSong, thumbnail: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-gray-300"
                    placeholder="Enter thumbnail URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-gray-300">Artist</Label>
                  <Input
                    id="artist"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-gray-300"
                    placeholder="Enter artist name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">Duration</Label>
                  <Input
                    id="duration"
                    value={newSong.duration}
                    onChange={(e) => setNewSong({...newSong, duration: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-gray-300"
                    placeholder="Enter duration (e.g., 3:45)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="releaseDate" className="text-gray-300">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={newSong.releaseDate}
                    onChange={(e) => setNewSong({...newSong, releaseDate: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-gray-300"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Add Song
              </Button>
            </form>
          </div>

          {/* Songs Table */}
          {songs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Songs Library</h2>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Thumbnail</TableHead>
                    <TableHead className="text-gray-400">Title</TableHead>
                    <TableHead className="text-gray-400">Artist</TableHead>
                    <TableHead className="text-gray-400">Duration</TableHead>
                    <TableHead className="text-gray-400">Release Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {songs.map((song) => (
                    <TableRow key={song.id} className="border-gray-800">
                      <TableCell className="text-gray-300">
                        <img src={song.thumbnail} alt={song.title} className="w-12 h-12 object-cover rounded" />
                      </TableCell>
                      <TableCell className="text-gray-300">{song.title}</TableCell>
                      <TableCell className="text-gray-300">{song.artist}</TableCell>
                      <TableCell className="text-gray-300">{song.duration}</TableCell>
                      <TableCell className="text-gray-300">{song.releaseDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleWithdraw} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Withdraw All Funds
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}