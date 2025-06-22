"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

export default function AirdropPage() {
  const { address, isConnected } = useAccount();

  // Mock eligibility (replace with real contract read later)
  const mockAirdropList = {
    "0x123...": 100,
    "0xabc...": 250,
  };

  const isEligible = isConnected && mockAirdropList["0x123..."]; // Replace with dynamic key check
  const [status, setStatus] = useState("not_claimed"); // not_claimed | pending | claimed

  const handleClaim = () => {
    if (!isEligible || status === "claimed") return;
    setStatus("pending");

    setTimeout(() => {
      setStatus("claimed");
    }, 2000);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">🎁 Airdrop Claim</h1>
        <p className="text-muted-foreground text-sm">
          Check your eligibility and claim your airdropped 2LYP tokens.
        </p>
      </div>

      <Card className="rounded-2xl shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl">Airdrop Eligibility</CardTitle>
          <CardDescription>
            Claim your allocated tokens if you're part of the airdrop list.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Wallet Address:</span>{" "}
            {isConnected ? (
              <code className="bg-muted px-2 py-1 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </code>
            ) : (
              <span className="text-red-500">Not Connected</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Eligibility:</span>
            {isEligible ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                ✅ Eligible
              </Badge>
            ) : (
              <Badge variant="destructive">Not Eligible</Badge>
            )}
          </div>

          {isEligible && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                You're eligible for <strong>{mockAirdropList["0x123..."]} 2LYP</strong>
              </p>

              <Button
                disabled={status === "claimed" || status === "pending"}
                onClick={handleClaim}
                className="w-full"
              >
                {status === "pending" ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Claiming Airdrop...
                  </>
                ) : status === "claimed" ? (
                  "Already Claimed ✅"
                ) : (
                  "Claim Airdrop"
                )}
              </Button>

              {status === "claimed" && (
                <p className="mt-3 text-green-600 text-sm font-medium text-center">
                  ✅ Airdrop claimed successfully!
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <Footer />
    </>
  );
}
