"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Navbar from "@/components/Navbar";
import ImageGallery from "@/components/ImageGallery";
import AuthenticityBadge from "@/components/AuthenticityBadge";
import ProvenanceTrail from "@/components/ProvenanceTrail";
import { useAuthentixStore } from "@/lib/store";
import { formatUSD, truncateAddress } from "@/lib/utils";
import { addressEquals } from "@/lib/address";
import { 
  Award, 
  ChevronRight, 
  MapPin, 
  ExternalLink, 
  Send,
  Compass,
  Cpu,
  History,
  ShieldCheck,
  AlertOctagon
} from "lucide-react";
import Link from "next/link";

export default function ItemDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const { items, userAddress, transferCertificate } = useAuthentixStore();
  const [mounted, setMounted] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 text-center py-20 text-foreground/50">
          Loading Dossier...
        </main>
      </div>
    );
  }

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <AlertOctagon className="h-16 w-16 text-red-500 mx-auto animate-bounce" />
          <h1 className="font-serif text-3xl font-bold">Item Dossier Not Found</h1>
          <p className="text-foreground/60 font-light">The requested item registry ID is not registered on this chain.</p>
          <Link href="/marketplace" className="inline-block text-gold underline text-sm">
            Return to Marketplace
          </Link>
        </main>
      </div>
    );
  }

  const isOwner = addressEquals(item.submitter, userAddress);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError("");
    setTransferSuccess(false);

    if (!item.certificate_id) {
      setTransferError("No certificate minted for this item.");
      return;
    }

    setTransferring(true);
    try {
      const res = await transferCertificate(item.certificate_id, targetAddress);
      if (res.success) {
        setTransferSuccess(true);
        setTargetAddress("");
        alert("Certificate transferred successfully!");
      } else {
        setTransferError(res.error || "An error occurred.");
      }
    } catch (err: any) {
      setTransferError(err.message || "An error occurred.");
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-[#121110]/20 border-b border-gold/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-foreground/50">
          <Link href="/marketplace" className="hover:text-gold transition-colors">Registry</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold-light">{item.brand} Dossier</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image Viewer */}
          <div className="lg:col-span-5">
            <ImageGallery images={item.image_urls} />
          </div>

          {/* Right Column: Spec Sheet */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Badge */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <AuthenticityBadge status={item.status} size="sm" />
                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
                  Registry #{item.item_number.toString().padStart(6, "0")}
                </span>
              </div>
              <h1 className="font-serif text-4xl font-bold tracking-wide text-foreground">
                {item.brand}
              </h1>
              <p className="text-lg font-light text-foreground/80">{item.model}</p>
            </div>

            {/* Spec Table */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-gold/15 py-6">
              <div>
                <span className="block text-[10px] text-foreground/45 uppercase tracking-widest font-mono">Category</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-gold-light">{item.category}</span>
              </div>
              <div>
                <span className="block text-[10px] text-foreground/45 uppercase tracking-widest font-mono">Circa Year</span>
                <span className="text-sm font-mono text-foreground">{item.year_claimed}</span>
              </div>
              <div>
                <span className="block text-[10px] text-foreground/45 uppercase tracking-widest font-mono">Serial / Mark</span>
                <span className="text-sm font-mono text-gold-light font-medium">{item.serial_number}</span>
              </div>
              <div>
                <span className="block text-[10px] text-foreground/45 uppercase tracking-widest font-mono">Registrant Address</span>
                <span className="text-sm font-mono text-foreground/60">{truncateAddress(item.submitter)}</span>
              </div>
            </div>

            {/* Value & Certificate Payout (if authentic) */}
            {item.status === "AUTHENTIC" && (
              <div className="glass p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-foreground/45 uppercase tracking-widest font-mono">consensus valuation</span>
                  <span className="font-serif text-3xl font-bold text-foreground mt-1 block">
                    {formatUSD(item.estimated_value_usd)}
                  </span>
                </div>
                {item.certificate_id && (
                  <Link
                    href={`/certificate/${item.certificate_id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all cursor-pointer"
                  >
                    <Award className="h-4 w-4" />
                    <span>View Certificate NFT</span>
                  </Link>
                )}
              </div>
            )}

            {/* AI Report Dossier Summary */}
            {item.status !== "PENDING" && (
              <div className="space-y-6">
                
                {/* Findings */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-gold" />
                    <span>AI Jury Findings</span>
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.forensic_findings.map((f, idx) => (
                      <li key={idx} className="bg-zinc-950/20 border border-gold/5 rounded-lg p-3 text-xs text-foreground/80 leading-relaxed font-light">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reasoning */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Consensus Reasoning</h3>
                  <p className="text-xs text-foreground/75 leading-relaxed font-light italic bg-background/50 p-4 rounded-xl border border-gold/5">
                    "{item.reasoning}"
                  </p>
                </div>

                {/* Cross References */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">References Checked</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.cross_references.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gold/5 hover:bg-gold/10 border border-gold/10 rounded-lg text-[10px] text-gold font-mono cursor-pointer"
                      >
                        <Compass className="h-3.5 w-3.5" />
                        <span>{ref.replace("https://", "").replace("www.", "")}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Transfer Certificate panel (for owners) */}
            {item.status === "AUTHENTIC" && item.certificate_id && isOwner && (
              <div className="glass p-5 rounded-xl border border-gold/20 bg-[#121110]/30 space-y-4">
                <div className="flex items-center space-x-2 text-gold">
                  <Send className="h-4 w-4" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Transfer Certificate NFT</span>
                </div>
                <p className="text-[11px] text-foreground/50 leading-relaxed font-light">
                  You are the current owner of this item on-chain. You can transfer this Certificate NFT to a buyer's wallet address.
                </p>

                {transferError && <p className="text-red-400 text-xs">{transferError}</p>}
                {transferSuccess && <p className="text-emerald-400 text-xs font-semibold">Transfer success!</p>}

                <form onSubmit={handleTransfer} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Recipient Wallet Address (0x...)"
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    disabled={transferring}
                    className="flex-1 bg-background border border-gold/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold font-mono"
                  />
                  <button
                    type="submit"
                    disabled={transferring}
                    className="px-4 py-2 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-50"
                  >
                    {transferring ? "Transferring..." : "Transfer"}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

        {/* Provenance Trail Section */}
        <div className="border-t border-gold/10 pt-12 space-y-8">
          <h2 className="font-serif text-2xl font-semibold text-gold-light flex items-center gap-2">
            <History className="h-5 w-5 text-gold" />
            <span>Chain of Custody Timeline</span>
          </h2>
          <ProvenanceTrail
            provenance={item.provenance}
            submitter={item.submitter}
            created_at={item.created_at}
            status={item.status}
            certificate_id={item.certificate_id}
          />
        </div>

      </main>
    </div>
  );
}
