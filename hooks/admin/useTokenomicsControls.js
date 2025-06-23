'use client';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

// Check if tokenomics already initialized
export function useTokenomicsStatus() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'tokenomicsInitialized',
    watch: true,
  });
}

// Write function to initialize tokenomics
export function useInitTokenomics() {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'initTokenomics',
  });
}
