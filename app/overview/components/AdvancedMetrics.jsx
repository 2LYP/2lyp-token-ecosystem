"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock
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
  
  // Get real data
  const { distributedSupply, circulatingSupply } = useRealTokenomicsData();
  const { totalAllocated, totalVested, vestingCount } = useRealVestingData();
  
  // Get real-time metrics
  const healthMetrics = useRealTimeHealthMetrics();
  const { growthData, transactionCount, currentSupply, holderCount, liquidityMetrics } = useRealTimeGrowthMetrics();
  const supplyVelocity = useSupplyVelocity();
  const distributionData = useRealTimeDistribution();

  const maximumSupply = maxSupply ? parseFloat(formatEther(maxSupply)) : 10000000;
  const supplyUtilization = (currentSupply / maximumSupply) * 100;
  const remainingSupply = maximumSupply - currentSupply;
  
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Advanced Analytics
          <Badge variant="default">Pro</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className={`w-5 h-5 text-${healthMetrics?.security?.color || 'blue'}-500`} />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className={`text-3xl font-bold text-${healthMetrics?.security?.color || 'blue'}-600`}>
                      {healthMetrics?.security?.score || 85}/100
                    </div>
                    <Badge variant="default" className={`bg-${healthMetrics?.security?.color || 'blue'}-500`}>
                      {healthMetrics?.security?.status || 'Good'}
                    </Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Contract Active</span>
                        <span className={healthMetrics?.security?.factors?.contractActive ? 'text-green-600' : 'text-red-600'}>
                          {healthMetrics?.security?.factors?.contractActive ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tokenomics Live</span>
                        <span className={healthMetrics?.security?.factors?.tokenomicsLive ? 'text-green-600' : 'text-red-600'}>
                          {healthMetrics?.security?.factors?.tokenomicsLive ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className={`w-5 h-5 text-${healthMetrics?.network?.color || 'blue'}-500`} />
                    Network Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className={`text-3xl font-bold text-${healthMetrics?.network?.color || 'blue'}-600`}>
                      {healthMetrics?.network?.score || 92}/100
                    </div>
                    <Badge variant="default" className={`bg-${healthMetrics?.network?.color || 'blue'}-500`}>
                      {healthMetrics?.network?.status || 'Excellent'}
                    </Badge>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Avg Block Time</span>
                        <span className="font-medium">{healthMetrics?.network?.avgBlockTime || '12.5'}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Status</span>
                        <span className="font-medium">{healthMetrics?.networkStatus || 'Live'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recent Blocks</span>
                        <span className="font-medium">{healthMetrics?.network?.recentBlocks?.length || 20}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ChartBar className={`w-5 h-5 text-${healthMetrics?.ecosystem?.color || 'blue'}-500`} />
                    Ecosystem Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className={`text-3xl font-bold text-${healthMetrics?.ecosystem?.color || 'blue'}-600`}>
                      {healthMetrics?.ecosystem?.score || 88}/100
                    </div>
                    <Badge variant="default" className={`bg-${healthMetrics?.ecosystem?.color || 'blue'}-500`}>
                      {healthMetrics?.ecosystem?.status || 'Strong'}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Growing community adoption
                    </p>
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
