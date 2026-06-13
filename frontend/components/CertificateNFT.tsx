"use client";

import { useState } from "react";
import { Item } from "@/lib/mockItems";
import { formatUSD, truncateAddress } from "@/lib/utils";
import { addressEquals } from "@/lib/address";
import { ShieldCheck, Calendar, QrCode, Sparkles } from "lucide-react";
import ProvenanceTrail from "./ProvenanceTrail";
import { useAuthentixStore } from "@/lib/store";

interface CertificateNFTProps {
  certificate: {
    cert_id: string;
    item_id: string;
    category: string;
    brand: string;
    model: string;
    serial_number: string;
    year_claimed: number;
    verdict: string;
    confidence: number;
    forensic_findings: string[];
    estimated_value_usd: number;
    minted_to: string;
    mint_number: number;
    current_owner?: string;
  };
  itemProvenance: string;
}

export default function CertificateNFT({ certificate, itemProvenance }: CertificateNFTProps) {
  const { userAddress, transferCertificate, refreshState } = useAuthentixStore();
  const [recipient, setRecipient] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [rotateStyle, setRotateStyle] = useState({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.5s ease",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Tilt calculations (-8 to 8 deg)
    const rotateX = ((y - height / 2) / (height / 2)) * -8;
    const rotateY = ((x - width / 2) / (width / 2)) * 8;
    
    setRotateStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "none",
    });
  };

  const handleMouseLeave = () => {
    setRotateStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out",
    });
  };

  const owner = certificate.current_owner || certificate.minted_to;
  const isOwner = addressEquals(userAddress, owner);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      setError("Please enter a valid address (0x...)");
      return;
    }
    setTransferring(true);
    try {
      const res = await transferCertificate(certificate.cert_id, recipient);
      if (res.success) {
        setSuccess(`Successfully transferred certificate to ${recipient}`);
        setRecipient("");
        await refreshState();
      } else {
        setError(res.error || "Transfer failed");
      }
    } catch (err: any) {
      setError(err.message || "Transfer failed");
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      
      {/* 3D Certificate NFT Card */}
      <div
        className="relative mx-auto w-full max-w-2xl aspect-[1.4/1] rounded-2xl p-0.5 cursor-grab active:cursor-grabbing select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={rotateStyle}
      >
        {/* Certificate Frame with Ornate Gold Borders */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light p-[3px] shadow-[0_15px_45px_rgba(212,175,55,0.15)]">
          
          {/* Innermost Paper-textured Content Sheet */}
          <div 
            className="h-full w-full rounded-[13px] bg-[#FAF7F2] text-[#0A0908] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 80%),
                linear-gradient(to right, rgba(10,9,8,0.01) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(10,9,8,0.01) 1px, transparent 1px)
              `,
              backgroundSize: "100% 100%, 20px 20px, 20px 20px",
            }}
          >
            {/* Background Security Ornate Crest */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-45 scale-125">
              <ShieldCheck className="h-96 w-96 text-gold-dark" />
            </div>

            {/* Corner Decorative Ornaments (Classic Certificate Look) */}
            <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-gold-dark" />
            <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-gold-dark" />
            <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-gold-dark" />
            <div className="absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-gold-dark" />

            {/* Top Row: Title & Serial */}
            <div className="flex justify-between items-start border-b border-gold/25 pb-4">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold-dark font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AUTHENTIX CERTIFICATE OF AUTHENTICITY
                </span>
                <h1 className="font-serif text-3xl font-bold tracking-wide mt-1 text-[#1D1B18]">
                  {certificate.brand}
                </h1>
                <p className="text-xs font-light text-[#5C5750] mt-0.5">{certificate.model}</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#8A8175]">Mint Certificate ID</span>
                <div className="font-mono text-sm font-semibold text-gold-dark mt-1">
                  {certificate.cert_id}
                </div>
              </div>
            </div>

            {/* Middle Row: Technical Details & Stamp Seal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
              
              <div className="md:col-span-8 grid grid-cols-2 gap-x-6 gap-y-3 text-xs border-r border-[#AA7C11]/10 pr-4">
                <div>
                  <span className="block text-[10px] text-[#8A8175] uppercase tracking-wider">Serial / Signature</span>
                  <span className="font-mono text-sm font-semibold text-[#1D1B18]">{certificate.serial_number}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8A8175] uppercase tracking-wider">Circa Year</span>
                  <span className="font-mono text-sm font-semibold text-[#1D1B18]">{certificate.year_claimed}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8A8175] uppercase tracking-wider">Estimated Value</span>
                  <span className="font-serif text-sm font-bold text-emerald-800">
                    {formatUSD(certificate.estimated_value_usd)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#8A8175] uppercase tracking-wider">Mint Authority</span>
                  <span className="font-mono text-[11px] text-[#5C5750]">AI Validator Consensus</span>
                </div>
              </div>

              {/* On-Chain Verification Seal */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="relative flex items-center justify-center h-20 w-20 rounded-full border-2 border-dashed border-gold-dark/40 bg-gold/5 p-2 mb-1">
                  <ShieldCheck className="h-10 w-10 text-emerald-700" />
                  {/* Rotating stamp lettering */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full animate-[spin_20s_linear_infinite] pointer-events-none opacity-20">
                    <span className="font-mono text-[6px] text-gold-dark font-extrabold tracking-widest uppercase">
                      VERIFIED • SECURED • IMMUTABLE •
                    </span>
                  </div>
                </div>
                <span className="font-serif text-[10px] font-bold text-gold-dark uppercase tracking-wider">
                  Consensus Pass ({certificate.confidence}%)
                </span>
              </div>

            </div>

            {/* Bottom Row: Ownership & QR Code */}
            <div className="flex justify-between items-end border-t border-[#AA7C11]/15 pt-4">
              <div className="space-y-1">
                <span className="block text-[8px] text-[#8A8175] uppercase tracking-wider font-mono">Current Certificate Owner</span>
                <div className="font-mono text-xs font-bold text-[#1D1B18]">
                  {certificate.current_owner ? truncateAddress(certificate.current_owner) : truncateAddress(certificate.minted_to)}
                </div>
                <div className="text-[9px] text-[#8A8175] font-light flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Mint Block #{(certificate.mint_number * 1482 + 9812)}</span>
                </div>
              </div>

              {/* Mock QR Code */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="block text-[8px] text-[#8A8175] uppercase tracking-wider font-mono">Scan to Verify</span>
                  <span className="text-[9px] text-gold-dark font-semibold">AuthentiX Registry</span>
                </div>
                <div className="p-1.5 bg-[#1D1B18] rounded border border-gold-dark/20 text-[#FAF7F2]">
                  <QrCode className="h-9 w-9" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Transfer Form (Only visible to current owner) */}
      {isOwner ? (
        <div className="glass p-6 rounded-xl bg-[#121110]/40 border border-gold/15 max-w-2xl mx-auto">
          <h4 className="font-serif text-lg text-gold-light mb-2">Transfer Certificate Ownership</h4>
          <p className="text-xs text-foreground/60 mb-4 font-light">
            You are the owner of this AuthentiX Certificate NFT. You can transfer ownership of this certificate to another address on-chain. This updates the provenance trail permanently.
          </p>
          {error && (
            <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded text-xs mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded text-xs mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleTransfer} className="flex gap-3">
            <input
              type="text"
              placeholder="Recipient Address (0x...)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={transferring}
              className="flex-1 bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-mono text-foreground"
            />
            <button
              type="submit"
              disabled={transferring}
              className="px-6 py-2 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
            >
              {transferring ? "Transferring..." : "Transfer NFT"}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center text-xs text-foreground/40 max-w-2xl mx-auto">
          Connect owner wallet ({truncateAddress(owner)}) to transfer this certificate on-chain.
        </div>
      )}

      {/* Provenance Trail Timeline section below */}
      <div className="border-t border-gold/10 pt-10">
        <h3 className="font-serif text-2xl font-semibold text-gold-light mb-8">
          Historical Provenance & Chain of Custody
        </h3>
        <ProvenanceTrail
          provenance={itemProvenance}
          submitter={certificate.minted_to}
          status="AUTHENTIC"
          certificate_id={certificate.cert_id}
        />
      </div>

    </div>
  );
}
