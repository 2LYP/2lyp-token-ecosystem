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
import { useState, useEffect } from "react";

export default function FaucetAdmin() {
  // Simulated current values — replace these with useContractRead later
  const [currentDrip, setCurrentDrip] = useState(100);
  const [currentCooldown, setCurrentCooldown] = useState(3600);

  const [dripAmount, setDripAmount] = useState("");
  const [cooldown, setCooldown] = useState("");
  const [status, setStatus] = useState("idle"); // idle | updating | updated

  const handleUpdate = () => {
    if (!dripAmount || !cooldown) return;

    setStatus("updating");

    // Simulate on-chain write + UI update
    setTimeout(() => {
      setCurrentDrip(Number(dripAmount));
      setCurrentCooldown(Number(cooldown));
      setStatus("updated");
      setDripAmount("");
      setCooldown("");
    }, 2000);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>🧪 Faucet Controls</CardTitle>
        <CardDescription>
          View and update the faucet’s drip rate and cooldown settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Settings */}
        <div className="border p-4 rounded-md bg-muted/40 text-sm">
          <p className="mb-1">🧾 <strong>Current Faucet Settings:</strong></p>
          <ul className="ml-4 list-disc list-inside">
            <li><strong>Drip Amount:</strong> {currentDrip} 2LYP</li>
            <li><strong>Cooldown:</strong> {currentCooldown} seconds</li>
          </ul>
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>Configure how many tokens users can claim and how often:</p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>Drip Amount</strong>: How many tokens per claim</li>
            <li><strong>Cooldown</strong>: How long users must wait before next claim</li>
          </ul>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">New Drip Amount</label>
            <Input
              type="number"
              placeholder="e.g. 100"
              value={dripAmount}
              onChange={(e) => setDripAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">New Cooldown (in seconds)</label>
            <Input
              type="number"
              placeholder="e.g. 3600"
              value={cooldown}
              onChange={(e) => setCooldown(e.target.value)}
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={status === "updating"}
          >
            {status === "updating" ? "Updating..." : "🔄 Update Faucet Settings"}
          </Button>

          {status === "updated" && (
            <p className="text-green-600 text-sm font-medium mt-2">
              ✅ Faucet settings updated successfully.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
