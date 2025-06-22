"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

export default function FaucetPage() {
  const { address, isConnected } = useAccount();

  const [cooldown, setCooldown] = useState(120); // seconds
  const [status, setStatus] = useState("idle"); // idle | pending | success
  const dripAmount = "100 2LYP";

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCooldown = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleClaim = () => {
    if (!isConnected || cooldown > 0 || status === "pending") return;
    setStatus("pending");

    // Simulated claim
    setTimeout(() => {
      setStatus("success");
      setCooldown(300); // simulate backend cooldown update
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold tracking-tight">🚰 2LYP Faucet</h1>
          <p className="text-muted-foreground text-sm">
            Test the 2LYP token with free testnet tokens. All wallets are eligible every 5 minutes.
          </p>
        </div>

        <Card className="rounded-2xl shadow-md border">
          <CardHeader>
            <CardTitle className="text-xl">Faucet Overview</CardTitle>
            <CardDescription>
              Get a one-time drip of test tokens to explore our dApp ecosystem.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">Drip Amount</span>
              <span className="font-medium text-lg">{dripAmount}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">Cooldown</span>
              {cooldown > 0 ? (
                <Badge variant="secondary" className="w-fit text-sm">
                  ⏳ {formatCooldown(cooldown)} remaining
                </Badge>
              ) : (
                <Badge variant="outline" className="w-fit text-green-600 border-green-600 text-sm">
                  ✅ Ready to claim
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-muted-foreground text-sm">Your Wallet</span>
              {isConnected ? (
                <code className="text-sm bg-muted px-3 py-1 rounded-md">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </code>
              ) : (
                <span className="text-sm text-red-500">Not connected</span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={handleClaim}
            disabled={!isConnected || cooldown > 0 || status === "pending"}
            className="text-base px-8 py-6 rounded-xl font-semibold"
          >
            {status === "pending" ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Claiming...
              </>
            ) : cooldown > 0 ? (
              "On Cooldown"
            ) : !isConnected ? (
              "Connect Wallet to Claim"
            ) : (
              "Claim 100 2LYP Tokens"
            )}
          </Button>

          {status === "success" && (
            <p className="mt-3 text-green-600 text-sm font-medium">
              ✅ Faucet claimed successfully! Tokens will appear shortly.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
