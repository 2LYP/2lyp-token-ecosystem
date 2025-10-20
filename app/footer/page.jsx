"use client";

import Link from "next/link";
import { Globe, BookOpen } from "lucide-react";
import {
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaTelegramPlane,
} from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    {
      name: "Website",
      icon: <Globe className="w-4 h-4" />,
      href: "https://2lyp.net",
    },
    {
      name: "Twitter(soon!)",
      icon: <FaTwitter className="w-4 h-4 text-blue-500" />,
      href: "https://twitter.com/2lyp",
    },
    {
      name: "GitHub",
      icon: <FaGithub className="w-4 h-4" />,
      href: "https://github.com/2lyp",
    },
    {
      name: "Docs",
      icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
      href: "https://github.com/2LYP/2LYP-Tokenomics",
    },
    {
      name: "Discord(soon!)",
      icon: <FaDiscord className="w-4 h-4 text-indigo-500" />,
      href: "https://discord.gg/2lyp",
    },
    {
      name: "Telegram(soon!)",
      icon: <FaTelegramPlane className="w-4 h-4 text-sky-400" />,
      href: "https://t.me/lyptoken",
    },
  ];

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Faucet", href: "/faucet" },
    { name: "Airdrop", href: "/airdrop" },
    { name: "Tokenomics", href: "https://github.com/2LYP/2lyp-token-ecosystem/blob/main/2LYP_Tokenomics%20(1).pdf" },
    { name: "Admin", href: "/admin" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-muted border-t py-10 px-6 mt-16">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
        {/* Brand Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold">2LYP Token</h2>
          <p className="text-sm text-muted-foreground">
            Powering decentralized loyalty and tokenomics with transparency,
            governance, and community.
          </p>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-2">Navigation</h3>
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link target="_blank" href={link.href} className="text-sm hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Legal</h3>
            <ul className="space-y-1">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Section */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Community</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-xs text-muted-foreground mt-10">
        © {new Date().getFullYear()} 2LYP Computations. All rights reserved.
      </div>
    </footer>
  );
}
