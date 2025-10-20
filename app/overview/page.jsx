'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import TokenSummaryBox from '@/app/overview/components/TokenSummaryBox';
import LiveStatsBox from './components/LiveStatsBox';
import SecurityAuditSection from './components/SecurityAuditSection';
import ActivityFeed from './components/ActivityFeed';
import CommunityLinks from './components/CommunityLinks';
import TokenomicsWallets from './components/TokenomicsWallets';
import VestingOverview from './components/VestingOverview';
import AdvancedMetrics from './components/AdvancedMetrics';
import ModernFooter from './components/ModernFooter';
import Navbar from '../navbar/page';
import { useRealTokenomicsData, useRealVestingData } from '@/hooks/read/useRealData';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a6cee3'];

const renderCustomLabel = ({ name, percent }) => {
  return `${name} (${(percent * 100).toFixed(1)}%)`;
};

export default function OverviewPage() {
  // Get real tokenomics and vesting data
  const { tokenomicsData: realTokenomicsData } = useRealTokenomicsData();
  const { allocationData: realAllocationData } = useRealVestingData();
  
  // Use real data if available, otherwise fallback to mock data
  const tokenomicsData = realTokenomicsData && realTokenomicsData.length > 0 
    ? realTokenomicsData.map((item, index) => ({ 
        name: item.name, 
        value: item.percentage,
        color: COLORS[index % COLORS.length]
      }))
    : [
        { name: 'Team & Founders', value: 20, color: '#8884d8' },
        { name: 'Advisors', value: 10, color: '#82ca9d' },
        { name: 'Investors', value: 15, color: '#ffc658' },
        { name: 'Community & Ecosystem', value: 45, color: '#ff7f50' },
        { name: 'Reserve Fund', value: 10, color: '#a6cee3' },
      ];

  const allocationData = realAllocationData && realAllocationData.length > 0
    ? realAllocationData
    : [
        { name: 'Team', allocated: 2000000, vested: 500000, remaining: 1500000 },
        { name: 'Investors', allocated: 1500000, vested: 300000, remaining: 1200000 },
        { name: 'Community', allocated: 4500000, vested: 1000000, remaining: 3500000 },
        { name: 'Advisors', allocated: 1000000, vested: 200000, remaining: 800000 },
        { name: 'Reserve', allocated: 1000000, vested: 0, remaining: 1000000 },
      ];
  return (
    <>
    <Navbar />
    <div className="p-6 space-y-6">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">2LYP Token Hub</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The central platform for managing and using the 2LYP utility token within our ecosystem. Access faucets, claim airdrops, monitor vesting schedules (for investors), and explore comprehensive tokenomics data all in one place.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link href="/faucet">Claim Faucet</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/airdrop">Claim Airdrop</Link>
          </Button>
          {/* <Button asChild variant="outline" size="lg">
            <Link href="/vesting">⏳ View Vesting</Link>
          </Button> */}
          <Button asChild variant="ghost" size="lg">
            <Link href="https://raw.githubusercontent.com/2LYP/2LYP-Tokenomics/a405cb8983ac719969b0ab11cfbde240bf9332ad/2LYP-Tokenomics.pdf" target="_blank">
              Whitepaper
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="https://github.com/2LYP/2LYP-Tokenomics" target="_blank">
              GitHub
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="https://amoy.polygonscan.com/token/0x699D113717e562F35BC5949693a7c79745Aa60b2" target="_blank">
              Token Explorer
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="https://faucet.polygon.technology/" target="_blank">
              Amoy Faucet
            </Link>
          </Button>
        </div>
      </section>

      <TokenSummaryBox />
      <LiveStatsBox />
      
      <AdvancedMetrics />
      
      <TokenomicsWallets />

      <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* <VestingOverview /> */}
        <ActivityFeed />
      </section>

      <SecurityAuditSection />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[450px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Tokenomics Distribution
              <Badge variant="outline">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  dataKey="value"
                  data={tokenomicsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {tokenomicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[450px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Vesting & Allocation Status
              <Badge variant="secondary">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={allocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${(value / 1000000).toFixed(2)}M 2LYP`, 
                    name === 'allocated' ? 'Total Allocated' : 
                    name === 'vested' ? 'Already Vested' : 'Remaining'
                  ]}
                />
                <Legend />
                <Bar dataKey="allocated" fill="#8884d8" name="allocated" />
                <Bar dataKey="vested" fill="#82ca9d" name="vested" />
                <Bar dataKey="remaining" fill="#ffc658" name="remaining" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
      
      <CommunityLinks /> 
    </div>
    </>
  );
}
