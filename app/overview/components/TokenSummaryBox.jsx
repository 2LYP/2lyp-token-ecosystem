"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  useTotalSupply,
  useMaxSupply,
  useFaucetDrip,
  useFaucetCooldown,
  useTokenomicsStatus,
} from "@/hooks/read/useOverviewStats";

export default function TokenSummaryBox() {
  const { data: totalSupply } = useTotalSupply();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">2LYP Token Summary</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4 text-sm">
        <div>
          <p className="text-muted-foreground">Token Name</p>
          <p className="font-semibold">2LYP Token</p>
        </div>
        <div>
          <p className="text-muted-foreground">Symbol</p>
          <p className="font-semibold">2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Type</p>
          <p className="font-semibold">ERC-20</p>
        </div>
        <div>
          <p className="text-muted-foreground">Decimals</p>
          <p className="font-semibold">18</p>
        </div>
        <div>
          <p className="text-muted-foreground">Total Supply Cap</p>
          <p className="font-semibold">10,000,000</p>
        </div>
        <div>
          <p className="text-muted-foreground">Initial Supply</p>
          <p className="font-semibold">500,000</p>
        </div>
        <div>
          <p className="text-muted-foreground">Burn Model</p>
          <p className="font-semibold">
            1%/quarter + 2% per tx(future){" "}
            <Badge className="ml-1" variant="outline">
              Deflationary
            </Badge>
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Deployed On</p>
          <p className="font-semibold">Polygon Amoy Testnet</p>
        </div>
        <div>
          <p className="text-muted-foreground">Next Burn</p>
          <p className="font-semibold">in 12 days</p>
        </div>
      </CardContent>
    </Card>
  );
}
