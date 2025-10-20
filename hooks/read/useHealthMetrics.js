"use client";

import { useState, useEffect } from "react";
import { useReadContract, useBlockNumber } from "wagmi";
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

// Hook for real-time security health
export function useSecurityHealth() {
  const { data: isPaused } = usePausedStatus();
  const { data: tokenomicsInitialized } = useTokenomicsStatus();
  const { data: vestingAddresses } = useVestingAddresses();
  
  // Contract verification check (simulated - would need external API)
  const [isVerified, setIsVerified] = useState(true);
  
  const securityScore = () => {
    let score = 0;
    
    // Contract not paused (+25 points)
    if (!isPaused) score += 25;
    
    // Tokenomics initialized (+25 points)
    if (tokenomicsInitialized) score += 25;
    
    // Has vesting system (+25 points)
    if (vestingAddresses && vestingAddresses.length > 0) score += 25;
    
    // Contract verified (+25 points)
    if (isVerified) score += 25;
    
    return Math.min(score, 100);
  };

  const getSecurityStatus = (score) => {
    if (score >= 90) return { label: "Excellent", color: "green" };
    if (score >= 75) return { label: "Good", color: "blue" };
    if (score >= 50) return { label: "Fair", color: "yellow" };
    return { label: "Poor", color: "red" };
  };

  const score = securityScore();
  const status = getSecurityStatus(score);

  return {
    score,
    status: status.label,
    color: status.color,
    factors: {
      contractActive: !isPaused,
      tokenomicsLive: tokenomicsInitialized,
      vestingActive: vestingAddresses?.length > 0,
      contractVerified: isVerified
    }
  };
}

// Hook for real-time network health
export function useNetworkHealth() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [lastBlockTime, setLastBlockTime] = useState(Date.now());
  
  useEffect(() => {
    if (blockNumber) {
      const now = Date.now();
      const timeDiff = now - lastBlockTime;
      
      // Track block times for network health
      setTransactionHistory(prev => {
        const newHistory = [...prev, { block: Number(blockNumber), time: now, timeDiff }];
        // Keep only last 10 blocks
        return newHistory.slice(-10);
      });
      
      setLastBlockTime(now);
    }
  }, [blockNumber, lastBlockTime]);

  const calculateNetworkHealth = () => {
    if (transactionHistory.length < 2) return 100;
    
    const avgBlockTime = transactionHistory
      .slice(1) // Skip first entry (no time diff)
      .reduce((sum, entry) => sum + entry.timeDiff, 0) / (transactionHistory.length - 1);
    
    // Ethereum average is ~12 seconds (12000ms)
    // Score based on how close to expected block time
    const expectedBlockTime = 12000;
    const deviation = Math.abs(avgBlockTime - expectedBlockTime) / expectedBlockTime;
    
    let score = 100 - (deviation * 100);
    return Math.max(10, Math.min(100, score));
  };

  const getNetworkStatus = (score) => {
    if (score >= 90) return { label: "Excellent", color: "green" };
    if (score >= 75) return { label: "Good", color: "blue" };
    if (score >= 50) return { label: "Fair", color: "yellow" };
    return { label: "Poor", color: "red" };
  };

  const score = Math.round(calculateNetworkHealth());
  const status = getNetworkStatus(score);

  return {
    score,
    status: status.label,
    color: status.color,
    avgBlockTime: transactionHistory.length > 1 
      ? Math.round(transactionHistory.slice(1).reduce((sum, entry) => sum + entry.timeDiff, 0) / (transactionHistory.length - 1) / 1000)
      : 12,
    recentBlocks: transactionHistory.slice(-5)
  };
}

// Hook for real-time ecosystem health
export function useEcosystemHealth() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: vestingAddresses } = useVestingAddresses();
  const { distributedSupply, circulatingSupply, walletBalances } = useRealTokenomicsData();

  const calculateEcosystemScore = () => {
    let score = 0;
    const totalSupplyNum = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
    const maxSupplyNum = maxSupply ? parseFloat(formatEther(maxSupply)) : 0;
    
    // Supply utilization health (0-30 points)
    const supplyUtilization = maxSupplyNum > 0 ? (totalSupplyNum / maxSupplyNum) : 0;
    if (supplyUtilization > 0 && supplyUtilization < 0.9) {
      score += Math.min(30, supplyUtilization * 30);
    }
    
    // Token distribution health (0-25 points)
    const totalDistributed = Object.values(walletBalances).reduce((sum, balance) => sum + balance, 0);
    if (totalSupplyNum > 0) {
      const distributionRatio = circulatingSupply / totalSupplyNum;
      // Healthy if 20-80% is circulating
      if (distributionRatio >= 0.2 && distributionRatio <= 0.8) {
        score += 25;
      } else {
        score += Math.max(0, 25 - Math.abs(distributionRatio - 0.5) * 50);
      }
    }
    
    // Vesting system activity (0-25 points)
    const vestingCount = vestingAddresses?.length || 0;
    if (vestingCount > 0) {
      score += Math.min(25, vestingCount * 5); // Up to 5 vestings for full score
    }
    
    // Wallet diversity (0-20 points) - simplified
    const nonZeroWallets = Object.values(walletBalances).filter(balance => balance > 0).length;
    score += Math.min(20, nonZeroWallets * 4);
    
    return Math.min(100, Math.round(score));
  };

  const getEcosystemStatus = (score) => {
    if (score >= 90) return { label: "Thriving", color: "green" };
    if (score >= 75) return { label: "Healthy", color: "blue" };
    if (score >= 50) return { label: "Growing", color: "yellow" };
    return { label: "Developing", color: "red" };
  };

  const score = calculateEcosystemScore();
  const status = getEcosystemStatus(score);

  return {
    score,
    status: status.label,
    color: status.color,
    metrics: {
      totalSupply: totalSupply ? parseFloat(formatEther(totalSupply)) : 0,
      circulatingSupply,
      distributedSupply,
      vestingCount: vestingAddresses?.length || 0,
      activeWallets: Object.values(walletBalances).filter(balance => balance > 0).length
    }
  };
}

// Combined health hook
export function useOverallHealth() {
  const security = useSecurityHealth();
  const network = useNetworkHealth();
  const ecosystem = useEcosystemHealth();

  const overallScore = Math.round((security.score + network.score + ecosystem.score) / 3);
  
  const getOverallStatus = (score) => {
    if (score >= 90) return { label: "Excellent", color: "green" };
    if (score >= 75) return { label: "Good", color: "blue" };
    if (score >= 50) return { label: "Fair", color: "yellow" };
    return { label: "Needs Attention", color: "red" };
  };

  const status = getOverallStatus(overallScore);

  return {
    overall: {
      score: overallScore,
      status: status.label,
      color: status.color
    },
    security,
    network,
    ecosystem
  };
}
