"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CertificateNFT from "@/components/CertificateNFT";
import { useAuthentixStore } from "@/lib/store";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CertificatePage() {
  const params = useParams();
  const certId = params?.id as string;
  const { items } = useAuthentixStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 text-center py-20 text-foreground/50">
          Loading Certificate NFT...
        </main>
      </div>
    );
  }

  // Find the item matching this certificate ID
  const item = items.find((i) => i.certificate_id === certId);

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
          <h1 className="font-serif text-3xl font-bold">Certificate NFT Not Found</h1>
          <p className="text-foreground/60 font-light">The requested Certificate ID is not registered in this block.</p>
          <Link href="/marketplace" className="inline-block text-gold underline text-sm">
            Return to Marketplace
          </Link>
        </main>
      </div>
    );
  }

  // Construct certificate object for component compatibility
  const certificateData = {
    cert_id: item.certificate_id,
    item_id: item.id,
    category: item.category,
    brand: item.brand,
    model: item.model,
    serial_number: item.serial_number,
    year_claimed: item.year_claimed,
    verdict: "AUTHENTIC",
    confidence: item.confidence,
    forensic_findings: item.forensic_findings,
    estimated_value_usd: item.estimated_value_usd,
    minted_to: item.submitter, // Using submitter to represent the origin address
    mint_number: item.item_number,
    current_owner: item.submitter,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-[#121110]/20 border-b border-gold/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-foreground/50">
          <Link href="/marketplace" className="hover:text-gold transition-colors">Registry</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/item/${item.id}`} className="hover:text-gold transition-colors">{item.brand} Dossier</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold-light">Certificate NFT</span>
        </div>
      </div>

      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8 text-center mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-gold">
            On-Chain Provenance Document
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-foreground">
            AuthentiX Verified Certificate
          </h2>
          <p className="max-w-lg mx-auto text-xs text-foreground/50 font-light leading-relaxed">
            This certificate is locked to the physical item using cryptographic hashes. 
            Drag and hover your mouse to inspect the 3D depth and metallic foil print of this NFT.
          </p>
        </div>

        <CertificateNFT 
          certificate={certificateData} 
          itemProvenance={item.provenance} 
        />
      </main>
    </div>
  );
}
