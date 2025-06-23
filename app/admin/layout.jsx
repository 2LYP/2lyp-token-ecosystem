"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings, Upload, SlidersHorizontal, BadgePlus, AlertTriangle, ShieldCheck,
} from "lucide-react";
import Navbar from "../navbar/page";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAccount } from "wagmi";

const navItems = [
  { label: "Tokenomics", href: "/admin/tokenomics", icon: <Settings size={18} /> },
  { label: "Airdrop", href: "/admin/airdrop", icon: <Upload size={18} /> },
  { label: "Faucet", href: "/admin/faucet", icon: <SlidersHorizontal size={18} /> },
  { label: "Vesting", href: "/admin/vesting", icon: <BadgePlus size={18} /> },
  { label: "Rescue", href: "/admin/rescue", icon: <AlertTriangle size={18} /> },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { isAdmin, isLoading } = useIsAdmin();
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return <p className="text-center py-10 text-red-500">⚠️ Please connect your wallet.</p>;
  }

  if (!isAdmin) {
  return (
    <div className="text-center py-10 space-y-4">
      <p className="text-red-500 text-lg font-medium">
        🚫 Access Denied. Only contract owner can view this panel.
      </p>
      <button
        onClick={() => (window.location.href = "/overview")}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Go back to Overview
      </button>
    </div>
  );
}


  return (
    <>
    <Navbar />
    <div className="flex min-h-screen">
      <aside className="w-64 p-6 border-r bg-white shadow-md hidden sm:block">
        <div className="font-bold text-lg mb-6 flex items-center gap-2">
          <ShieldCheck size={20} /> Admin Panel
        </div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.href
                  ? "bg-emerald-100 text-emerald-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-muted/20">{children}</main>
    </div>
    </>
  );
}
