"use client";

import { useWatchContractEvent } from "wagmi";
import { useState, useEffect } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import { formatEther } from "viem";

export function useContractEvents() {
  const [events, setEvents] = useState([]);

  // Watch for Transfer events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'Transfer',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "Transfer",
        from: log.args.from,
        to: log.args.to,
        amount: log.args.value?.toString(),
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000, // Estimated timestamp
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50)); // Keep only latest 50 events
    },
  });

  // Watch for TokensMinted events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokensMinted',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "TokensMinted",
        to: log.args.to,
        amount: log.args.amount?.toString(),
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    },
  });

  // Watch for FaucetClaimed events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'FaucetClaimed',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "FaucetClaimed",
        to: log.args.user,
        amount: log.args.amount?.toString(),
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    },
  });

  // Watch for AirdropClaimed events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'AirdropClaimed',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "AirdropClaimed",
        to: log.args.user,
        amount: log.args.amount?.toString(),
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    },
  });

  // Watch for TokensReleased events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokensReleased',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "TokensReleased",
        beneficiary: log.args.beneficiary,
        amount: log.args.amount?.toString(),
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    },
  });

  // Watch for VestingAdded events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'VestingAdded',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "VestingAdded",
        beneficiary: log.args.beneficiary,
        amount: log.args.amount?.toString(),
        cliff: log.args.cliff?.toString(),
        duration: log.args.duration?.toString(),
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    },
  });

  // Watch for TokenomicsWalletsSet events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TokenomicsWalletsSet',
    onLogs(logs) {
      const newEvents = logs.map(log => ({
        type: "TokenomicsWalletsSet",
        team: log.args.team,
        investor: log.args.investor,
        airdrop: log.args.airdrop,
        treasury: log.args.treasury,
        client: log.args.client,
        timestamp: log.blockNumber ? log.blockNumber * 12000 + 1725446400000 : 1725446400000,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setEvents(prev => [...newEvents, ...prev].slice(0, 50));
    },
  });

  return { events, eventCount: events.length };
}

// Hook to get formatted events for the activity feed
export function useFormattedEvents() {
  const { events } = useContractEvents();
  
  // Create consistent timestamps for mock events to avoid hydration issues
  const baseTime = 1725446400000; // Fixed timestamp: September 4, 2025
  
  // Add some mock recent events if no real events are available yet
  const mockEvents = [
    {
      type: "Transfer",
      from: "0x123...abcd",
      to: "0x456...def0",
      amount: "5000000000000000000",
      timestamp: baseTime - 3600000, // 1 hour before base
      txHash: "0xaaa111...",
    },
    {
      type: "TokensMinted",
      to: "0x456...def0",
      amount: "1000000000000000000",
      timestamp: baseTime - 7200000, // 2 hours before base
      txHash: "0xbbb222...",
    },
    {
      type: "FaucetClaimed",
      to: "0x789...cafe",
      amount: "2000000000000000000",
      timestamp: baseTime - 10800000, // 3 hours before base
      txHash: "0xccc333...",
    },
  ];

  // Return real events if available, otherwise use mock events
  return events.length > 0 ? events : mockEvents;
}
