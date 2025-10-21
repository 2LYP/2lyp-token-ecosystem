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
import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

export default function RescueAdmin() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("idle"); // idle | rescuing | success | error

  const { writeContractAsync } = useWriteContract();

  const handleRescue = async () => {
    if (!tokenAddress || !amount || !recipient) return;

    setStatus("rescuing");

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "rescueERC20",
        args: [tokenAddress, parseEther(amount), recipient],
      });

      setStatus("success");
      setTokenAddress("");
      setAmount("");
      setRecipient("");
    } catch (err) {
      console.error("Rescue Error:", err);
      setStatus("error");
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>🔐 Rescue Feature</CardTitle>
        <CardDescription>
          Recover any ERC-20 tokens accidentally sent to the contract address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground leading-relaxed">
          Use this feature if tokens are mistakenly sent to the contract.
          The rescued tokens will be transferred to the recipient address.
          <div className="mt-2">
            Function:
            <code className="bg-muted px-1 py-0.5 rounded text-xs ml-1">
              rescueERC20(address token, uint256 amount, address to)
            </code>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Token Address</label>
            <Input
              placeholder="0x... ERC-20 Token"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="e.g. 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Recipient Address</label>
            <Input
              placeholder="0x... recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <Button onClick={handleRescue} disabled={status === "rescuing"}>
            {status === "rescuing" ? "Rescuing..." : "Rescue Tokens"}
          </Button>

          {status === "success" && (
            <p className="text-green-600 text-sm font-medium mt-2">
              Rescue transaction submitted successfully.
            </p>
          )}

          {status === "error" && (
            <p className="text-red-600 text-sm font-medium mt-2">
              Failed to rescue tokens. See console for details.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
