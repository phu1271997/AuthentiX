"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthentixStore } from "@/lib/store";
import { truncateAddress } from "@/lib/utils";
import { ShieldCheck, Coins, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { userBalance, claimedStarter, claimStarterTokens, userAddress, connectWallet, refreshState } = useAuthentixStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    setMounted(true);
    connectWallet().then(() => refreshState());
  }, [connectWallet, refreshState]);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await claimStarterTokens();
      alert(res.message);
    } catch (err: any) {
      alert("Error: " + (err.message || err));
    } finally {
      setClaiming(false);
    }
  };

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Authenticate", href: "/submit" },
  ];

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-gold/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <span className="font-serif text-2xl font-bold tracking-wider text-gold">AuthentiX</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <ShieldCheck className="h-8 w-8 text-gold transition-transform group-hover:scale-110" />
              <span className="font-serif text-2xl font-bold tracking-wider text-gold group-hover:text-gold-light transition-colors">
                AuthentiX
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-gold ${
                    isActive ? "text-gold border-b-2 border-gold pb-1" : "text-foreground/75"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Wallet and Auth Info */}
          <div className="hidden md:flex items-center space-x-4">
            {!claimedStarter ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs font-semibold uppercase tracking-wider rounded-lg group bg-gradient-to-br from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB] group-hover:from-[#AA7C11] group-hover:to-[#F3E5AB] hover:text-background text-foreground focus:ring-2 focus:outline-none focus:ring-gold/30 cursor-pointer disabled:opacity-50"
              >
                <span className="relative px-3 py-1.5 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0 font-medium">
                  {claiming ? "Claiming..." : "Claim 100 $AUTH"}
                </span>
              </button>
            ) : null}

            {/* Token Balance */}
            <div className="flex items-center space-x-2 bg-emerald/10 border border-emerald/30 px-3 py-1.5 rounded-full text-emerald text-sm font-semibold">
              <Coins className="h-4 w-4 text-gold animate-pulse" />
              <span className="font-mono text-gold-light">{userBalance} $AUTH</span>
            </div>

            {/* Address */}
            <button
              onClick={() => connectWallet()}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-gold/20 bg-background/50 hover:bg-gold/10 text-foreground/80 hover:text-gold transition-colors"
            >
              {userAddress ? truncateAddress(userAddress) : "Connect Wallet"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-gold hover:bg-gold/5"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 border-b border-gold/10 px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium tracking-wide uppercase ${
                  pathname === link.href ? "text-gold bg-gold/5" : "text-foreground/75"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gold/10 pt-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-foreground/70">Balance:</span>
              </div>
              <span className="font-mono font-semibold text-gold">{userBalance} $AUTH</span>
            </div>
            
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-foreground/70">Wallet:</span>
              <button
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
                className="font-mono text-xs text-foreground/80 hover:text-gold"
              >
                {userAddress ? truncateAddress(userAddress) : "Connect Wallet"}
              </button>
            </div>

            {!claimedStarter && (
              <button
                onClick={() => {
                  handleClaim();
                  setMobileMenuOpen(false);
                }}
                disabled={claiming}
                className="w-full py-2 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-background font-semibold rounded-md text-sm uppercase tracking-wider text-center disabled:opacity-50"
              >
                {claiming ? "Claiming..." : "Claim 100 $AUTH"}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
