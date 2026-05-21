"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, Sparkles, Scale, RefreshCw, Layers, Check, X, ShieldAlert, BadgeHelp } from "lucide-react";
import { useState, useEffect } from "react";
import { formatUSD } from "@/lib/utils";

export default function Home() {
  const [tickerVal, setTickerVal] = useState(1480290);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerVal((prev) => prev + Math.floor(Math.random() * 50) + 10);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-32 md:py-48 overflow-hidden bg-black">
        {/* Cinematic Backdrop Image */}
        <div className="absolute inset-0 z-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1600"
            alt="Rolex details backdrop"
            className="w-full h-full object-cover filter grayscale select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-gold animate-pulse">
            Introducing AuthentiX Protocol
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-extrabold tracking-wide text-foreground leading-[1.1] max-w-4xl mx-auto">
            Every Authentic. <br />
            Every Traceable. <br />
            <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              Forever On-Chain.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg font-light text-foreground/70 leading-relaxed">
            The world's first decentralized authentication protocol for luxury items and fine art. 
            AI-native forensic validators analyze micro-features and cross-reference databases using GenLayer Multi-Validator AI Consensus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB] text-background font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all text-center cursor-pointer"
            >
              Authenticate Item
            </Link>
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-8 py-3.5 border border-gold/30 hover:border-gold bg-zinc-950/20 hover:bg-gold/5 text-foreground rounded-lg font-bold text-xs uppercase tracking-widest transition-all text-center cursor-pointer"
            >
              Browse Registry
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-y border-gold/15 bg-zinc-950/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center divide-y md:divide-y-0 md:divide-x divide-gold/10">
            <div className="py-4 md:py-0">
              <span className="block font-serif text-3xl font-extrabold text-gold">$1.7 Trillion</span>
              <span className="block text-xs uppercase tracking-widest text-foreground/45 mt-1 font-mono">
                Global Counterfeit Market / Yr
              </span>
            </div>
            <div className="py-4 md:py-0">
              <span className="block font-serif text-3xl font-extrabold text-gold">10% - 30%</span>
              <span className="block text-xs uppercase tracking-widest text-foreground/45 mt-1 font-mono">
                Average Fake Rate in Luxury Resale
              </span>
            </div>
            <div className="py-4 md:py-0">
              <span className="block font-serif text-3xl font-extrabold text-foreground font-mono">
                {formatUSD(tickerVal)}
              </span>
              <span className="block text-xs uppercase tracking-widest text-foreground/45 mt-1 font-mono">
                Mock Assets Authenticated On-Chain
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
            Intelligent Consensus Authentication
          </h2>
          <p className="max-w-xl mx-auto text-xs uppercase tracking-widest text-gold font-mono">
            How AuthentiX Leverages GenLayer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "01",
              title: "Submit Visual Specs",
              desc: "Provide high-res photos and historical custody details. Lock 5 $AUTH anti-spam stake.",
              icon: Layers,
            },
            {
              step: "02",
              title: "AI Forensic Scraping",
              desc: "GenLayer validators read web data natively to inspect catalog dates, retail records, and hallmarks.",
              icon: Sparkles,
            },
            {
              step: "03",
              title: "Visual AI Consensus",
              desc: "Multi-validator AI algorithms evaluate visual features and vote on authenticity.",
              icon: Scale,
            },
            {
              step: "04",
              title: "NFT Mint & Payout",
              desc: "Verified item receives a museum-grade Certificate NFT, and the submitter claims a +10 $AUTH reward.",
              icon: Shield,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass p-6 rounded-xl relative space-y-4">
                <span className="absolute top-4 right-4 font-mono text-2xl font-black text-gold/15">
                  {item.step}
                </span>
                <div className="h-10 w-10 rounded-lg bg-gold/5 border border-gold/25 flex items-center justify-center text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                <p className="text-xs text-foreground/60 leading-relaxed font-light">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-24 bg-[#121110]/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
              The Evolution of Authentication
            </h2>
            <p className="max-w-xl mx-auto text-xs uppercase tracking-widest text-gold font-mono">
              Comparing Industry Alternatives
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gold/10 glass">
            <table className="w-full border-collapse text-left text-xs font-light text-foreground/80">
              <thead className="bg-[#1D1B18]/50 border-b border-gold/10 text-gold uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-5 font-bold">Feature</th>
                  <th className="p-5 font-bold">Traditional Houses</th>
                  <th className="p-5 font-bold">Centralized AI (Entrupy)</th>
                  <th className="p-5 font-bold text-foreground bg-gold/5">AuthentiX (GenLayer)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {[
                  {
                    name: "Decentralized Auditing",
                    trad: "No (Single company/expert bias)",
                    entr: "No (Black box algorithm)",
                    auth: "Yes (Multi-validator agreement)",
                    highlight: true,
                  },
                  {
                    name: "Turnaround Time",
                    trad: "3 - 7 Business Days",
                    entr: "24 - 48 Hours",
                    auth: "Under 10 Seconds",
                    highlight: true,
                  },
                  {
                    name: "Resale Royalty NFT Link",
                    trad: "No (Paper document only)",
                    entr: "No (Digital certificate app)",
                    auth: "Yes (On-Chain Certificate NFT)",
                    highlight: true,
                  },
                  {
                    name: "Web Database Scrape Check",
                    trad: "Manual lookup",
                    entr: "No integration",
                    auth: "Yes (Active web.render querying)",
                    highlight: true,
                  },
                  {
                    name: "Verification Fee",
                    trad: "$100 - $500",
                    entr: "$30 - $150 per lookup",
                    auth: "5 $AUTH Stake (Earn on Pass)",
                    highlight: true,
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/10">
                    <td className="p-5 font-semibold text-foreground">{row.name}</td>
                    <td className="p-5 text-foreground/60">{row.trad}</td>
                    <td className="p-5 text-foreground/60">{row.entr}</td>
                    <td className="p-5 font-medium text-gold-light bg-gold/[0.02] border-x border-gold/5">
                      {row.auth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 text-center max-w-4xl mx-auto px-4 space-y-8">
        <h2 className="font-serif text-3xl md:text-5xl font-extrabold tracking-wide">
          Secure Your Collection's Value
        </h2>
        <p className="max-w-xl mx-auto text-sm text-foreground/60 font-light leading-relaxed">
          Stolen checks, counterfeit flags, and ownership trails. AuthentiX ensures your high-value watches, designer bags, and art assets stay cryptographically traceable forever.
        </p>
        <div className="flex justify-center">
          <Link
            href="/submit"
            className="px-8 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-background font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
          >
            Authenticate an Item
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gold/10 bg-black/40 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/40 font-mono">
          <div>© 2026 AuthentiX Protocol. Built for GenLayer Intelligent Contract Hackathon.</div>
          <div className="flex space-x-6">
            <a href="https://portal.genlayer.foundation/" target="_blank" className="hover:text-gold transition-colors">
              GenLayer Foundation
            </a>
            <span className="text-gold/20">|</span>
            <span className="text-foreground/30">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
