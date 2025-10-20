"use client";

import { useState, useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { formatEther } from "viem";
import { useTotalSupply } from "./useOverviewStats";
import { useRealTokenomicsData } from "./useRealData";

// Hook for real-time growth tracking
export function useGrowthMetrics() {
  const { data: totalSupply } = useTotalSupply();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { circulatingSupply } = useRealTokenomicsData();
  
  const [growthHistory, setGrowthHistory] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track supply changes over time
  useEffect(() => {
    if (totalSupply && blockNumber && isClient) {
      const currentSupply = parseFloat(formatEther(totalSupply));
      const timestamp = Date.now();
      const blockNum = Number(blockNumber);
      
      setGrowthHistory(prev => {
        const existingIndex = prev.findIndex(entry => entry.block === blockNum);
        
        if (existingIndex >= 0) {
          // Update existing entry
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            supply: currentSupply,
            circulatingSupply,
            timestamp
          };
          return updated;
        } else {
          // Add new entry
          const newEntry = {
            block: blockNum,
            supply: currentSupply,
            circulatingSupply,
            timestamp,
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString()
          };
          
          const newHistory = [...prev, newEntry];
          // Keep only last 50 entries to avoid memory issues
          return newHistory.slice(-50);
        }
      });
    }
  }, [totalSupply, blockNumber, circulatingSupply, isClient]);

  // Calculate growth rates
  const getGrowthRate = (period = 24) => {
    if (growthHistory.length < 2) return 0;
    
    const now = Date.now();
    const periodStart = now - (period * 60 * 60 * 1000); // period in hours
    
    const recentEntries = growthHistory.filter(entry => entry.timestamp >= periodStart);
    if (recentEntries.length < 2) return 0;
    
    const earliest = recentEntries[0];
    const latest = recentEntries[recentEntries.length - 1];
    
    if (earliest.supply === 0) return 0;
    
    return ((latest.supply - earliest.supply) / earliest.supply) * 100;
  };

  // Get transaction/activity metrics
  const getActivityMetrics = () => {
    if (growthHistory.length < 2) return { transactionsPerHour: 0, avgGrowthPerBlock: 0 };
    
    const recentEntries = growthHistory.slice(-10); // Last 10 blocks
    const timeSpan = recentEntries.length > 1 
      ? recentEntries[recentEntries.length - 1].timestamp - recentEntries[0].timestamp
      : 0;
    
    const supplyChanges = recentEntries.length > 1 
      ? recentEntries[recentEntries.length - 1].supply - recentEntries[0].supply
      : 0;
    
    return {
      transactionsPerHour: timeSpan > 0 ? Math.round((recentEntries.length / (timeSpan / 3600000)) * 10) / 10 : 0,
      avgGrowthPerBlock: recentEntries.length > 1 ? supplyChanges / (recentEntries.length - 1) : 0,
      totalBlocks: growthHistory.length,
      dataPoints: growthHistory.length
    };
  };

  // Format data for charts
  const getChartData = (points = 20) => {
    const recentData = growthHistory.slice(-points);
    return recentData.map((entry, index) => ({
      name: entry.date || `Block ${entry.block}`,
      block: entry.block,
      supply: Math.round(entry.supply),
      circulating: Math.round(entry.circulatingSupply || 0),
      timestamp: entry.timestamp,
      growth: index > 0 
        ? ((entry.supply - recentData[0].supply) / recentData[0].supply) * 100
        : 0
    }));
  };

  // Get velocity (rate of change)
  const getVelocity = () => {
    if (growthHistory.length < 3) return 0;
    
    const recent = growthHistory.slice(-3);
    const changes = [];
    
    for (let i = 1; i < recent.length; i++) {
      const change = recent[i].supply - recent[i-1].supply;
      changes.push(change);
    }
    
    return changes.length > 0 
      ? changes.reduce((sum, change) => sum + change, 0) / changes.length
      : 0;
  };

  // Growth trend analysis
  const getTrend = () => {
    const last24h = getGrowthRate(24);
    const last7d = getGrowthRate(24 * 7);
    const velocity = getVelocity();
    
    if (last24h > 5) return { direction: "up", strength: "strong", color: "green" };
    if (last24h > 1) return { direction: "up", strength: "moderate", color: "blue" };
    if (last24h > -1) return { direction: "stable", strength: "steady", color: "gray" };
    if (last24h > -5) return { direction: "down", strength: "moderate", color: "yellow" };
    return { direction: "down", strength: "strong", color: "red" };
  };

  const currentSupply = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
  const trend = getTrend();
  const activity = getActivityMetrics();

  return {
    currentSupply,
    circulatingSupply,
    growthHistory,
    chartData: getChartData(),
    growthRates: {
      last1h: getGrowthRate(1),
      last24h: getGrowthRate(24),
      last7d: getGrowthRate(24 * 7),
      last30d: getGrowthRate(24 * 30)
    },
    trend,
    activity,
    velocity: getVelocity(),
    isTracking: growthHistory.length > 0,
    dataPoints: growthHistory.length
  };
}

// Hook for supply velocity and momentum
export function useSupplyVelocity() {
  const { growthHistory } = useGrowthMetrics();
  
  const calculateMomentum = () => {
    if (growthHistory.length < 5) return { momentum: 0, direction: "neutral" };
    
    const recent = growthHistory.slice(-5);
    let momentum = 0;
    
    for (let i = 1; i < recent.length; i++) {
      const change = recent[i].supply - recent[i-1].supply;
      momentum += change;
    }
    
    const avgMomentum = momentum / (recent.length - 1);
    
    return {
      momentum: Math.round(avgMomentum * 1000) / 1000,
      direction: avgMomentum > 0 ? "positive" : avgMomentum < 0 ? "negative" : "neutral",
      strength: Math.abs(avgMomentum) > 1000 ? "high" : Math.abs(avgMomentum) > 100 ? "medium" : "low"
    };
  };

  const getVolatility = () => {
    if (growthHistory.length < 10) return 0;
    
    const recent = growthHistory.slice(-10);
    const changes = [];
    
    for (let i = 1; i < recent.length; i++) {
      const change = ((recent[i].supply - recent[i-1].supply) / recent[i-1].supply) * 100;
      changes.push(change);
    }
    
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / changes.length;
    
    return Math.sqrt(variance);
  };

  const momentum = calculateMomentum();
  const volatility = getVolatility();

  return {
    momentum: momentum.momentum,
    direction: momentum.direction,
    strength: momentum.strength,
    volatility: Math.round(volatility * 100) / 100,
    isStable: volatility < 1,
    prediction: momentum.direction === "positive" ? "growth" : momentum.direction === "negative" ? "decline" : "stable"
  };
}
