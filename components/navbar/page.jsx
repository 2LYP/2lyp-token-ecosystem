"use client";

import Link from "next/link";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useUserBalance } from '@/hooks/read/useOverviewStats';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { CONTRACT_ADDRESS } from '@/lib/constants';

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [addStatus, setAddStatus] = useState('idle'); // idle | pending | success | error
  const [addError, setAddError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (addStatus === 'success' || addStatus === 'error') {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 5000); // auto hide after 5s
      return () => clearTimeout(t);
    }
  }, [addStatus]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  // Read user's 2LYP balance (pass undefined when not connected)
  const { data: navbarBalance } = useUserBalance(isConnected ? address : undefined);
  const navbarBalanceStr = !isConnected
    ? null
    : navbarBalance
      ? `${parseFloat(formatEther(navbarBalance)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 18 })} 2LYP`
      : 'Loading...';

  const handleAddToMetaMask = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setAddError('MetaMask not detected');
      setAddStatus('error');
      return;
    }
    setAddStatus('pending');
    setAddError(null);
    try {
      // Adjust decimals if not 18
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACT_ADDRESS,
            symbol: '2LYP',
            decimals: 18,
            image: `${window.location.origin}/2lyp-icon.png`,
          },
        },
      });
      if (wasAdded) {
        setAddStatus('success');
      } else {
        setAddStatus('error');
        setAddError('User rejected');
      }
    } catch (e) {
      setAddStatus('error');
      setAddError(e?.message || 'Failed to add token');
    }
  };

  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Title */}
        <Link href="/" className="text-xl flex gap-5 items-center font-bold tracking-tight">
          <Image src="/2lyp-icon.png" alt="2LYP Logo" width={40} height={40} />
          <p>2LYP Hub</p>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`hover:text-primary transition ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Overview
          </Link>

          <Link
            href="/faucet"
            className={`hover:text-primary transition ${
              pathname === "/actions" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Faucet
          </Link>

          <Link
            href="/airdrop"
            className={`hover:text-primary transition ${
              pathname === "/analytics" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Airdrop
          </Link>
          {/* <a
            href="/vesting"
            className="hover:text-primary text-muted-foreground transition"
          >
            Vesting
          </a> */}
          {/** Admin link: only visible when connected wallet is contract owner */}
          {isConnected && !isAdminLoading && isAdmin && (
            <Link
              href="/admin"
              className="hover:text-primary text-muted-foreground transition"
            >
              Admin Panel
            </Link>
          )}
          
          
        </div>

        {/* Wallet Connect Button + Balance */}
        <div className="flex items-center gap-3">
          {navbarBalanceStr && (
            <div className="hidden sm:block text-sm text-muted-foreground">
              <div className="font-medium">{navbarBalanceStr}</div>
            </div>
          )}
          {isConnected && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToMetaMask}
              disabled={addStatus === 'pending'}
            >
              {addStatus === 'pending' && 'Adding…'}
              {addStatus === 'success' && <span className="flex items-center"><Check className="h-4 w-4 mr-1" />Token Added</span>}
              {addStatus !== 'pending' && addStatus !== 'success' && 'Add to MetaMask'}
            </Button>
          )}
          {isConnected ? (
            <Button variant="outline" size="sm" onClick={() => disconnect()}>
              {shortAddress}
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={() => connect({ connector: injected() })}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
    {showToast && addStatus === 'error' && addError && (
      <div className="fixed bottom-2 right-2 text-xs px-3 py-2 bg-red-600 text-white rounded shadow flex items-center gap-3">
        <span>{addError}</span>
        <button onClick={() => setShowToast(false)} className="text-white/80 hover:text-white">✕</button>
      </div>
    )}
    {showToast && addStatus === 'success' && (
      <div className="fixed bottom-2 right-2 text-xs px-3 py-2 bg-green-600 text-white rounded shadow flex items-center gap-3">
        <span>Token added to MetaMask</span>
        <button onClick={() => setShowToast(false)} className="text-white/80 hover:text-white">✕</button>
      </div>
    )}
    </>
  );
}
