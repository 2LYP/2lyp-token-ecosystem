"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Coins,
  Droplet,
  Gift,
  Clock,
  Settings2,
  ExternalLink,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useFormattedEvents } from "@/hooks/read/useContractEvents";
import { formatDate } from "@/lib/dateUtils";

export default function ActivityFeed() {
  const [filter, setFilter] = useState("All");
  const [isClient, setIsClient] = useState(false);
  const realEvents = useFormattedEvents();

  // Avoid hydration mismatch by only rendering dynamic content on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredEvents =
    filter === "All"
      ? realEvents
      : realEvents.filter((e) => e.type === filter);

  const formatTimestamp = (timestamp) => {
    if (!isClient) return 'Loading...'; // Avoid SSR mismatch
    return formatDate(timestamp);
  };

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Activity Feed
          <Badge variant="secondary">Live</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={filter} onValueChange={setFilter} className="mb-4">
          <TabsList className="flex w-full flex-wrap justify-start gap-2 overflow-x-auto">
            {["All", "Transfer", "TokensMinted", "FaucetClaimed", "AirdropClaimed", "TokensReleased", "VestingAdded", "TokenomicsWalletsSet"].map((type) => (
              <TabsTrigger key={type} value={type}>
                {type === "All" ? "All Events" : type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ScrollArea className="h-64 w-full pr-2">
          <ul className="space-y-4">
            {filteredEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events to show.</p>
            ) : (
              filteredEvents.map((event, idx) => (
                <li key={idx} className="flex gap-3 items-start border-b pb-2">
                  <span className="pt-1">
                    {event.type === "Transfer" && <Send className="text-blue-500 w-5 h-5" />}
                    {event.type === "TokensMinted" && <Coins className="text-green-600 w-5 h-5" />}
                    {event.type === "FaucetClaimed" && <Droplet className="text-green-500 w-5 h-5" />}
                    {event.type === "AirdropClaimed" && <Gift className="text-pink-500 w-5 h-5" />}
                    {event.type === "TokensReleased" && <Clock className="text-yellow-500 w-5 h-5" />}
                    {event.type === "VestingAdded" && <UserPlus className="text-purple-500 w-5 h-5" />}
                    {event.type === "TokenomicsWalletsSet" && <Wallet className="text-indigo-500 w-5 h-5" />}
                  </span>

                  <div className="text-sm leading-snug">
                    {event.type === "Transfer" && (
                      <>
                        <strong>Transfer:</strong> {Number(event.amount) / 1e18} 2LYP from <code>{event.from}</code> to <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "TokensMinted" && (
                      <>
                        <strong>Tokens Minted:</strong> {Number(event.amount) / 1e18} 2LYP to <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "FaucetClaimed" && (
                      <>
                        <strong>Faucet Claim:</strong> {Number(event.amount) / 1e18} 2LYP claimed by <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "AirdropClaimed" && (
                      <>
                        <strong>Airdrop:</strong> {Number(event.amount) / 1e18} 2LYP claimed by <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "TokensReleased" && (
                      <>
                        <strong>Vesting Release:</strong> {Number(event.amount) / 1e18} 2LYP released to <code>{event.beneficiary}</code>
                      </>
                    )}
                    {event.type === "VestingAdded" && (
                      <>
                        <strong>New Vesting:</strong> {Number(event.amount) / 1e18} 2LYP schedule created for <code>{event.beneficiary}</code>
                      </>
                    )}
                    {event.type === "TokenomicsWalletsSet" && (
                      <>
                        <strong>Tokenomics Setup:</strong> Wallet addresses configured for token distribution
                      </>
                    )}
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      {formatTimestamp(event.timestamp)}
                      {event.txHash && (
                        <a
                          href={`https://amoy.polygonscan.com/tx/${event.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 flex items-center gap-1 hover:underline"
                        >
                          View&nbsp;<ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
