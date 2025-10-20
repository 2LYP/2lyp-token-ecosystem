'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { formatEther } from "viem";

import {
  useTotalSupply,
  useMaxSupply,
  useTokenomicsStatus,
  useFaucetDrip,
  useFaucetCooldown,
  usePausedStatus,
  useVestingAddresses
} from "@/hooks/read/useOverviewStats";
import { useAccount } from 'wagmi';
import { useUserBalance } from '@/hooks/read/useOverviewStats';

export default function LiveStatsBox() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: tokenomicsInitialized } = useTokenomicsStatus();
  const { data: faucetDrip } = useFaucetDrip();
  const { data: faucetCooldown } = useFaucetCooldown();
  const { data: isPaused } = usePausedStatus();
  const { data: vestingAddresses } = useVestingAddresses();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateTime = () => {
      if (typeof window === 'undefined') return;
      
      const nextMilestone = new Date('2025-12-31T23:59:59Z');
      const now = new Date().getTime();
      const distance = nextMilestone.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    };

    updateTime(); // Initial calculation
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parse values
  const totalSupplyFormatted = totalSupply ? parseFloat(formatEther(totalSupply)).toLocaleString() : 'Loading...';
  const maxSupplyFormatted = maxSupply ? parseFloat(formatEther(maxSupply)).toLocaleString() : 'Loading...';
  const faucetDripFormatted = faucetDrip ? parseFloat(formatEther(faucetDrip)).toLocaleString() : 'Loading...';
  const faucetCooldownHours = faucetCooldown ? Number(faucetCooldown) / 3600 : null;
  const vestingCount = vestingAddresses ? vestingAddresses.length : 0;
  
  // Calculate remaining supply
  const remainingSupply = totalSupply && maxSupply 
    ? (parseFloat(formatEther(maxSupply)) - parseFloat(formatEther(totalSupply))).toLocaleString()
    : 'Loading...';

  const stats = [
    {
      label: 'Current Supply',
      value: `${totalSupplyFormatted} 2LYP`,
      badge: isPaused ? 'Paused' : 'Active'
    },
    {
      label: 'Max Supply Cap',
      value: `${maxSupplyFormatted} 2LYP`,
    },
    {
      label: 'Remaining Supply',
      value: `${remainingSupply} 2LYP`,
    },
    {
      label: 'Faucet Amount',
      value: `${faucetDripFormatted} 2LYP`,
    },
    {
      label: 'Faucet Cooldown',
      value: faucetCooldownHours ? `${faucetCooldownHours}h` : 'Loading...',
    },
    {
      label: 'Active Vestings',
      value: `${vestingCount}`,
    },
    {
      label: 'Tokenomics Status',
      value: tokenomicsInitialized ? 'Initialized' : 'Pending',
      badge: tokenomicsInitialized ? 'Ready' : 'Pending'
    },
    {
      label: 'Contract Status',
      value: isPaused ? 'Paused' : 'Active',
      badge: isPaused ? 'Paused' : 'Live'
    }
  ];

  // Connected wallet balance
  const { address, isConnected } = useAccount();
  const { data: userBalance } = useUserBalance(isConnected ? address : undefined);
  const userBalanceFormatted = !isConnected
    ? 'Connect wallet'
    : userBalance
    ? `${parseFloat(formatEther(userBalance)).toLocaleString()} 2LYP`
    : 'Loading...';

  stats.unshift({ label: 'Your Balance', value: userBalanceFormatted });



  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Live Token Stats</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4 text-sm">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-muted-foreground">{stat.label}</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{stat.value}</p>
              {stat.badge && (
                <Badge 
                  variant={
                    stat.badge === 'Live' || stat.badge === 'Ready' || stat.badge === 'Active' 
                      ? 'default' 
                      : stat.badge === 'Paused' || stat.badge === 'Pending'
                      ? 'secondary'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {stat.badge}
                </Badge>
              )}
            </div>
          </div>
        ))}
        <div>
          <p className="text-muted-foreground">Next Milestone</p>
          <p className="font-semibold">
            {isClient ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m` : 'Loading...'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
