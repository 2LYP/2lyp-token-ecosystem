"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import VestingPieChart from "./components/VestingPieChart";
import Navbar from "../navbar/page";

export default function VestingDashboard() {
  const { address, isConnected } = useAccount();

  // Simulated vesting map
//   const vestingMap = {
//     "0x123...abcd": {
//       total: 10000,
//       released: 4200,
//       role: "Team",
//       start: "2024-01-01",
//       end: "2025-12-31",
//       cliff: "6 months",
//     },
//     "0x456...wxyz": {
//       total: 6000,
//       released: 1000,
//       role: "Advisor",
//       start: "2024-04-01",
//       end: "2025-10-01",
//       cliff: "3 months",
//     },
//   };

//   const mockWallet = "0x123...abcd"; // Replace with `address`
//   const vestingData = vestingMap[mockWallet];
  const [status, setStatus] = useState("idle"); // idle | pending | claimed
  const [vested, setVested] = useState(null);

  useEffect(() => {
  // Simulate wallet check
  const vestingMap = {
    "0x123...abcd": {
      total: 10000,
      released: 4200,
      role: "Team",
      start: "2024-01-01",
      end: "2025-12-31",
      cliff: "6 months",
    },
    "0x456...wxyz": {
      total: 6000,
      released: 1000,
      role: "Advisor",
      start: "2024-04-01",
      end: "2025-10-01",
      cliff: "3 months",
    },
  };

  const wallet = "0x123...abcd";
  const data = vestingMap[wallet];

  if (data) {
    const unreleased = data.total - data.released;
    const percent = (data.released / data.total) * 100;
    setVested({
      ...data,
      unreleased,
      percent,
    });
  }
}, []); // ✅ Empty dependency: runs only once


  const handleRelease = () => {
    if (!vested || vested.unreleased === 0 || status === "claimed") return;
    setStatus("pending");
    setTimeout(() => {
      setVested((prev) => ({
        ...prev,
        released: prev.total,
        unreleased: 0,
        percent: 100,
      }));
      setStatus("claimed");
    }, 2000);
  };

  return (
    <>
    <Navbar />

    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">⏳ Vesting Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor and claim your vested 2LYP tokens over time.
        </p>
      </div>

      <Card className="rounded-2xl shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl">Vesting Summary</CardTitle>
          <CardDescription>
            Real-time vesting status for your wallet.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isConnected ? (
            vested ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Role</p>
                    <Badge variant="secondary">{vested.role}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Total Allocation</p>
                    <p className="font-medium">{vested.total.toLocaleString()} 2LYP</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Released</p>
                    <p className="text-green-600 font-semibold">
                      {vested.released.toLocaleString()} 2LYP
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Unreleased</p>
                    <p className="text-red-500 font-semibold">
                      {vested.unreleased.toLocaleString()} 2LYP
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Vesting Period</p>
                    <p>
                      {vested.start} → {vested.end}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Cliff</p>
                    <p>{vested.cliff}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Vesting Progress
                  </p>
                  <Progress value={vested.percent} className="h-3" />
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    {vested.percent.toFixed(1)}% Unlocked
                  </p>
                  <VestingPieChart released={vested.released} unreleased={vested.unreleased} />

                </div>

                {/* Claim Button */}
                <div className="text-center mt-6">
                  <Button
                    className="w-full sm:w-1/2"
                    disabled={status === "pending" || status === "claimed" || vested.unreleased === 0}
                    onClick={handleRelease}
                  >
                    {status === "pending" ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Releasing...
                      </>
                    ) : status === "claimed" ? (
                      "Fully Released ✅"
                    ) : (
                      "Release Vested Tokens"
                    )}
                  </Button>
                  {status === "claimed" && (
                    <p className="text-green-600 text-sm mt-2">
                      ✅ Tokens successfully released to your wallet!
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                🚫 This wallet is not eligible for vesting. Only team, investors, and advisors can view this dashboard.
              </p>
            )
          ) : (
            <p className="text-sm text-red-500">
              ⚠️ Connect your wallet to view vesting progress.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
