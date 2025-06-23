"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
import { useWriteContract, useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

export default function VestingAdmin() {
  const [form, setForm] = useState({
    address: "",
    amount: "",
    cliff: "",
    duration: "",
  });
  const [status, setStatus] = useState("idle");
  const [vestingAddresses, setVestingAddresses] = useState([]);

  const { writeContractAsync } = useWriteContract();

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleAddVesting = async () => {
    const { address, amount, cliff, duration } = form;
    if (!address || !amount || !cliff || !duration) return;

    setStatus("pending");

    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "addVesting",
        args: [
          address,
          parseEther(amount),
          BigInt(cliff),
          BigInt(duration),
        ],
      });

      console.log("⛓️ Vesting TX:", tx);
      setStatus("success");
      setForm({ address: "", amount: "", cliff: "", duration: "" });
    } catch (error) {
      console.error("❌ Vesting Error:", error);
      setStatus("error");
    }
  };

  // 1. Fetch vesting addresses
const { data: addressesData } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: "getAllVestingAddresses",
});

// 2. Update local state once data is ready
useEffect(() => {
  if (addressesData) {
    setVestingAddresses(addressesData);
  }
}, [addressesData]);

// 3. Fetch vestingList only when addresses are ready
const { data: vestingData } = useReadContracts({
  contracts: vestingAddresses.map((address) => ({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "vestingList",
    args: [address],
  })),
  enabled: vestingAddresses.length > 0, // 💡 Only run once we have addresses
  allowFailure: true,
});

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

        <Button
          className="mt-4"
          onClick={handleAddVesting}
          disabled={status === "pending"}
        >
          {status === "pending" ? "Processing..." : "➕ Add Vesting Entry"}
        </Button>

        {status === "success" && (
          <p className="text-green-600 text-sm font-medium mt-2">
            ✅ Vesting entry added successfully.
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm font-medium mt-2">
            ❌ Failed to add vesting. Please check the console.
          </p>
        )}

        <Separator className="my-6" />

        {/* Live Entries */}
        <div className="space-y-2">
  <p className="text-sm text-muted-foreground font-medium">
    📋 Existing Vesting Entries
  </p>

  {vestingAddresses.length === 0 ? (
    <p className="text-sm text-muted-foreground">No vestings yet.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-muted rounded-md">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-2 text-left">Beneficiary</th>
            <th className="p-2 text-right">Amount (2LYP)</th>
            <th className="p-2 text-right">Cliff</th>
            <th className="p-2 text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          {vestingAddresses.map((addr, i) => {
            const entry = vestingData?.[i];
            if (!entry || entry.status !== "success" || !entry.result) return null;

            const v = entry.result;

            return (
              <tr key={i} className="border-t border-muted">
                <td className="p-2 font-mono text-xs">
                  {addr.slice(0, 6)}...{addr.slice(-4)}
                </td>
                <td className="p-2 text-right">{formatEther(v[0])}</td>
                <td className="p-2 text-right">
                  {Math.round(Number(v[2]) / 2592000)} months
                </td>
                <td className="p-2 text-right">
                  {Math.round(Number(v[3]) / 2592000)} months
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>

      </CardContent>
    </Card>
  );
}
