"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAirdropInfo } from '@/hooks/read/useOverviewStats';
import { useWriteContract } from 'wagmi';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Navbar from "../../components/navbar/page";

export default function AirdropPage() {
  const { address, isConnected } = useAccount();
  // @dev Dynamic eligibility and amount
  const { data: airdropInfo, isLoading: isAirdropLoading, error: airdropError } = useAirdropInfo(isConnected ? address : undefined);
  
  // @dev airdropInfo: { amount: BigInt, claimed: boolean } or undefined/null
  const isEligible = isConnected && airdropInfo && airdropInfo[0] && airdropInfo[0] > 0n;
  const alreadyClaimed = airdropInfo && airdropInfo[1];
  const [status, setStatus] = useState("not_claimed"); // not_claimed | pending | claimed
  const [amountToClaim, setAmountToClaim] = useState(0n);
  useEffect(() => {
    if (!isAirdropLoading) {
      setAmountToClaim(airdropInfo[0]);
    }
  }, [isAirdropLoading, airdropInfo]);

  // Contract write for claimAirDrop
  const { writeContract } = useWriteContract();
  const [txError, setTxError] = useState(null);
  const handleClaim = async () => {
    if (!isEligible || alreadyClaimed || status === "claimed") return;
    setStatus("pending");
    setTxError(null);
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'claimAirDrop',
        args: [],
      });
      setStatus("claimed");
    } catch (err) {
      setStatus("not_claimed");
      setTxError(err?.message || 'Transaction failed');
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div className="space-y-1 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Airdrop Claim</h1>
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
            {isAirdropLoading ? (
              <Badge variant="outline">Checking...</Badge>
            ) : isEligible ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Eligible
              </Badge>
            ) : (
              <Badge variant="destructive">Not Eligible</Badge>
            )}
          </div>

          {isEligible && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                You're eligible for <strong>{amountToClaim ? (Number(amountToClaim)).toLocaleString() : 0} 2LYP</strong>
              </p>

              <Button
                disabled={alreadyClaimed || status === "claimed" || status === "pending"}
                onClick={handleClaim}
                className="w-full"
              >
                {alreadyClaimed ? (
                  "Already Claimed"
                ) : status === "pending" ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Claiming Airdrop...
                  </>
                ) : status === "claimed" ? (
                  "Airdrop Claimed"
                ) : (
                  "Claim Airdrop"
                )}
              </Button>

              {(alreadyClaimed || status === "claimed") && (
                <p className="mt-3 text-green-600 text-sm font-medium text-center">
                  Airdrop claimed successfully!
                </p>
              )}
              {txError && (
                <p className="mt-3 text-red-600 text-sm font-medium text-center">
                  {txError}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
