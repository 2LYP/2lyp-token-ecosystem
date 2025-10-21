"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import Footer from "@/app/footer/page";

export default function AirdropAdmin() {
  const [entries, setEntries] = useState([{ address: "", amount: "" }]);

  const handleChange = (index, field) => (e) => {
    const updated = [...entries];
    updated[index][field] = e.target.value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { address: "", amount: "" }]);
  };

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const validEntries = entries.filter(
      (entry) => entry.address && entry.amount && !isNaN(entry.amount)
    );

    const addresses = validEntries.map((e) => e.address);
    const amounts = validEntries.map((e) => parseInt(e.amount));

    // Call `setAirdropList(addresses, amounts)` here via wagmi
    alert(`Mock call: setAirdropList(\n${JSON.stringify(addresses)},\n${JSON.stringify(amounts)})`);
  };

  return (
    <>
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Airdrop Manager</CardTitle>
        <CardDescription>
          Manually input wallet addresses and token amounts to register an airdrop list.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-muted-foreground text-sm">
          This will prepare the airdrop list to call:
          <code className="ml-1 bg-muted px-1 py-0.5 rounded text-xs">setAirdropList(address[], uint256[])</code>
        </p>

        {/* Address + Amount Input Blocks */}
        <div className="space-y-4">
          {entries.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <Input
                placeholder="Wallet Address"
                value={entry.address}
                onChange={handleChange(idx, "address")}
              />
              <Input
                placeholder="Amount"
                value={entry.amount}
                onChange={handleChange(idx, "amount")}
              />
              <Button variant="destructive" onClick={() => removeEntry(idx)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={addEntry}>
            ➕ Add Another
          </Button>
          <Button onClick={handleSubmit}>Set Airdrop List</Button>
        </div>

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Current Input:</p>
          <ul className="list-disc list-inside">
            {entries.map((e, i) => (
              <li key={i}>
                {e.address || "—"} — {e.amount || "—"} 2LYP
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>

    </>
  );
}
