"use client";

import { useReadContract, useBalance } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import { 
  useVestingAddresses, 
  useVestingInfo, 
  useVestedAmount, 
  useTotalSupply, 
  useMaxSupply,
  useTokenomicsStatus,
  useTeamWallet,
  useInvestorWallet,
  useAirdropWallet,
  useTreasuryWallet,
  useClientWallet
} from "./useOverviewStats";

// Hook to get real tokenomics data
export function useRealTokenomicsData() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { data: teamWallet } = useTeamWallet();
  const { data: investorWallet } = useInvestorWallet();
  const { data: airdropWallet } = useAirdropWallet();
  const { data: treasuryWallet } = useTreasuryWallet();
  const { data: clientWallet } = useClientWallet();

  // Always call useBalance hooks with consistent addresses to avoid hook order issues
  const { data: teamBalance } = useBalance({
    address: teamWallet || "0x0000000000000000000000000000000000000000",
    token: CONTRACT_ADDRESS,
    query: { enabled: !!teamWallet },
  });

  const { data: investorBalance } = useBalance({
    address: investorWallet || "0x0000000000000000000000000000000000000000",
    token: CONTRACT_ADDRESS,
    query: { enabled: !!investorWallet },
  });

  const { data: airdropBalance } = useBalance({
    address: airdropWallet || "0x0000000000000000000000000000000000000000",
    token: CONTRACT_ADDRESS,
    query: { enabled: !!airdropWallet },
  });

  const { data: treasuryBalance } = useBalance({
    address: treasuryWallet || "0x0000000000000000000000000000000000000000",
    token: CONTRACT_ADDRESS,
    query: { enabled: !!treasuryWallet },
  });

  const { data: clientBalance } = useBalance({
    address: clientWallet || "0x0000000000000000000000000000000000000000",
    token: CONTRACT_ADDRESS,
    query: { enabled: !!clientWallet },
  });

  // Calculate real distribution
  const totalSupplyNum = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
  const teamBalanceNum = teamBalance ? parseFloat(formatEther(teamBalance.value)) : 0;
  const investorBalanceNum = investorBalance ? parseFloat(formatEther(investorBalance.value)) : 0;
  const airdropBalanceNum = airdropBalance ? parseFloat(formatEther(airdropBalance.value)) : 0;
  const treasuryBalanceNum = treasuryBalance ? parseFloat(formatEther(treasuryBalance.value)) : 0;
  const clientBalanceNum = clientBalance ? parseFloat(formatEther(clientBalance.value)) : 0;

  // Locked/Reserved supply = Team + Investor + Treasury (these are typically locked/vested)
  const lockedSupply = teamBalanceNum + investorBalanceNum + treasuryBalanceNum;
  
  // Distributed supply = All official wallets
  const distributedSupply = teamBalanceNum + investorBalanceNum + airdropBalanceNum + treasuryBalanceNum + clientBalanceNum;
  
  // Circulating supply = Total - Locked (Team, Investor, Treasury are locked, but Airdrop and Client might be circulating)
  const circulatingSupply = totalSupplyNum - lockedSupply;

  return {
    totalSupply: totalSupplyNum,
    distributedSupply,
    lockedSupply,
    circulatingSupply,
    walletBalances: {
      team: teamBalanceNum,
      investor: investorBalanceNum,
      airdrop: airdropBalanceNum,
      treasury: treasuryBalanceNum,
      client: clientBalanceNum,
    },
    tokenomicsData: [
      { name: 'Team & Founders', value: teamBalanceNum, percentage: totalSupplyNum > 0 ? (teamBalanceNum / totalSupplyNum) * 100 : 0, status: 'locked' },
      { name: 'Investors', value: investorBalanceNum, percentage: totalSupplyNum > 0 ? (investorBalanceNum / totalSupplyNum) * 100 : 0, status: 'locked' },
      { name: 'Community & Airdrop', value: airdropBalanceNum, percentage: totalSupplyNum > 0 ? (airdropBalanceNum / totalSupplyNum) * 100 : 0, status: 'circulating' },
      { name: 'Treasury', value: treasuryBalanceNum, percentage: totalSupplyNum > 0 ? (treasuryBalanceNum / totalSupplyNum) * 100 : 0, status: 'locked' },
      { name: 'Client Allocation', value: clientBalanceNum, percentage: totalSupplyNum > 0 ? (clientBalanceNum / totalSupplyNum) * 100 : 0, status: 'circulating' },
      { name: 'Public Circulating', value: circulatingSupply, percentage: totalSupplyNum > 0 ? (circulatingSupply / totalSupplyNum) * 100 : 0, status: 'circulating' },
    ],
  };
}

// Hook to get real vesting data
export function useRealVestingData() {
  const { data: vestingAddresses } = useVestingAddresses();
  const { data: totalSupply } = useTotalSupply();
  const { lockedSupply, walletBalances } = useRealTokenomicsData();

  const vestingCount = vestingAddresses?.length || 0;
  const currentSupply = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;

  // More realistic vesting calculations based on actual locked supply
  // Assume vesting represents locked Team + Investor allocations
  const totalAllocated = lockedSupply || (currentSupply * 0.4); // 40% of supply typically locked in vesting
  
  // Calculate vested amount based on team and investor balances
  const teamVested = walletBalances?.team || 0;
  const investorVested = walletBalances?.investor || 0;
  const totalVested = teamVested + investorVested;
  
  const totalRemaining = Math.max(totalAllocated - totalVested, 0);
  
  // Calculate vesting progress
  const vestingProgress = totalAllocated > 0 ? (totalVested / totalAllocated) * 100 : 0;

  return {
    vestingAddresses: vestingAddresses || [],
    totalAllocated,
    totalVested,
    totalRemaining,
    vestingCount,
    vestingProgress,
    vestingData: [
      { 
        name: 'Team Vesting', 
        allocated: totalAllocated * 0.6, 
        vested: teamVested, 
        remaining: (totalAllocated * 0.6) - teamVested,
        progress: totalAllocated > 0 ? (teamVested / (totalAllocated * 0.6)) * 100 : 0
      },
      { 
        name: 'Investor Vesting', 
        allocated: totalAllocated * 0.4, 
        vested: investorVested, 
        remaining: (totalAllocated * 0.4) - investorVested,
        progress: totalAllocated > 0 ? (investorVested / (totalAllocated * 0.4)) * 100 : 0
      },
    ],
    allocationData: [
      { name: 'Total Allocated', allocated: totalAllocated, vested: totalVested, remaining: totalRemaining },
    ],
  };
}

// Hook for supply metrics
export function useSupplyMetrics() {
  const { data: totalSupply } = useTotalSupply();
  const { data: maxSupply } = useMaxSupply();
  const { totalSupply: realTotalSupply, circulatingSupply } = useRealTokenomicsData();

  const totalSupplyNum = totalSupply ? parseFloat(formatEther(totalSupply)) : 0;
  const maxSupplyNum = maxSupply ? parseFloat(formatEther(maxSupply)) : 0;
  const remainingSupply = maxSupplyNum - totalSupplyNum;
  const supplyUtilization = maxSupplyNum > 0 ? (totalSupplyNum / maxSupplyNum) * 100 : 0;

  return {
    totalSupply: totalSupplyNum,
    maxSupply: maxSupplyNum,
    remainingSupply,
    circulatingSupply,
    supplyUtilization,
    isMaxSupplyReached: remainingSupply <= 0,
  };
}
