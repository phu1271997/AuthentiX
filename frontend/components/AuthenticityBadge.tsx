"use client";

import { ShieldCheck, AlertTriangle, Skull, HelpCircle } from "lucide-react";

interface AuthenticityBadgeProps {
  status: "PENDING" | "AUTHENTIC" | "COUNTERFEIT" | "INCONCLUSIVE" | "STOLEN_FLAGGED";
  size?: "sm" | "md" | "lg";
}

export default function AuthenticityBadge({ status, size = "md" }: AuthenticityBadgeProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs border-[1.5px]",
    md: "px-4 py-2 text-sm border-2",
    lg: "px-6 py-3 text-lg border-3 tracking-widest",
  };

  const currentSize = sizeClasses[size];

  switch (status) {
    case "AUTHENTIC":
      return (
        <span
          className={`inline-flex items-center space-x-2 font-serif font-bold uppercase rounded border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] ${currentSize}`}
          style={{ textShadow: "0 0 8px rgba(16,185,129,0.4)" }}
        >
          <ShieldCheck className={size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4.5 w-4.5" : "h-6 w-6"} />
          <span>VERIFIED AUTHENTIC</span>
        </span>
      );

    case "COUNTERFEIT":
      return (
        <span
          className={`inline-flex items-center space-x-2 font-serif font-bold uppercase rounded border-red-500/30 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] ${currentSize}`}
          style={{ textShadow: "0 0 8px rgba(239,68,68,0.4)" }}
        >
          <AlertTriangle className={size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4.5 w-4.5" : "h-6 w-6"} />
          <span>COUNTERFEIT FAKE</span>
        </span>
      );

    case "INCONCLUSIVE":
      return (
        <span
          className={`inline-flex items-center space-x-2 font-serif font-bold uppercase rounded border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] ${currentSize}`}
          style={{ textShadow: "0 0 8px rgba(245,158,11,0.4)" }}
        >
          <HelpCircle className={size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4.5 w-4.5" : "h-6 w-6"} />
          <span>INCONCLUSIVE</span>
        </span>
      );

    case "STOLEN_FLAGGED":
      return (
        <span
          className={`inline-flex items-center space-x-2 font-serif font-bold uppercase rounded border-red-600/50 bg-red-600/20 text-red-600 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.3)] ${currentSize}`}
          style={{ textShadow: "0 0 10px rgba(220,38,38,0.6)" }}
        >
          <Skull className={size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4.5 w-4.5" : "h-6 w-6"} />
          <span>STOLEN ASSET</span>
        </span>
      );

    case "PENDING":
    default:
      return (
        <span
          className={`inline-flex items-center space-x-2 font-mono font-medium rounded border-gold/30 bg-gold/5 text-gold animate-pulse ${currentSize}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
          </span>
          <span>Consensus Pending...</span>
        </span>
      );
  }
}
