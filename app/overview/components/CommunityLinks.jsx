"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Globe, BookOpen } from "lucide-react";

import {
  FaTwitter,
  FaGithub,
  FaDiscord,
  FaTelegramPlane,
} from "react-icons/fa";

const links = [
  {
    name: "Website",
    icon: <Globe className="w-5 h-5" />,
    href: "https://2lyp.xyz",
  },
  {
    name: "Twitter(soon!)",
    icon: <FaTwitter className="w-5 h-5 text-blue-500" />,
    href: "https://twitter.com/2lyp",
  },
  {
    name: "GitHub",
    icon: <FaGithub className="w-5 h-5" />,
    href: "https://github.com/2lyp",
  },
  {
    name: "Docs",
    icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
    href: "https://github.com/2LYP/2lyp-token-ecosystem/blob/main/2LYP_Tokenomics%20(1).pdf",
  },
  {
    name: "Discord(soon!)",
    icon: <FaDiscord className="w-5 h-5 text-indigo-500" />,
    href: "https://discord.gg/2lyp",
  },
  {
    name: "Telegram(soon!)",
    icon: <FaTelegramPlane className="w-5 h-5 text-sky-400" />,
    href: "https://t.me/lyptoken",
  },
];

export default function CommunityLinks() {
  return (
    <Card id="community" className="w-full rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Join the 2LYP Community</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition"
            >
              {link.icon}
              <span className="text-sm font-medium">{link.name}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
