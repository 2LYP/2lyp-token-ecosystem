"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Globe, 
  Shield, 
  Zap,
  Heart,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function ModernFooter() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/2LYP/2LYP-Tokenomics",
      icon: Github,
      description: "Open Source Code"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/2LYP_Official",
      icon: Twitter,
      description: "Latest Updates"
    },
    {
      name: "Discord",
      url: "https://discord.gg/2LYP",
      icon: MessageCircle,
      description: "Community Chat"
    },
    {
      name: "Website",
      url: "https://2lyp.io",
      icon: Globe,
      description: "Official Site"
    }
  ];

  const quickStats = [
    {
      label: "Contract Verified",
      icon: Shield,
      status: "verified",
      color: "text-green-600"
    },
    {
      label: "Network",
      value: "Polygon Amoy",
      icon: Zap,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="w-full mt-8 space-y-6">
      {/* Quick Access Section */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to Get Started?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Join the 2LYP ecosystem and start earning tokens through our faucet, airdrops, and vesting programs.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button asChild size="lg" className="min-w-[140px]">
                <Link href="/faucet">🚰 Use Faucet</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[140px]">
                <Link href="/airdrop">🎁 Check Airdrop</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="min-w-[140px]">
                <Link href="/vesting">⏳ View Vesting</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Join Our Community
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-full">
                    <link.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{link.name}</p>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Status
            </h4>
            <div className="space-y-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  {stat.status && (
                    <Badge variant="default" className="bg-green-500">
                      ✓ {stat.status}
                    </Badge>
                  )}
                  {stat.value && (
                    <Badge variant="secondary">
                      {stat.value}
                    </Badge>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Contract Address</span>
                </div>
                <a
                  href="https://amoy.polygonscan.com/token/0x699D113717e562F35BC5949693a7c79745Aa60b2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono hover:underline text-blue-600"
                >
                  0x699D...60b2
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Footer */}
      <div className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          Built with <Heart className="w-4 h-4 text-red-500" /> for the 2LYP Community
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © 2025 2LYP Token Ecosystem. All rights reserved. | Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
