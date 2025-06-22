'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import TokenSummaryBox from '@/app/overview/components/TokenSummaryBox';
import LiveStatsBox from './components/LiveStatsBox';
import SecurityAuditSection from './components/SecurityAuditSection';
import ActivityFeed from './components/ActivityFeed';
import CommunityLinks from './components/CommunityLinks';

const tokenomicsData = [
  { name: 'Team & Founders', value: 20 },
  { name: 'Advisors', value: 10 },
  { name: 'Investors', value: 15 },
  { name: 'Community & Ecosystem', value: 45 },
  { name: 'Reserve Fund', value: 10 },
];

const burnData = [
  { name: 'Q1', supply: 10000000 },
  { name: 'Q2', supply: 9900000 },
  { name: 'Q3', supply: 9801000 },
  { name: 'Q4', supply: 9702990 },
  { name: 'Q5', supply: 9605960.1 },
  { name: 'Q6', supply: 9509900.5 },
  { name: 'Q7', supply: 9414801.49 },
  { name: 'Q8', supply: 9320653.47 },
  { name: 'Q9', supply: 9227446.94 },
  { name: 'Q10', supply: 9135172.47 },
];


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a6cee3'];

const renderCustomLabel = ({ name, percent }) => {
  return `${name} (${(percent * 100).toFixed(1)}%)`;
};

export default function OverviewPage() {
  return (
    <div className="p-6 space-y-6">
      <section className="text-center space-y-2">
        <h1 className="text-4xl font-bold">2LYP Token Overview</h1>
        <p className="text-gray-500">A deflationary utility token for the decentralized 2LYP ecosystem.</p>
        <div className="flex justify-center gap-4">
          <Button asChild><Link href="/faucet">Claim Faucet</Link></Button>
          <Button asChild variant="outline"><Link href="/airdrop">Claim Airdrop</Link></Button>
          <Button asChild><Link href="https://raw.githubusercontent.com/2LYP/2LYP-Tokenomics/a405cb8983ac719969b0ab11cfbde240bf9332ad/2LYP-Tokenomics.pdf" target="_blank">📄 View PDF</Link></Button>
          <Button asChild variant="ghost"><Link href="https://github.com/2LYP/2LYP-Tokenomics" target="_blank">🌐 GitHub Repo</Link></Button>
        </div>
      </section>

      <TokenSummaryBox />
      <LiveStatsBox />
      <SecurityAuditSection />
      <ActivityFeed />

      {/* <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Supply</CardTitle></CardHeader>
          <CardContent>10,000,000 2LYP</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Burned</CardTitle></CardHeader>
          <CardContent>500,000 2LYP</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Circulating Supply</CardTitle></CardHeader>
          <CardContent>7,500,000 2LYP</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Holders</CardTitle></CardHeader>
          <CardContent>124</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Next Burn</CardTitle></CardHeader>
          <CardContent>in 12 days</CardContent>
        </Card>
      </section> */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Tokenomics Distribution Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ResponsiveContainer width="100%" height="90%">
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
                <Tooltip />
                
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[400px]">
          <CardHeader><CardTitle>Burn Model</CardTitle></CardHeader>
          <CardContent className="h-full">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={burnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[9000000,1000000]}/>
                <Tooltip />
                <Line type="monotone" dataKey="supply" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <CommunityLinks />
    </div>
  );
}
