"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatEther } from "viem";

import {
  useTotalSupply,
  useMaxSupply,
  useFaucetDrip,
  useFaucetCooldown,
  useTokenomicsStatus,
  useTokenName,
  useTokenSymbol,
  useTokenDecimals,
} from "@/hooks/read/useOverviewStats";

export default function TokenSummaryBox() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: tokenName } = useTokenName();
  const { data: tokenSymbol } = useTokenSymbol();
  const { data: decimals } = useTokenDecimals();
  const { data: faucetDrip } = useFaucetDrip();
  const { data: tokenomicsInitialized } = useTokenomicsStatus();

  const totalSupplyFormatted = totalSupply ? parseFloat(formatEther(totalSupply)).toLocaleString() : 'Loading...';
  const maxSupplyFormatted = maxSupply ? parseFloat(formatEther(maxSupply)).toLocaleString() : 'Loading...';
  const faucetDripFormatted = faucetDrip ? parseFloat(formatEther(faucetDrip)).toLocaleString() : 'Loading...';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">2LYP Token Summary</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4 text-sm">
        <div>
          <p className="text-muted-foreground">Token Name</p>
          <p className="font-semibold">{tokenName || '2LYP Token'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Symbol</p>
          <p className="font-semibold">{tokenSymbol || '2LYP'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Type</p>
          <p className="font-semibold">ERC-20</p>
        </div>
        <div>
          <p className="text-muted-foreground">Decimals</p>
          <p className="font-semibold">{decimals !== undefined ? Number(decimals) : 18}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Max Supply Cap</p>
          <p className="font-semibold">{maxSupplyFormatted} 2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Current Supply</p>
          <p className="font-semibold">{totalSupplyFormatted} 2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Faucet Amount</p>
          <p className="font-semibold">{faucetDripFormatted} 2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Deployed On</p>
          <p className="font-semibold">Polygon Amoy Testnet</p>
        </div>
        <div>
          <p className="text-muted-foreground">Features</p>
          <p className="font-semibold">
            Vesting, Airdrop, Faucet{" "}
            <Badge className="ml-1" variant="outline">
              Utility Token
            </Badge>
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Tokenomics</p>
          <p className="font-semibold">
            {tokenomicsInitialized ? 'Active' : 'Pending'}{" "}
            <Badge 
              className="ml-1" 
              variant={tokenomicsInitialized ? "default" : "secondary"}
            >
              {tokenomicsInitialized ? 'Live' : 'Setup'}
            </Badge>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
