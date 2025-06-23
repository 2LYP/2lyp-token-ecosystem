"use client";
import { useReadContract, useWriteContract, usePrepareContractWrite, useAccount } from "wagmi";
import { CONTRACT_ABI,CONTRACT_ADDRESS } from "@/lib/constants";

import { useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";

// Read faucet drip value
export function useFaucetDrip() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "faucetDrip",
  });
}

// Read faucet cooldown
export function useFaucetCooldown() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "faucetCoolDown",
  });
}

// Read airdrop data (per address)
export function useAirdropInfo(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "airdropList",
    args: [address],
  });
}

// Read vesting info (per address)
export function useVestingInfo(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "vestingList",
    args: [address],
  });
}

// Read getVestedAmount (returns [vested, unreleased])
export function useGetVestedAmount(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getVestedAmount",
    args: [address],
  });
}

// Check if tokenomics initialized
export function useTokenomicsStatus() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "tokenomicsInitialized",
  });
}

// initTokenomics (no args)
export function useInitTokenomics() {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "initTokenomics",
  });
}

// setAirdropList (address[], uint256[])
export function useSetAirdropList(addresses, amounts) {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "setAirdropList",
    args: [addresses, amounts],
  });
}


// updateFaucetSettings(uint256 drip, uint256 cooldown)
export function useUpdateFaucetSettings(drip, cooldown) {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "updateFaucetSettings",
    args: [drip, cooldown],
  });
}

// addVesting(address, amount, cliff, duration)
export function useAddVesting(beneficiary, amount, cliff, duration) {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "addVesting",
    args: [beneficiary, amount, cliff, duration],
  });
}

// rescueERC20(address token, uint256 amount, address to)
export function useRescueERC20(token, amount, to) {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "rescueERC20",
    args: [token, amount, to],
  });
}

// faucetMint (no args)
export function useFaucetMint() {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "faucetMint",
  });
}

// claimAirDrop (no args)
export function useClaimAirdrop() {
  return useWriteContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "claimAirDrop",
  });
}