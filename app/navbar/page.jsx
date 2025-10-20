"use client";

import Link from "next/link";
import Image from "next/image";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
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

        {/* Wallet Connect Button */}
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
    </nav>
  );
}
