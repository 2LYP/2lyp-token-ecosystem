"use client";

import { useReadContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

export function useTotalSupply() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "totalSupply",
    watch: true,
  });
}

export function useMaxSupply() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "MAX_SUPPLY",
  });
}

export function useFaucetDrip() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "faucetDrip",
  });
}

export function useFaucetCooldown() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "faucetCoolDown",
  });
}

export function useTokenomicsStatus() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "tokenomicsInitialized",
  });
}

export function useOwner() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "owner",
  });
}

// Burn functionality removed from contract
// export function useTotalBurned() {
//   return useReadContract({
//     address: CONTRACT_ADDRESS,
//     abi: CONTRACT_ABI,
//     functionName: 'totalBurned',
//     watch: true,
//   });
// }

export function useTokenName() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "name",
  });
}

export function useTokenSymbol() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "symbol",
  });
}

export function useTokenDecimals() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "decimals",
  });
}

export function usePausedStatus() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "paused",
    watch: true,
  });
}

export function useTeamWallet() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "teamWallet",
  });
}

export function useInvestorWallet() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "investorWallet",
  });
}

export function useAirdropWallet() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "airdropWallet",
  });
}

export function useTreasuryWallet() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "treasuryWallet",
  });
}

export function useClientWallet() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "clientWallet",
  });
}

export function useVestingAddresses() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getAllVestingAddresses",
    watch: true,
  });
}

export function useVestingInfo(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "vestingList",
    args: address ? [address] : undefined,
    enabled: !!address,
  });
}

export function useVestedAmount(beneficiary) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getVestedAmount",
    args: beneficiary ? [beneficiary] : undefined,
    enabled: !!beneficiary,
    watch: true,
  });
}

export function useAirdropInfo(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "airdropList",
    args: address ? [address] : undefined,
    enabled: !!address,
  });
}

export function useLastFaucetClaim(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "lastFaucetClaim",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });
}

export function useUserBalance(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });
}
