"use client";

import { ExternalLink, Shield, Cpu } from "lucide-react";

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x52f3f4FbA76BF059968450b95af77731349EDA32";

const STUDIO_URL = `https://studio.genlayer.com/run-debug`;

export default function ContractInfoFooter() {
  return (
    <footer className="border-t border-gold/10 bg-[#0A0908]/80 backdrop-blur-sm py-6 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Contract Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-[10px] font-mono text-foreground/40">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-gold/60" />
              <span className="text-foreground/50">Contract:</span>
              <span className="text-gold/80 select-all">{CONTRACT_ADDRESS}</span>
            </div>
            <span className="hidden sm:inline text-gold/20">|</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-gold/60" />
              <span className="text-foreground/50">Class:</span>
              <span className="text-gold/80">AuthentiX</span>
            </div>
            <span className="hidden sm:inline text-gold/20">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-foreground/50">Network:</span>
              <span className="text-emerald-500/80">studionet</span>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <a
              href={STUDIO_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-foreground/40 hover:text-gold transition-colors"
            >
              <span>GenLayer Studio</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <a
              href="https://github.com/phu1271997/AuthentiX"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-foreground/40 hover:text-gold transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
            <span className="text-foreground/25">© 2026 AuthentiX Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
