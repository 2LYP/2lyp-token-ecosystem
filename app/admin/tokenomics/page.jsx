"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useTokenomicsStatus,
  useInitTokenomics
} from "@/hooks/admin/useTokenomicsControls"; // your Wagmi hooks
import { useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

export default function TokenomicsAdmin() {
  const {
    writeContract,
    isPending,
    isSuccess,
    isError,
    error
  } = useWriteContract();

  const [status, setStatus] = useState("idle"); // idle | pending | success | error

  useEffect(() => {
  if (isPending && status !== "pending") {
    setStatus("pending");
  }

  if (isSuccess && status !== "success") {
    setStatus("success");
    toast.success("🎉 Tokenomics initialized successfully!");
    // Move refetch outside useEffect and do it manually after tx completes
  }

  if (isError && status !== "error") {
    setStatus("error");
    toast.error(`❌ Failed to initialize: ${error?.message}`);
  }
}, [isPending, isSuccess, isError, status]);


  

  const { data: isInitialized, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "tokenomicsInitialized",
    watch: true,
  });

  const handleInit = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "initTokenomics",
        onSuccess() {
          toast.success("🎉 Tokenomics initialized!");
          refetch();
        },
        onError(error) {
          toast.error(`❌ Failed to initialize: ${error.message}`);
        },
      });
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>📈 Tokenomics Controls</CardTitle>
        <CardDescription>
          Initialize tokenomics settings such as total supply, allocation, and vesting config.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Display */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Status:</p>
          <p
            className={`text-base font-semibold ${
              isInitialized ? "text-green-600" : "text-orange-500"
            }`}
          >
            {isInitialized ? "✅ Initialized" : "⚠️ Not Initialized"}
          </p>
        </div>

        {/* Explanation Block */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          This function sets the foundational parameters of the 2LYP token such as:
          <ul className="list-disc list-inside mt-2">
            <li>🔢 Total, max, and initial supply</li>
            <li>📊 Allocations for team, treasury, investors, etc.</li>
            <li>⏳ Vesting structures and cliff definitions</li>
          </ul>
          It must only be called once after deployment.
        </div>

        {/* Button */}
        <Button
          disabled={isPending || isInitialized}
          onClick={handleInit}
        >
          {isPending
            ? "Initializing..."
            : isInitialized
            ? "✅ Already Initialized"
            : "🚀 Initialize Tokenomics"}
        </Button>

        {/* Confirmation Message */}
        {status === "success" && (
          <p className="text-green-600 text-sm font-medium mt-2">
            🎉 Tokenomics successfully initialized.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
