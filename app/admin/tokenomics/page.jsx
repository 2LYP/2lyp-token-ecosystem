"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TokenomicsAdmin() {
  // Tokenomics state: you can replace this with on-chain read in future
  const [isInitialized, setIsInitialized] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | pending | success

  const handleInit = () => {
    if (isInitialized) return;

    setStatus("pending");

    // Placeholder logic (simulate contract call delay)
    setTimeout(() => {
      setIsInitialized(true);
      setStatus("success");
    }, 2000);
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
          <p className={`text-base font-semibold ${isInitialized ? "text-green-600" : "text-orange-500"}`}>
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
          disabled={status === "pending" || isInitialized}
          onClick={handleInit}
        >
          {status === "pending"
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
