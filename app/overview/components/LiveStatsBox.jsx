'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { formatEther } from "viem";

import {
  useTotalSupply,
  useMaxSupply,
  useTotalBurned
} from "@/hooks/read/useOverviewStats";

function getRemainingTime(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export default function LiveStatsBox() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: burnedAmount } = useTotalBurned();
  
  console.log("🔥 burnedAmount:", burnedAmount);


  const [timeLeft, setTimeLeft] = useState(getRemainingTime(new Date('2025-07-01T00:00:00Z')));

  // let burnedAmount = 250_000; // You can update this dynamically if needed


  useEffect(() => {

    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime(new Date('2025-07-01T00:00:00Z')));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Parse values
  
  const totalSupplyFormatted = totalSupply ? parseFloat(formatEther(totalSupply)).toLocaleString() : null;
  const maxSupplyFormatted = maxSupply ? parseFloat(formatEther(maxSupply)).toLocaleString() : null;
  // const circulatingSupply =
  //   totalSupply && burnedAmount
  //     ? (parseFloat(formatEther(totalSupply)) - burnedAmount).toLocaleString()
  //     : null;

  const burnedAmountFormatted =
  burnedAmount !== undefined
    ? parseFloat(formatEther(burnedAmount)).toLocaleString()
    : null;

  const circulatingSupply =
    totalSupply !== undefined && burnedAmount !== undefined
      ? (
          parseFloat(formatEther(totalSupply)) -
          parseFloat(formatEther(burnedAmount))
        ).toLocaleString()
      : null;


const stats = [
  {
    label: 'Total Supply',
    value: totalSupply !== undefined
      ? `${parseFloat(formatEther(totalSupply)).toLocaleString()} 2LYP`
      : 'Loading...',
  },
  {
    label: 'Burned',
    value: burnedAmount !== undefined
      ? `${burnedAmountFormatted} 2LYP`
      : 'Loading...',
  },
  {
    label: 'Circulating Supply',
    value: circulatingSupply !== null
      ? `${circulatingSupply} 2LYP`
      : 'Loading...',
  },
  {
    label: 'Wallet Holders',
    value: '1,432', // placeholder
  },
];



  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">📊 Live Token Stats</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4 text-sm">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-muted-foreground">{stat.label}</p>
            <p className="font-semibold">{stat.value}</p>
          </div>
        ))}
        <div>
          <p className="text-muted-foreground">Next Burn</p>
          <p className="font-semibold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
