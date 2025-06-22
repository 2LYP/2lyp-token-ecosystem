"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Navbar from "../navbar/page";

export default function TokenActionsPage() {
  const [burnAmount, setBurnAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  return (
    <>
        <Navbar />
      <div className="max-w-4xl mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💧 Faucet</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => alert("Faucet claim simulated")}>Claim Test Tokens</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🎁 Airdrop</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => alert("Airdrop claimed (mock)")}>Claim Airdrop</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔥 Burn Tokens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            placeholder="Amount to burn"
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
          <Button onClick={() => alert(`Burned ${burnAmount} tokens (simulated)`)}>Burn</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🪙 Transfer Tokens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Recipient address"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <Button onClick={() => alert(`Transferred ${transferAmount} tokens to ${transferTo}`)}>Send</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔒 Claim Vested Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => alert("Vesting claim simulated")}>Claim</Button>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
