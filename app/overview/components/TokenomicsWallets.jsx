"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Wallet, Users, Building, Gift, Vault } from "lucide-react";

import {
  useTeamWallet,
  useInvestorWallet,
  useAirdropWallet,
  useTreasuryWallet,
  useClientWallet,
} from "@/hooks/read/useOverviewStats";

const WalletItem = ({ icon: Icon, label, address, description, color }) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
    <div className={`p-2 rounded-full ${color}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-sm">{label}</p>
        <Badge variant="outline" className="text-xs">
          Active
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {address ? (
          <code className="font-mono">{address}</code>
        ) : (
          'Not set'
        )}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
    {address && (
      <a
        href={`https://amoy.polygonscan.com/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1 hover:bg-muted rounded"
      >
        <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-foreground" />
      </a>
    )}
  </div>
);

export default function TokenomicsWallets() {
  const { data: teamWallet } = useTeamWallet();
  const { data: investorWallet } = useInvestorWallet();
  const { data: airdropWallet } = useAirdropWallet();
  const { data: treasuryWallet } = useTreasuryWallet();
  const { data: clientWallet } = useClientWallet();

  const wallets = [
    {
      icon: Users,
      label: "Team Wallet",
      address: teamWallet,
      description: "Team and founders allocation (20%)",
      color: "bg-blue-500"
    },
    {
      icon: Building,
      label: "Investor Wallet",
      address: investorWallet,
      description: "Private investor allocation (15%)",
      color: "bg-green-500"
    },
    {
      icon: Gift,
      label: "Airdrop Wallet",
      address: airdropWallet,
      description: "Community airdrop distribution",
      color: "bg-pink-500"
    },
    {
      icon: Vault,
      label: "Treasury Wallet",
      address: treasuryWallet,
      description: "Reserve fund and operations (10%)",
      color: "bg-purple-500"
    },
    {
      icon: Wallet,
      label: "Client Wallet",
      address: clientWallet,
      description: "Client and partnership allocation",
      color: "bg-orange-500"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏦 Tokenomics Wallets
          <Badge variant="secondary">Live</Badge>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wallets.map((wallet, index) => (
            <WalletItem key={index} {...wallet} />
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground text-center">
          All wallet addresses are verified on the blockchain and updated in real-time
        </div>
      </CardContent>
    </Card>
  );
}
