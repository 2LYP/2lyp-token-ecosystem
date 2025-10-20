"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Upload,
  SlidersHorizontal,
  BadgePlus,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const OWNER_ADDRESS = "0xYourAdminAddress"; // Replace with actual owner

export default function AdminHomePage() {
  const { address, isConnected } = useAccount();
  const { isAdmin, isLoading } = useIsAdmin();

  // useEffect(() => {
  //   if (isConnected && address?.toLowerCase() === OWNER_ADDRESS.toLowerCase()) {
  //     setIsAdmin(true);
  //   }
  // }, [address, isConnected]);

  if (!isConnected) {
    return <p className="text-center py-10 text-red-500">⚠️ Please connect your wallet.</p>;
  }

  if (!isAdmin) {
    return <p className="text-center py-10 text-red-500">🚫 Access Denied. Only contract owner can view this panel.</p>;
  }


  return (
    <>
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">🛠 Welcome to the 2LYP Admin Panel</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage token lifecycle, airdrops, vesting, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeatureCard
          icon={<Settings className="text-emerald-600" size={20} />}
          title="Tokenomics"
          description="Initialize and manage token lifecycle settings."
          href="/admin/tokenomics"
        />
        <FeatureCard
          icon={<Upload className="text-indigo-600" size={20} />}
          title="Airdrop"
          description="Upload wallets and assign token airdrops."
          href="/admin/airdrop"
        />
        <FeatureCard
          icon={<SlidersHorizontal className="text-purple-600" size={20} />}
          title="Faucet"
          description="Control faucet amount and cooldown settings."
          href="/admin/faucet"
        />
        <FeatureCard
          icon={<BadgePlus className="text-yellow-600" size={20} />}
          title="Vesting"
          description="Add vesting entries and manage allocations."
          href="/admin/vesting"
        />
        <FeatureCard
          icon={<AlertTriangle className="text-red-500" size={20} />}
          title="Rescue"
          description="Recover mis-sent ERC20 tokens to the contract."
          href="/admin/rescue"
        />
      </div>
    </div>
    </>
  );
}

function FeatureCard({ icon, title, description, href }) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon} {title}
          </CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button className="mt-2 w-full">Manage</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
