"use client";

import { truncateAddress } from "@/lib/utils";
import { User, ShieldCheck, Tag, HelpCircle, AlertTriangle } from "lucide-react";

interface ProvenanceTrailProps {
  provenance: string;
  submitter: string;
  created_at?: string;
  status: "PENDING" | "AUTHENTIC" | "COUNTERFEIT" | "INCONCLUSIVE" | "STOLEN_FLAGGED";
  certificate_id?: string;
}

export default function ProvenanceTrail({
  provenance,
  submitter,
  created_at,
  status,
  certificate_id,
}: ProvenanceTrailProps) {
  // Parse provenance entries
  const entries = provenance.split("|").map((entry) => entry.trim());
  const initialProvenanceText = entries[0];
  const transfers = entries.slice(1);

  const creationDate = created_at ? new Date(created_at) : new Date("2026-05-18");

  return (
    <div className="relative border-l-2 border-gold/15 ml-4 pl-8 py-2 space-y-8">
      {/* 1. Original Provenance Statement */}
      <div className="relative">
        {/* Timeline Dot */}
        <span className="absolute -left-12 top-1.5 flex items-center justify-center h-8 w-8 rounded-full bg-zinc-900 border border-gold/30 ring-8 ring-[#0A0908]">
          <HelpCircle className="h-4 w-4 text-gold-light" />
        </span>
        <div>
          <span className="font-serif text-sm font-semibold tracking-wider text-gold-light uppercase">
            Declared Provenance
          </span>
          <p className="mt-1 text-sm text-foreground/80 leading-relaxed max-w-2xl font-light">
            "{initialProvenanceText}"
          </p>
        </div>
      </div>

      {/* 2. Submission to AuthentiX */}
      <div className="relative">
        <span className="absolute -left-12 top-1.5 flex items-center justify-center h-8 w-8 rounded-full bg-zinc-900 border border-gold/30 ring-8 ring-[#0A0908]">
          <User className="h-4 w-4 text-gold-light" />
        </span>
        <div>
          <span className="font-serif text-sm font-semibold tracking-wider text-gold-light uppercase">
            Submitted for AI Auditing
          </span>
          <div className="mt-1 text-sm text-foreground/75 font-light">
            Registered on-chain by submitter:{" "}
            <span className="font-mono text-xs text-gold">{truncateAddress(submitter)}</span>
          </div>
          <div className="mt-0.5 text-xs text-foreground/40 font-mono">
            {creationDate.toLocaleDateString()} {creationDate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* 3. AI Jury Consensus Audit */}
      <div className="relative">
        <span
          className={`absolute -left-12 top-1.5 flex items-center justify-center h-8 w-8 rounded-full bg-zinc-900 border ring-8 ring-[#0A0908] ${
            status === "AUTHENTIC"
              ? "border-emerald-500/50"
              : status === "COUNTERFEIT"
              ? "border-red-500/50"
              : status === "INCONCLUSIVE"
              ? "border-amber-500/50"
              : "border-red-600/50 animate-pulse"
          }`}
        >
          {status === "AUTHENTIC" ? (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          ) : status === "COUNTERFEIT" ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : status === "INCONCLUSIVE" ? (
            <HelpCircle className="h-4 w-4 text-amber-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
        </span>
        <div>
          <span className="font-serif text-sm font-semibold tracking-wider text-gold-light uppercase">
            AI Jury Audit Completed
          </span>
          <div className="mt-1 text-sm text-foreground/80">
            {status === "AUTHENTIC" && (
              <span className="text-emerald-400 font-medium">
                Pass. Certificate NFT {certificate_id} minted.
              </span>
            )}
            {status === "COUNTERFEIT" && (
              <span className="text-red-500 font-medium">
                Fail. Counterfeit verification confirmed. 5 $AUTH stake burned.
              </span>
            )}
            {status === "INCONCLUSIVE" && (
              <span className="text-amber-500 font-medium">
                Audit inconclusive. Stake refunded. Expert review recommended.
              </span>
            )}
            {status === "STOLEN_FLAGGED" && (
              <span className="text-red-600 font-bold uppercase animate-pulse">
                Stolen Flagged Asset. Submitter blacklisted. Stake burned.
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-foreground/40 font-mono">
            {new Date(creationDate.getTime() + 6000).toLocaleDateString()}{" "}
            {new Date(creationDate.getTime() + 6000).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* 4. Subsequent Transfers (split by '|') */}
      {transfers.map((transferText, idx) => {
        const transferDate = new Date(creationDate.getTime() + (idx + 1) * 86400000); // simulate 1 day delay per transfer

        return (
          <div key={idx} className="relative">
            <span className="absolute -left-12 top-1.5 flex items-center justify-center h-8 w-8 rounded-full bg-zinc-900 border border-gold/30 ring-8 ring-[#0A0908]">
              <Tag className="h-4 w-4 text-gold-light" />
            </span>
            <div>
              <span className="font-serif text-sm font-semibold tracking-wider text-gold-light uppercase">
                Certificate Ownership Transferred
              </span>
              <p className="mt-1 text-sm text-foreground/80 leading-relaxed font-light">
                {transferText}
              </p>
              <div className="mt-0.5 text-xs text-foreground/40 font-mono">
                {transferDate.toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
