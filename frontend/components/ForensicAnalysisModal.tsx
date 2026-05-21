"use client";

import { useEffect, useState } from "react";
import { useAuthentixStore } from "@/lib/store";
import { Item } from "@/lib/mockItems";
import AuthenticityBadge from "./AuthenticityBadge";
import { formatUSD } from "@/lib/utils";
import { 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  Activity, 
  RotateCcw,
  Search,
  ExternalLink,
  Share2,
  FileCheck,
  Coins
} from "lucide-react";
import Link from "next/link";

interface ForensicAnalysisModalProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
}

type Stage = "SCANNING" | "CROSS_REFERENCING" | "NEURAL_ANALYSIS" | "CONSENSUS_DRUMROLL" | "VERDICT";

export default function ForensicAnalysisModal({ itemId, isOpen, onClose }: ForensicAnalysisModalProps) {
  const { authenticateItem, items } = useAuthentixStore();
  const [stage, setStage] = useState<Stage>("SCANNING");
  const [progress, setProgress] = useState(0);
  const [auditItem, setAuditItem] = useState<Item | null>(null);
  const [copied, setCopied] = useState(false);

  // Cross-reference logs during Stage 2
  const [logs, setLogs] = useState<string[]>([]);

  // Sound effects simulation
  const [statusMessage, setStatusMessage] = useState("Initializing AI Validator Consensus...");

  useEffect(() => {
    if (!isOpen || !itemId) return;

    // Reset State
    setStage("SCANNING");
    setProgress(0);
    setLogs([]);
    setCopied(false);

    // Locate Item
    const foundItem = items.find((i) => i.id === itemId);
    if (foundItem) {
      setAuditItem(foundItem);
    }

    // Trigger on-chain simulation
    let isMounted = true;
    
    // Call contract simulate
    authenticateItem(itemId).then((updated) => {
      if (isMounted) {
        setAuditItem(updated);
      }
    });

    // Animation intervals
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 55); // Reach ~100 in 5.5s

    // Stage progression
    const t1 = setTimeout(() => {
      setStage("CROSS_REFERENCING");
      setStatusMessage("Connecting to external databases...");
      setLogs([
        "Connecting to Sotheby's Archive api...",
        "Querying Christie's catalog raisonné indexes...",
        "Accessing Interpol Stolen Art Database...",
        "Fetching Chrono24 reference watch specs...",
      ]);
    }, 1200);

    const t2 = setTimeout(() => {
      setStage("NEURAL_ANALYSIS");
      setStatusMessage("Analyzing physical characteristics...");
      setLogs((prev) => [
        ...prev,
        "Running visual vector stitch mapping...",
        "Verifying serial font bevel thickness...",
        "Detecting signature kraquelure patterns...",
      ]);
    }, 2800);

    const t3 = setTimeout(() => {
      setStage("CONSENSUS_DRUMROLL");
      setStatusMessage("Aggregating multi-validator votes...");
    }, 4500);

    const t4 = setTimeout(() => {
      setStage("VERDICT");
      setStatusMessage("Consensus reached.");
    }, 5600);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, itemId, authenticateItem, items]);

  if (!isOpen || !auditItem) return null;

  const handleShare = () => {
    const text = `AuthentiX AI Audit Result:\nItem: ${auditItem.brand} ${auditItem.model}\nVerdict: ${auditItem.status}\nConfidence: ${auditItem.confidence}%\nCertificate: ${auditItem.certificate_id || "N/A"}\nVerify on-chain: https://authentix.protocol/item/${auditItem.id}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageHeader = () => {
    switch (stage) {
      case "SCANNING":
        return "🔍 Phase 1: High-Res Visual Scan";
      case "CROSS_REFERENCING":
        return "🌐 Phase 2: Provenance Database Verification";
      case "NEURAL_ANALYSIS":
        return "🧠 Phase 3: Forensic Micro-Feature Check";
      case "CONSENSUS_DRUMROLL":
        return "⚡ Phase 4: Validator Consensus Verification";
      case "VERDICT":
      default:
        return "💎 Audit Completed";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass rounded-2xl bg-[#0F0E0D] border border-gold/25 shadow-[0_20px_60px_rgba(212,175,55,0.1)] overflow-hidden my-8">
        
        {/* Top Gold Border */}
        <div className="h-1 w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light" />

        {/* Close Button - Only show after verdict is declared */}
        {stage === "VERDICT" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-foreground/50 hover:text-gold hover:bg-gold/5 p-2 rounded-full cursor-pointer transition-colors"
          >
            ✕
          </button>
        )}

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/10 pb-6 mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold font-mono">GenLayer Intelligent Contract Consensus</span>
              <h2 className="font-serif text-2xl font-bold tracking-wide mt-1">
                {getStageHeader()}
              </h2>
            </div>
            
            {/* Main Progress Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-32 bg-zinc-800 h-1.5 rounded-full overflow-hidden border border-gold/5">
                <div 
                  className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold text-gold w-8 text-right">{progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visual Section: Left Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-zinc-950 border border-gold/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={auditItem.image_urls.split(",")[0]}
                  alt="Inspection Item"
                  className="h-full w-full object-cover"
                />

                {/* ANIMATION 1: Laser scanning sweep */}
                {stage === "SCANNING" && (
                  <div className="absolute inset-x-0 h-1 bg-gold animate-[bounce_2s_infinite] shadow-[0_0_10px_#D4AF37] top-0 opacity-80" />
                )}

                {/* ANIMATION 2: Cross reference terminal layer */}
                {stage === "CROSS_REFERENCING" && (
                  <div className="absolute inset-0 bg-background/80 flex flex-col p-4 justify-end font-mono text-[9px] text-emerald-400 space-y-1.5">
                    <Globe2 className="h-6 w-6 text-gold animate-spin mb-auto" />
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-center space-x-1 animate-pulse">
                        <span>&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ANIMATION 3: Neural network scanning pattern */}
                {stage === "NEURAL_ANALYSIS" && (
                  <div className="absolute inset-0 bg-background/70 flex flex-col justify-center items-center text-center p-6 space-y-3">
                    <Cpu className="h-10 w-10 text-gold animate-pulse" />
                    <span className="font-mono text-[10px] text-gold uppercase tracking-widest animate-pulse">
                      Forensic check: {auditItem.category.toUpperCase()}
                    </span>
                    <div className="w-full text-[9px] font-mono text-foreground/50 space-y-1">
                      <div>STITCH INDEX: OK</div>
                      <div>HALLMARK VECTOR: OK</div>
                      <div>DENSITY CHECK: IN PROCESS...</div>
                    </div>
                  </div>
                )}

                {/* ANIMATION 4: Drumroll consensus loading spinner */}
                {stage === "CONSENSUS_DRUMROLL" && (
                  <div className="absolute inset-0 bg-background/90 flex flex-col justify-center items-center text-center p-6 space-y-4">
                    <div className="relative flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold" />
                      <Activity className="absolute h-5 w-5 text-gold-light" />
                    </div>
                    <span className="font-serif text-sm font-semibold text-gold-light animate-pulse">
                      Gathering Validator Votes...
                    </span>
                  </div>
                )}

                {/* ANIMATION 5: Stamp overlay */}
                {stage === "VERDICT" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
                    <div className="animate-[bounce_0.4s_ease-out_1] origin-center rotate-[-12deg] shadow-lg">
                      <AuthenticityBadge status={auditItem.status} size="lg" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 font-mono text-[10px] uppercase text-foreground/40 text-center tracking-widest">
                ID: {auditItem.id}
              </div>
            </div>

            {/* Analysis Data Section: Right Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              
              {/* Dynamic Panel during Auditing */}
              {stage !== "VERDICT" ? (
                <div className="flex-1 bg-zinc-950/30 border border-gold/5 rounded-xl p-6 flex flex-col justify-center min-h-[300px]">
                  <div className="space-y-4 text-center">
                    <Cpu className="h-8 w-8 text-gold animate-pulse mx-auto" />
                    <div>
                      <p className="font-mono text-xs text-gold uppercase tracking-widest">{statusMessage}</p>
                      <p className="text-sm text-foreground/60 font-light mt-1">
                        GenLayer intelligent validators are performing non-deterministic consensus testing.
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Logs (if any) */}
                  {logs.length > 0 && (
                    <div className="mt-8 font-mono text-[10px] text-foreground/45 border-t border-gold/5 pt-4 space-y-1">
                      {logs.slice(-3).map((l, i) => (
                        <div key={i} className="truncate">&gt; {l}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                
                /* Verdict Results View */
                <div className="flex-1 flex flex-col justify-between space-y-6 animate-[fadeIn_0.5s_ease-out_1]">
                  
                  {/* Header info */}
                  <div className="grid grid-cols-2 gap-4 bg-zinc-950/20 p-4 rounded-lg border border-gold/5">
                    <div>
                      <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-mono">Consensus Confidence</span>
                      <div className="font-serif text-3xl font-bold text-gold mt-1">
                        {auditItem.confidence}%
                      </div>
                    </div>
                    {auditItem.status === "AUTHENTIC" && (
                      <div>
                        <span className="text-[10px] text-foreground/40 uppercase tracking-widest font-mono">Estimated Value</span>
                        <div className="font-serif text-3xl font-bold text-foreground mt-1">
                          {formatUSD(auditItem.estimated_value_usd)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Findings */}
                  <div>
                    <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Forensic Findings</h3>
                    <ul className="space-y-2">
                      {auditItem.forensic_findings.map((finding, idx) => (
                        <li key={idx} className="text-xs text-foreground/80 leading-relaxed font-light flex items-start gap-2">
                          <span className="text-gold mt-0.5">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reason text */}
                  <div>
                    <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">AI Jury Reasoning</h3>
                    <p className="text-xs text-foreground/75 leading-relaxed font-light italic bg-background/50 p-3.5 rounded border border-gold/5">
                      "{auditItem.reasoning}"
                    </p>
                  </div>

                  {/* References & Links */}
                  <div>
                    <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">Cross-Reference Verification</h3>
                    <div className="flex flex-wrap gap-2">
                      {auditItem.cross_references.map((ref, idx) => (
                        <a
                          key={idx}
                          href={ref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-gold/5 hover:bg-gold/10 border border-gold/10 rounded text-[10px] text-gold font-mono max-w-xs truncate cursor-pointer"
                        >
                          <Globe2 className="h-3 w-3" />
                          <span className="truncate">{ref.replace("https://", "")}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action row at bottom */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-gold/10 pt-6">
                    {auditItem.status === "AUTHENTIC" && auditItem.certificate_id ? (
                      <Link
                        href={`/certificate/${auditItem.certificate_id}`}
                        className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                      >
                        <FileCheck className="h-4 w-4" />
                        <span>View Certificate NFT</span>
                      </Link>
                    ) : (
                      <button
                        onClick={onClose}
                        className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-2.5 border border-gold/20 hover:border-gold hover:bg-gold/5 text-foreground hover:text-gold rounded-lg font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Back to Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={handleShare}
                      className="inline-flex items-center justify-center p-2.5 rounded-lg border border-gold/10 hover:bg-gold/5 text-foreground/80 hover:text-gold transition-colors cursor-pointer"
                      title="Copy Share Text"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    
                    {copied && (
                      <span className="text-[10px] text-emerald-400 font-mono animate-fade">Copied!</span>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
