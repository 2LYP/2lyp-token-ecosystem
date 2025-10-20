"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, User, Calendar, TrendingUp } from "lucide-react";
import { formatEther } from "viem";

import {
  useVestingAddresses,
} from "@/hooks/read/useOverviewStats";
import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

const VestingItem = ({ address }) => {
  const { data: vestingData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "vestingList",
    args: [address],
    watch: true,
  });

  const { data: vestedAmount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getVestedAmount",
    args: [address],
    watch: true,
  });

  if (!vestingData) return null;

  const [totalAllocated, startTime, cliff, duration, released] = vestingData;
  const [vested, unreleased] = vestedAmount || [0n, 0n];
  
  const totalAllocatedFormatted = parseFloat(formatEther(totalAllocated));
  const releasedFormatted = parseFloat(formatEther(released));
  const vestedFormatted = parseFloat(formatEther(vested));
  const unreleasedFormatted = parseFloat(formatEther(unreleased));
  
  const progress = totalAllocatedFormatted > 0 ? (vestedFormatted / totalAllocatedFormatted) * 100 : 0;
  const cliffDate = new Date(Number(cliff) * 1000);
  const endDate = new Date((Number(startTime) + Number(duration)) * 1000);
  const isCliffPassed = Date.now() > Number(cliff) * 1000;
  const isCompleted = progress >= 99.9;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <code className="text-sm font-mono">{address.slice(0, 6)}...{address.slice(-4)}</code>
        </div>
        <Badge variant={isCompleted ? "default" : isCliffPassed ? "secondary" : "outline"}>
          {isCompleted ? "Completed" : isCliffPassed ? "Active" : "Cliff Period"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Total Allocated</p>
          <p className="font-semibold">{totalAllocatedFormatted.toLocaleString()} 2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Already Released</p>
          <p className="font-semibold">{releasedFormatted.toLocaleString()} 2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Vested Amount</p>
          <p className="font-semibold text-green-600">{vestedFormatted.toLocaleString()} 2LYP</p>
        </div>
        <div>
          <p className="text-muted-foreground">Unreleased</p>
          <p className="font-semibold text-blue-600">{unreleasedFormatted.toLocaleString()} 2LYP</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Vesting Progress</span>
          <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Cliff: {cliffDate.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>End: {endDate.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function VestingOverview() {
  const { data: vestingAddresses } = useVestingAddresses();
  const [totalVested, setTotalVested] = useState(0);
  const [activeVestings, setActiveVestings] = useState(0);

  useEffect(() => {
    if (vestingAddresses) {
      setActiveVestings(vestingAddresses.length);
      // You could calculate total vested amount here if needed
    }
  }, [vestingAddresses]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Vesting Overview
            <Badge variant="secondary">Real-time</Badge>
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium">{activeVestings} Active</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!vestingAddresses || vestingAddresses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active vesting schedules found</p>
            <p className="text-sm">Vesting schedules will appear here once created</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {vestingAddresses.map((address, index) => (
                <VestingItem key={index} address={address} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
