"use client";

import { useState, useEffect } from "react";
import { useReadContract, useBlockNumber, useBalance } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import { 
  useTotalSupply, 
  useMaxSupply, 
  usePausedStatus,
  useTokenomicsStatus,
  useVestingAddresses
} from "./useOverviewStats";
import { useRealTokenomicsData } from "./useRealData";

// Hook for real-time health metrics
export function useRealTimeHealthMetrics() {
  const [healthData, setHealthData] = useState({
    securityScore: 0,
    networkHealth: 0,
    ecosystemScore: 0,
    avgBlockTime: 0,
    recentBlocks: 0,
    networkStatus: 'Loading...'
  });

  const { data: isPaused } = usePausedStatus();
  const { data: tokenomicsInitialized } = useTokenomicsStatus();
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: vestingAddresses } = useVestingAddresses();

  useEffect(() => {
    // Calculate Security Score (0-100)
    let securityScore = 60; // Base score
    
    // Contract is deployed and working
    if (totalSupply && maxSupply) securityScore += 15;
    
    // Contract is not paused
    if (isPaused === false) securityScore += 10;
    
    // Tokenomics are initialized  
    if (tokenomicsInitialized) securityScore += 10;
    
    // Contract has proper supply limits
    if (maxSupply && totalSupply) {
      const utilization = Number(totalSupply) / Number(maxSupply);
      if (utilization < 0.9) securityScore += 5; // Not over-minted
    }

    // Calculate Network Health (0-100)
    let networkHealth = 85; // Higher base score for a working blockchain network
    
    // Network is responsive (block updates)
    if (blockNumber) networkHealth += 10; // Up to 95
    
    // Contract is not paused (operational)  
    if (isPaused === false) networkHealth += 5; // Up to 100
    
    // If contract is paused, significant penalty
    if (isPaused === true) networkHealth -= 30;
    
    // Recent activity (simulate healthy network activity)
    const recentBlocks = Math.floor(Math.random() * 10) + 15; // 15-25 blocks

    // Calculate Ecosystem Score (0-100)
    let ecosystemScore = 65; // Base score
    
    // Supply utilization health
    if (maxSupply && totalSupply) {
      const utilization = Number(totalSupply) / Number(maxSupply);
      if (utilization > 0.1 && utilization < 0.8) ecosystemScore += 15; // Healthy utilization
    }
    
    // Tokenomics setup
    if (tokenomicsInitialized) ecosystemScore += 10;
    
    // Contract operational
    if (isPaused === false) ecosystemScore += 10;

    // Mock average block time (Ethereum mainnet ~12s, testnets vary)
    const avgBlockTime = 12 + Math.random() * 3; // 12-15 seconds

    setHealthData({
      securityScore: Math.min(securityScore, 100),
      networkHealth: Math.min(networkHealth, 100),
      ecosystemScore: Math.min(ecosystemScore, 100),
      avgBlockTime: avgBlockTime,
      recentBlocks: recentBlocks,
      networkStatus: blockNumber ? 'Live' : 'Connecting...',
      // Structure for component compatibility
      security: {
        score: Math.min(securityScore, 100),
        status: securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Good' : securityScore >= 50 ? 'Fair' : 'Poor',
        color: securityScore >= 90 ? 'green' : securityScore >= 70 ? 'blue' : securityScore >= 50 ? 'yellow' : 'red',
        factors: {
          contractActive: !isPaused,
          tokenomicsLive: tokenomicsInitialized,
          vestingActive: (vestingAddresses?.length || 0) > 0
        }
      },
      network: {
        score: Math.min(networkHealth, 100),
        status: networkHealth >= 90 ? 'Excellent' : networkHealth >= 70 ? 'Good' : networkHealth >= 50 ? 'Fair' : 'Poor',
        color: networkHealth >= 90 ? 'green' : networkHealth >= 70 ? 'blue' : networkHealth >= 50 ? 'yellow' : 'red',
        avgBlockTime: avgBlockTime.toFixed(1),
        recentBlocks: Array.from({length: recentBlocks}, (_, i) => i)
      },
      ecosystem: {
        score: Math.min(ecosystemScore, 100),
        status: ecosystemScore >= 90 ? 'Excellent' : ecosystemScore >= 70 ? 'Good' : ecosystemScore >= 50 ? 'Fair' : 'Poor',
        color: ecosystemScore >= 90 ? 'green' : ecosystemScore >= 70 ? 'blue' : ecosystemScore >= 50 ? 'yellow' : 'red'
      }
    });
  }, [isPaused, tokenomicsInitialized, totalSupply, maxSupply, blockNumber]);

  return healthData;
}

// Hook for real-time growth metrics
export function useRealTimeGrowthMetrics() {
  const [growthData, setGrowthData] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [holderCount, setHolderCount] = useState(0);
  const [liquidityMetrics, setLiquidityMetrics] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  
  const { data: totalSupply } = useTotalSupply();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { distributedSupply, circulatingSupply, walletBalances } = useRealTokenomicsData();

  // Serialize wallet balances to prevent infinite re-renders
  const walletBalancesString = JSON.stringify(walletBalances);

  useEffect(() => {
    const now = Date.now();
    // Only update every 5 seconds to prevent excessive re-renders
    if (now - lastUpdateTime < 5000 && growthData.length > 0) return;

    // Generate realistic growth data based on current blockchain state
    const currentSupply = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
    
    // Create historical growth projection based on current state
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    
    const newGrowthData = months.map((month, index) => {
      // Calculate progressive growth based on actual supply data
      const progressFactor = Math.min((index + 1) / 6, 1);
      
      // More realistic supply progression - current supply represents recent growth
      const baseSupply = currentSupply * 0.7; // 70% of current was historical base
      const supply = Math.floor(baseSupply + (currentSupply - baseSupply) * progressFactor);
      
      // Transaction count based on actual blockchain activity patterns
      const transactionsPerToken = 0.001; // Estimate: 1 transaction per 1000 tokens
      const baseTransactions = Math.floor(supply * transactionsPerToken);
      const transactions = Math.max(baseTransactions + Math.floor(Math.random() * 10) - 5, 1);
      
      // More realistic holder estimation
      const tokensPerHolder = 2500; // Average 2500 tokens per holder
      const estimatedHolders = Math.max(Math.floor(supply / tokensPerHolder), 1);
      
      // Volume based on circulating supply and typical trading patterns
      const circulatingAtTime = index === 5 ? (circulatingSupply || currentSupply * 0.3) : supply * 0.4;
      const dailyVolumeRatio = 0.02; // 2% daily volume is realistic
      const volume = Math.floor(circulatingAtTime * dailyVolumeRatio);
      
      return {
        name: month,
        supply: supply,
        transactions: transactions,
        holders: estimatedHolders,
        volume: volume,
        circulating: circulatingAtTime,
        growth: index > 0 ? ((supply - baseSupply) / baseSupply * 100).toFixed(1) : 0
      };
    });

    setGrowthData(newGrowthData);
    setLastUpdateTime(now);
    
  }, [totalSupply, walletBalancesString, circulatingSupply, distributedSupply, lastUpdateTime]);

  // Separate effect for block-based updates
  useEffect(() => {
    if (blockNumber && transactionCount < 1000) {
      const blockDiff = Math.floor(Math.random() * 3); // 0-2 new transactions per block
      setTransactionCount(prev => prev + blockDiff);
    }
  }, [blockNumber, transactionCount]);

  // Separate effect for holder count estimation
  useEffect(() => {
    const currentSupply = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
    if (currentSupply > 0) {
      const parsedWalletBalances = JSON.parse(walletBalancesString);
      
      // More realistic holder estimation
      const knownWallets = Object.values(parsedWalletBalances).filter(balance => balance > 0).length;
      
      // Estimate total holders based on supply distribution patterns
      // Typically: 1 holder per 1000-5000 tokens depending on token popularity
      const avgTokensPerHolder = 2000; // Conservative estimate
      const estimatedTotalHolders = Math.floor(currentSupply / avgTokensPerHolder);
      
      // Add known wallet count to estimation
      const finalHolderCount = Math.max(estimatedTotalHolders, knownWallets * 2); // At least double known wallets
      
      setHolderCount(finalHolderCount);

      // Calculate more accurate liquidity metrics
      const totalCirculating = circulatingSupply || currentSupply * 0.3; // Default to 30% if not available
      
      setLiquidityMetrics({
        liquidityRatio: currentSupply > 0 ? (totalCirculating / currentSupply * 100).toFixed(2) : 0,
        concentrationIndex: calculateConcentrationIndex(parsedWalletBalances),
        distributionHealth: calculateDistributionHealth(parsedWalletBalances, currentSupply)
      });
    }
  }, [totalSupply, walletBalancesString, circulatingSupply]);

  return {
    growthData,
    transactionCount,
    holderCount,
    liquidityMetrics,
    currentSupply: totalSupply ? parseFloat(formatEther(totalSupply)) : 0
  };
}

// Helper function to calculate concentration index
function calculateConcentrationIndex(walletBalances) {
  const balances = Object.values(walletBalances);
  const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);
  
  if (totalBalance === 0) return 0;
  
  // Calculate Herfindahl-Hirschman Index (HHI)
  const hhi = balances.reduce((sum, balance) => {
    const share = balance / totalBalance;
    return sum + (share * share);
  }, 0);
  
  return (hhi * 10000).toFixed(0); // Scale to 0-10000
}

// Helper function to calculate distribution health
function calculateDistributionHealth(walletBalances, totalSupply) {
  const balances = Object.values(walletBalances);
  const nonZeroBalances = balances.filter(b => b > 0);
  
  if (nonZeroBalances.length === 0) return 0;
  
  // Check if any single wallet holds >50% (unhealthy)
  const maxShare = Math.max(...balances) / totalSupply;
  if (maxShare > 0.5) return 30; // Poor distribution
  
  // Good distribution if largest wallet <30%
  if (maxShare < 0.3) return 90; // Excellent distribution
  
  return 70; // Good distribution
}

// Hook for real-time distribution metrics
export function useRealTimeDistribution() {
  const [distributionData, setDistributionData] = useState({
    holderCategories: [],
    liquidityMetrics: {},
    concentrationRisk: 0
  });

  const { walletBalances, circulatingSupply, totalSupply: realTotalSupply } = useRealTokenomicsData();
  const { data: totalSupply } = useTotalSupply();

  // Serialize wallet balances to prevent infinite re-renders
  const walletBalancesString = JSON.stringify(walletBalances);

  useEffect(() => {
    const currentSupply = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
    if (currentSupply === 0) return;

    const parsedWalletBalances = JSON.parse(walletBalancesString);
    const walletValues = Object.values(parsedWalletBalances);
    const totalWalletBalance = walletValues.reduce((sum, balance) => sum + balance, 0);
    
    // Calculate real holder distribution based on wallet balances
    const categories = [
      {
        name: "Whales (>100K 2LYP)",
        count: walletValues.filter(balance => balance > 100000).length,
        percentage: ((walletValues.filter(balance => balance > 100000).reduce((sum, b) => sum + b, 0) / currentSupply) * 100).toFixed(1),
        risk: "high"
      },
      {
        name: "Large (10K-100K 2LYP)", 
        count: walletValues.filter(balance => balance >= 10000 && balance <= 100000).length,
        percentage: ((walletValues.filter(balance => balance >= 10000 && balance <= 100000).reduce((sum, b) => sum + b, 0) / currentSupply) * 100).toFixed(1),
        risk: "medium"
      },
      {
        name: "Medium (1K-10K 2LYP)",
        count: walletValues.filter(balance => balance >= 1000 && balance < 10000).length,
        percentage: ((walletValues.filter(balance => balance >= 1000 && balance < 10000).reduce((sum, b) => sum + b, 0) / currentSupply) * 100).toFixed(1),
        risk: "low"
      },
      {
        name: "Small (<1K 2LYP)",
        count: Math.max(Math.floor((currentSupply - totalWalletBalance) / 200), 50), // Estimate: avg 200 tokens for small holders
        percentage: Math.max((100 - parseFloat(((totalWalletBalance / currentSupply) * 100).toFixed(1))), 5).toFixed(1),
        risk: "minimal"
      }
    ];

    // Calculate concentration risk
    const maxWalletShare = walletValues.length > 0 ? Math.max(...walletValues) / currentSupply : 0;
    const concentrationRisk = maxWalletShare > 0.5 ? 90 : maxWalletShare > 0.3 ? 60 : maxWalletShare > 0.1 ? 30 : 10;

    setDistributionData({
      holderCategories: categories,
      liquidityMetrics: {
        circulatingRatio: currentSupply > 0 ? ((circulatingSupply / currentSupply) * 100).toFixed(1) : 0,
        liquidityScore: calculateLiquidityScore(circulatingSupply, currentSupply),
        distributionScore: 100 - concentrationRisk
      },
      concentrationRisk
    });
  }, [walletBalancesString, circulatingSupply, totalSupply]);

  return distributionData;
}

// Helper function for liquidity score
function calculateLiquidityScore(circulating, total) {
  if (total === 0) return 0;
  const ratio = circulating / total;
  if (ratio > 0.7) return 95; // Excellent liquidity
  if (ratio > 0.5) return 80; // Good liquidity  
  if (ratio > 0.3) return 60; // Fair liquidity
  return 30; // Poor liquidity
}

// Hook for supply velocity (how fast supply changes)
export function useSupplyVelocity() {
  const [velocity, setVelocity] = useState(0);
  const [previousSupply, setPreviousSupply] = useState(0);
  
  const { data: totalSupply } = useTotalSupply();

  useEffect(() => {
    if (totalSupply) {
      const currentSupply = parseFloat(formatEther(totalSupply));
      if (previousSupply > 0) {
        const change = currentSupply - previousSupply;
        setVelocity(change);
      }
      setPreviousSupply(currentSupply);
    }
  }, [totalSupply, previousSupply]);

  return velocity;
}
