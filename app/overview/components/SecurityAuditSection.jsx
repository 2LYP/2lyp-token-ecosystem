'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FileCheck, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";

export default function SecurityAuditSection() {
  return (
    <Card className="w-full border-2 border-green-600 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-green-600" />
          Security & Audit
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 text-sm py-4">

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Contract Address</p>
            <p className="font-mono text-xs truncate">0x699D113717e562F35BC5949693a7c79745Aa60b2</p>
          </div>
          <div>
            <p className="text-muted-foreground">Compiler Version</p>
            <Badge variant="outline" className="bg-gray-100 text-black">Solidity 0.8.20</Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Audit Status</p>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">🕵️ Scheduled - Nov 2025</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Contract Verification</p>
            <Badge className="bg-green-100 text-green-800">✅ Verified on Polygonscan</Badge>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground">Security Practices</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1">
            <li>✅ Custom Errors for Gas Optimization</li>
            <li>✅ Role-Restricted Minting (OnlyOwner)</li>
            <li>✅ SafeERC20 Transfers (Rescue Handling)</li>
            <li>✅ Revert on Re-initialization & Invalid Vesting</li>
          </ul>
        </div>

        <div>
          <p className="text-muted-foreground">Bug Bounty</p>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">Coming Q1 2026(tentative)</Badge>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-muted-foreground text-xs flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            View detailed policy
          </div>
          <Link href="https://github.com/2LYP/2LYP-tokenomics/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <GitBranch className="w-4 h-4" />
              SECURITY.md
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}
