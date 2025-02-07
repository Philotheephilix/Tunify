"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for income
const incomeData = [
  { id: 1, date: "2023-05-01", description: "Project A", amount: 5000 },
  { id: 2, date: "2023-05-15", description: "Consultation", amount: 1500 },
  { id: 3, date: "2023-05-30", description: "Workshop", amount: 3000 },
]

export default function Dashboard() {
  const [balance, setBalance] = useState(9500)
  const router = useRouter()

  const handleWithdraw = () => {
    if (balance > 0) {
      setBalance(0)
      alert(`Withdrawn $${balance.toFixed(2)}. New balance: $0.00`)
    } else {
      alert("No funds available to withdraw.")
    }
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen p-8 bg-black">
      <Card className="w-full max-w-4xl mx-auto bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Admin Dashboard</CardTitle>
            <CardDescription className="text-gray-400">Manage your income and withdrawals</CardDescription>
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

