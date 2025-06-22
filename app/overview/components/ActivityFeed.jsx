"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Flame,
  Droplet,
  Gift,
  Clock,
  Settings2,
  ExternalLink,
} from "lucide-react";

const mockEvents = [
  {
    type: "Transfer",
    from: "0x123...abcd",
    to: "0x456...def0",
    amount: "5000000000000000000",
    timestamp: 1719051000000,
    txHash: "0xaaa111...",
  },
  {
    type: "Burn",
    from: "0x456...def0",
    amount: "1000000000000000000",
    timestamp: 1719040000000,
    txHash: "0xbbb222...",
  },
  {
    type: "FaucetClaimed",
    to: "0x789...cafe",
    amount: "2000000000000000000",
    timestamp: 1719030000000,
    txHash: "0xccc333...",
  },
  {
    type: "AirdropClaimed",
    to: "0xabc...1234",
    amount: "10000000000000000000",
    timestamp: 1719020000000,
    txHash: "0xddd444...",
  },
  {
    type: "VestingReleased",
    beneficiary: "0xdef...5678",
    amount: "3000000000000000000",
    timestamp: 1719010000000,
    txHash: "0xeee555...",
  },
  {
    type: "TokenomicsInitialized",
    timestamp: 1719000000000,
    txHash: "0xfff666...",
  },
];

const eventTypes = [
  "All",
  "Transfer",
  "Burn",
  "FaucetClaimed",
  "AirdropClaimed",
  "VestingReleased",
  "TokenomicsInitialized",
];

export default function ActivityFeed() {
  const [filter, setFilter] = useState("All");

  const filteredEvents =
    filter === "All"
      ? mockEvents
      : mockEvents.filter((e) => e.type === filter);

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={filter} onValueChange={setFilter} className="mb-4">
          <TabsList className="flex flex-wrap justify-start gap-2 overflow-x-auto">
            {eventTypes.map((type) => (
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
                    {event.type === "Burn" && <Flame className="text-red-500 w-5 h-5" />}
                    {event.type === "FaucetClaimed" && <Droplet className="text-green-500 w-5 h-5" />}
                    {event.type === "AirdropClaimed" && <Gift className="text-pink-500 w-5 h-5" />}
                    {event.type === "VestingReleased" && <Clock className="text-yellow-500 w-5 h-5" />}
                    {event.type === "TokenomicsInitialized" && <Settings2 className="text-purple-500 w-5 h-5" />}
                  </span>

                  <div className="text-sm leading-snug">
                    {event.type === "Transfer" && (
                      <>
                        <strong>Transfer:</strong> {Number(event.amount) / 1e18} 2LYP from <code>{event.from}</code> to <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "Burn" && (
                      <>
                        <strong>Burn:</strong> {Number(event.amount) / 1e18} 2LYP by <code>{event.from}</code>
                      </>
                    )}
                    {event.type === "FaucetClaimed" && (
                      <>
                        <strong>Faucet Claim:</strong> {Number(event.amount) / 1e18} 2LYP to <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "AirdropClaimed" && (
                      <>
                        <strong>Airdrop:</strong> {Number(event.amount) / 1e18} 2LYP claimed by <code>{event.to}</code>
                      </>
                    )}
                    {event.type === "VestingReleased" && (
                      <>
                        <strong>Vesting:</strong> {Number(event.amount) / 1e18} 2LYP released to <code>{event.beneficiary}</code>
                      </>
                    )}
                    {event.type === "TokenomicsInitialized" && (
                      <>
                        <strong>Tokenomics Initialized</strong> – setup complete
                      </>
                    )}
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      {new Date(event.timestamp).toLocaleString()}
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
