"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity,
  Target,
  Zap,
  Shield,
  ChartBar,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatEther } from "viem";

import {
  useTotalSupply,
  useMaxSupply,
  useFaucetDrip,
  useFaucetCooldown,
  useTokenomicsStatus,
  usePausedStatus,
  useVestingAddresses,
  useOwner,
  useTeamWallet,
  useInvestorWallet,
  useAirdropWallet,
  useTreasuryWallet,
  useClientWallet,
} from "@/hooks/read/useOverviewStats";
import { useRealTokenomicsData, useRealVestingData } from "@/hooks/read/useRealData";
import { useRealTimeHealthMetrics, useRealTimeGrowthMetrics, useSupplyVelocity, useRealTimeDistribution } from "@/hooks/read/useRealTimeMetrics";

const MetricCard = ({ title, value, change, changeType, icon: Icon, color = "blue" }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AdvancedMetrics() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: faucetDrip } = useFaucetDrip();
  const { data: faucetCooldown } = useFaucetCooldown();
  const { data: tokenomicsInitialized } = useTokenomicsStatus();
  const { data: isPaused } = usePausedStatus();
  const { data: vestingAddresses } = useVestingAddresses();
  const { data: owner } = useOwner();
  const { data: teamWallet } = useTeamWallet();
  const { data: investorWallet } = useInvestorWallet();
  const { data: airdropWallet } = useAirdropWallet();
  const { data: treasuryWallet } = useTreasuryWallet();
  const { data: clientWallet } = useClientWallet();
  
  // Get real data
  const { distributedSupply, circulatingSupply } = useRealTokenomicsData();
  const { totalAllocated, totalVested, vestingCount } = useRealVestingData();
  
  // Get real-time metrics
  const healthMetrics = useRealTimeHealthMetrics();
  const { growthData, transactionCount, currentSupply, holderCount, liquidityMetrics } = useRealTimeGrowthMetrics();
  const supplyVelocity = useSupplyVelocity();
  const distributionData = useRealTimeDistribution();

  const maximumSupply = maxSupply ? parseFloat(formatEther(maxSupply)) : 10000000;
  const totalSupplyNum = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
  const supplyUtilization = (currentSupply / maximumSupply) * 100;
  const remainingSupply = maximumSupply - currentSupply;

  const privilegedComplete = !!(teamWallet && investorWallet && airdropWallet && treasuryWallet && clientWallet);
  const supplyIntegrity = currentSupply <= maximumSupply;
  const vestingHealth = totalAllocated >= totalVested && vestingCount >= 0;

  const computeScore = (checks) => {
    let score = 100;
    for (const c of checks) score += c;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  // Security score heuristic
  const securityScore = computeScore([
    owner ? 0 : -30,
    privilegedComplete ? 0 : -10,
    supplyIntegrity ? 0 : -30,
    tokenomicsInitialized ? 0 : -10,
    vestingHealth ? 0 : -5,
    isPaused ? -5 : 0,
  ]);

  // Governance score heuristic
  const governanceScore = computeScore([
    privilegedComplete ? 0 : -15,
    vestingCount > 0 ? 0 : -15,
    totalAllocated > 0 ? 0 : -10,
  ]);

  const scoreColor = (score) => {
    if (score >= 85) return { text: 'text-green-600', bg: 'bg-green-500', label: 'Good' };
    if (score >= 65) return { text: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Moderate' };
    return { text: 'text-red-600', bg: 'bg-red-500', label: 'Risk' };
  };

  const secColor = scoreColor(securityScore);
  const govColor = scoreColor(governanceScore);

  const summary = {
    contract: {
      owner: owner || null,
      paused: !!isPaused,
      tokenomicsInitialized: !!tokenomicsInitialized,
    },
    wallets: {
      team: teamWallet || null,
      investor: investorWallet || null,
      airdrop: airdropWallet || null,
      treasury: treasuryWallet || null,
      client: clientWallet || null,
    },
    supply: {
      max: maximumSupply,
      total: totalSupplyNum,
      current: currentSupply,
      circulating: circulatingSupply,
      integrity: supplyIntegrity,
    },
    vesting: {
      count: vestingCount,
      totalAllocated,
      totalVested,
    },
    faucet: {
      drip: faucetDrip ? parseFloat(formatEther(faucetDrip)) : 0,
      cooldownSeconds: faucetCooldown ? Number(faucetCooldown) : 0,
    },
    scores: {
      security: securityScore,
      governance: governanceScore,
      distribution: distributionData?.liquidityMetrics?.distributionScore ?? null,
    },
    meta: {
      deploymentNetwork: 'Polygon Amoy (testnet)',
      timestamp: new Date().toISOString(),
    },
  };

  const handleExportJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `2lyp-metrics-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };
  
  const metrics = [
    {
      title: "Total Vestings",
      value: vestingCount.toString(),
      change: vestingCount > 0 ? `${vestingCount} active` : "None yet",
      changeType: "increase",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Circulating Supply",
      value: `${circulatingSupply.toLocaleString()}`,
      change: `${currentSupply > 0 ? ((circulatingSupply / currentSupply) * 100).toFixed(1) : 0}% of total`,
      changeType: "increase",
      icon: Users,
      color: "blue"
    },
    {
      title: "Tokens Vested",
      value: `${totalVested.toLocaleString()}`,
      change: totalAllocated > 0 ? `${((totalVested / totalAllocated) * 100).toFixed(1)}% released` : "No vesting yet",
      changeType: "increase",
      icon: Activity,
      color: "purple"
    },
    {
      title: "Supply Utilization",
      value: `${supplyUtilization.toFixed(1)}%`,
      change: `${remainingSupply.toLocaleString()} remaining`,
      changeType: "increase",
      icon: Target,
      color: "orange"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Advanced Analytics
          <Badge variant="default">Pro</Badge>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleExportJSON}>Export JSON</Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="trust">Trust</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Supply Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {currentSupply.toLocaleString()} 2LYP</span>
                      <span>Max: {maximumSupply.toLocaleString()} 2LYP</span>
                    </div>
                    <Progress value={supplyUtilization} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {remainingSupply.toLocaleString()} 2LYP remaining to mint
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Faucet Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {faucetDrip ? parseFloat(formatEther(faucetDrip)).toLocaleString() : '0'} 2LYP
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        {faucetCooldown ? `${Number(faucetCooldown) / 3600}h cooldown` : 'Loading...'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Contract</span>
                      <Badge variant={isPaused ? "destructive" : "default"}>
                        {isPaused ? 'Paused' : 'Active'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tokenomics</span>
                      <Badge variant={tokenomicsInitialized ? "default" : "secondary"}>
                        {tokenomicsInitialized ? 'Live' : 'Setup'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Lock className="w-4 h-4 text-blue-600" />Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>Owner</span><code className="truncate max-w-[140px]">{owner ? `${owner.slice(0,6)}...${owner.slice(-4)}` : '—'}</code></div>
                    <div className="flex justify-between"><span>Team</span><code className="truncate max-w-[140px]">{teamWallet ? `${teamWallet.slice(0,6)}...${teamWallet.slice(-4)}` : '—'}</code></div>
                    <div className="flex justify-between"><span>Investor</span><code className="truncate max-w-[140px]">{investorWallet ? `${investorWallet.slice(0,6)}...${investorWallet.slice(-4)}` : '—'}</code></div>
                    <div className="flex justify-between"><span>Treasury</span><code className="truncate max-w-[140px]">{treasuryWallet ? `${treasuryWallet.slice(0,6)}...${treasuryWallet.slice(-4)}` : '—'}</code></div>
                    <div className="flex justify-between"><span>Client</span><code className="truncate max-w-[140px]">{clientWallet ? `${clientWallet.slice(0,6)}...${clientWallet.slice(-4)}` : '—'}</code></div>
                    <div className="flex justify-between"><span>Airdrop</span><code className="truncate max-w-[140px]">{airdropWallet ? `${airdropWallet.slice(0,6)}...${airdropWallet.slice(-4)}` : '—'}</code></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4 text-green-600" />Status & Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>Contract Paused</span><Badge variant={isPaused ? 'destructive' : 'default'}>{isPaused ? 'Yes' : 'No'}</Badge></div>
                    <div className="flex justify-between"><span>Tokenomics Initialized</span><Badge variant={tokenomicsInitialized ? 'default' : 'secondary'}>{tokenomicsInitialized ? 'Yes' : 'No'}</Badge></div>
                    <div className="flex justify-between"><span>Vesting Entries</span><span className="font-medium">{vestingCount}</span></div>
                    <div className="flex justify-between"><span>Allocated vs Vested</span><span>{totalVested.toLocaleString()} / {totalAllocated.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Max Supply</span><span>{maximumSupply.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Current Supply</span><span>{currentSupply.toLocaleString()}</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-600" />Risk Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span>Owner Set</span><span className={owner ? 'text-green-600' : 'text-red-600'}>{owner ? '✓' : '✗'}</span></div>
                    <div className="flex justify-between"><span>Privileged Wallets</span><span className={(teamWallet && investorWallet && treasuryWallet && clientWallet && airdropWallet) ? 'text-green-600' : 'text-yellow-600'}>{(teamWallet && investorWallet && treasuryWallet && clientWallet && airdropWallet) ? 'Complete' : 'Partial'}</span></div>
                    <div className="flex justify-between"><span>Supply Integrity</span><span className={(currentSupply <= maximumSupply) ? 'text-green-600' : 'text-red-600'}>{(currentSupply <= maximumSupply) ? 'Valid' : 'Exceeded'}</span></div>
                    <div className="flex justify-between"><span>Paused State</span><span className={isPaused ? 'text-yellow-600' : 'text-green-600'}>{isPaused ? 'Paused' : 'Active'}</span></div>
                    <div className="flex justify-between"><span>Tokenomics Ready</span><span className={tokenomicsInitialized ? 'text-green-600' : 'text-yellow-600'}>{tokenomicsInitialized ? 'Yes' : 'Pending'}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TRUST TAB */}
          <TabsContent value="trust" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><Info className="w-5 h-5 text-blue-600" />Testnet Deployment & Transparency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>This project is currently deployed on a testnet (Polygon Amoy) to minimize operational costs while validating token mechanics and security posture. All metrics shown are derived from on-chain reads and synthesized live estimations—no off-chain mutation of token state occurs here.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><span className="font-medium text-foreground">Immutable Supply Cap:</span> Max supply enforced by smart contract — attempts to exceed revert.</li>
                  <li><span className="font-medium text-foreground">Transparent Vesting:</span> Vesting allocations, released vs remaining, and beneficiary addresses shown publicly.</li>
                  <li><span className="font-medium text-foreground">Airdrop Integrity:</span> Claims require prior inclusion; double-claims revert with errors.</li>
                  <li><span className="font-medium text-foreground">Operational Safety:</span> Pausing mechanism available for emergency response without altering historical state.</li>
                  <li><span className="font-medium text-foreground">Wallet Segregation:</span> Dedicated addresses for team, investors, airdrop, treasury, and client funds reduce commingling risk.</li>
                </ul>
                <div className="p-3 rounded-md bg-muted border text-xs leading-relaxed">
                  <strong>Disclaimer:</strong> Testnet metrics (holders, transactions, liquidity) are simulated approximations for modeling purposes and will calibrate automatically post mainnet launch.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-Time Supply Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'supply' ? `${(value / 1000000).toFixed(2)}M 2LYP` : 
                        name === 'circulating' ? `${(value / 1000000).toFixed(2)}M 2LYP` :
                        name === 'volume' ? `${(value / 1000).toFixed(1)}K 2LYP` : value,
                        name === 'supply' ? 'Total Supply' : 
                        name === 'circulating' ? 'Circulating' :
                        name === 'volume' ? 'Volume' : 'Transactions'
                      ]}
                    />
                    <Area type="monotone" dataKey="supply" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="circulating" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Supply Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {supplyVelocity > 0 ? '+' : ''}{supplyVelocity.toLocaleString()} 2LYP
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supply change rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {transactionCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All-time transaction count
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Holder Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {holderCount.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated holders
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Liquidity Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">
                      {liquidityMetrics.liquidityRatio || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Circulating ratio
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-Time Holder Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {distributionData.holderCategories?.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{category.name}</span>
                          <span className="font-medium">{category.count} ({category.percentage}%)</span>
                        </div>
                        <Progress value={parseFloat(category.percentage)} className="h-2" />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Risk Level:</span>
                          <Badge variant={category.risk === 'high' ? 'destructive' : category.risk === 'medium' ? 'secondary' : 'default'}>
                            {category.risk}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Distribution Health</span>
                      <span className="font-bold text-green-600">
                        {distributionData.liquidityMetrics?.distributionScore || 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Liquidity Score</span>
                      <span className="font-medium">
                        {distributionData.liquidityMetrics?.liquidityScore || 0}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Circulating Ratio</span>
                      <span className="font-medium">
                        {distributionData.liquidityMetrics?.circulatingRatio || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Activity Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{holderCount}</div>
                        <p className="text-sm text-muted-foreground">Est. Holders</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{transactionCount}</div>
                        <p className="text-sm text-muted-foreground">Total Transactions</p>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'transactions' ? value : 
                            name === 'holders' ? value :
                            `${(value / 1000000).toFixed(1)}M`,
                            name === 'transactions' ? 'Transactions' :
                            name === 'holders' ? 'Holders' : 'Volume'
                          ]}
                        />
                        <Line type="monotone" dataKey="transactions" stroke="#82ca9d" strokeWidth={2} />
                        <Line type="monotone" dataKey="holders" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-green-500" />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className={`text-3xl font-bold ${secColor.text}`}>
                      {securityScore}/100
                    </div>
                    <Badge variant="default" className={`${secColor.bg}`}>
                      {secColor.label}
                    </Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Owner Set</span>
                        <span className={owner ? 'text-green-600' : 'text-red-600'}>{owner ? '✓' : '✗'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Privileged Wallets</span>
                        <span className={privilegedComplete ? 'text-green-600' : 'text-yellow-600'}>{privilegedComplete ? 'Complete' : 'Partial'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Supply Integrity</span>
                        <span className={supplyIntegrity ? 'text-green-600' : 'text-red-600'}>{supplyIntegrity ? 'Valid' : 'Exceeded'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ChartBar className="w-5 h-5 text-blue-500" />
                    Governance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className={`text-3xl font-bold ${govColor.text}`}>
                      {governanceScore}/100
                    </div>
                    <Badge variant="default" className={`${govColor.bg}`}>
                      {govColor.label}
                    </Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Vesting Entries</span>
                        <span className={vestingCount > 0 ? 'text-green-600' : 'text-yellow-600'}>{vestingCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allocated vs Vested</span>
                        <span>{totalVested.toLocaleString()} / {totalAllocated.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tokenomics Initialized</span>
                        <span className={tokenomicsInitialized ? 'text-green-600' : 'text-yellow-600'}>{tokenomicsInitialized ? 'Yes' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
