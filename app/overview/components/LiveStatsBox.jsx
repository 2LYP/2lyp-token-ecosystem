'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';

const stats = [
  { label: 'Total Supply', value: '10,000,000 2LYP' },
  { label: 'Burned', value: '250,000 2LYP' },
  { label: 'Circulating Supply', value: '9,750,000 2LYP' },
  { label: 'Wallet Holders', value: '1,432' },
];

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
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(new Date('2025-07-01T00:00:00Z')));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRemainingTime(new Date('2025-07-01T00:00:00Z')));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
