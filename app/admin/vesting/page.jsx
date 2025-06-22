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
import { Separator } from "@/components/ui/separator"; // fixed source
import { useState } from "react";

export default function VestingAdmin() {
  const [form, setForm] = useState({
    address: "",
    amount: "",
    cliff: "",
    duration: "",
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleAddVesting = () => {
    // Placeholder for future contract call
    alert("✅ Vesting entry submitted (mock).");
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>📤 Vesting Manager</CardTitle>
        <CardDescription>
          Allocate tokens to contributors with a defined release schedule.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Enter details to add a vesting entry. Vesting helps you release tokens gradually over time, usually used for team, advisors, and investors.
          </p>
        </div>

        {/* Form */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Beneficiary Address</label>
            <Input
              placeholder="0xABC...123"
              value={form.address}
              onChange={handleChange("address")}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Total Amount (2LYP)</label>
            <Input
              placeholder="e.g. 10000"
              value={form.amount}
              onChange={handleChange("amount")}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Cliff (in seconds)</label>
            <Input
              placeholder="e.g. 15552000 (6 months)"
              value={form.cliff}
              onChange={handleChange("cliff")}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Duration (in seconds)</label>
            <Input
              placeholder="e.g. 31536000 (1 year)"
              value={form.duration}
              onChange={handleChange("duration")}
            />
          </div>
        </div>

        <Button className="mt-4" onClick={handleAddVesting}>
          ➕ Add Vesting Entry
        </Button>

        <Separator className="my-6" />

        {/* Existing Entries */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">📋 Existing Vesting Entries</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>0x123...abcd — 10,000 2LYP — Cliff: 6m — Duration: 1y</li>
            <li>0x456...efgh — 5,000 2LYP — Cliff: 3m — Duration: 10m</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
