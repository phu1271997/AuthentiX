"use client";

import Link from "next/link";
import Image from "next/image";
import { Item } from "@/lib/mockItems";
import AuthenticityBadge from "./AuthenticityBadge";
import { formatUSD } from "@/lib/utils";
import { Award, Eye, FileText } from "lucide-react";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const [imgSrc, setImgSrc] = useState(item.image_urls.split(",")[0]);

  return (
    <div className="glass group relative overflow-hidden rounded-xl bg-[#121110]/50 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)]">
      {/* Dynamic Gold Leaf Accent Border on Top */}
      <div className="h-1 w-full bg-gradient-to-r from-gold-dark via-gold to-gold-light opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-900/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={`${item.brand} ${item.model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgSrc("https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800")}
        />
        
        {/* Status Stamp Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <AuthenticityBadge status={item.status} size="sm" />
        </div>

        {/* Year Label */}
        <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold rounded border border-gold/10 text-gold-light">
          Circa {item.year_claimed}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex flex-col mb-4">
          <span className="font-serif text-2xl font-bold tracking-wide text-foreground">
            {item.brand}
          </span>
          <span className="text-sm font-light text-foreground/75 truncate mt-1">
            {item.model}
          </span>
        </div>

        {/* Details List */}
        <div className="space-y-2 mb-6 border-t border-gold/5 pt-4">
          <div className="flex justify-between text-xs">
            <span className="text-foreground/50">Serial / Signature</span>
            <span className="font-mono text-gold-light font-medium">{item.serial_number}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-foreground/50">Est. Value</span>
            <span className="font-serif font-bold text-foreground">
              {item.status === "COUNTERFEIT" ? "—" : formatUSD(item.estimated_value_usd)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-foreground/50">Category</span>
            <span className="uppercase text-gold-light tracking-widest text-[10px]">{item.category}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/item/${item.id}`}
            className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 border border-gold/20 hover:border-gold hover:bg-gold/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-foreground hover:text-gold transition-colors text-center cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Forensics</span>
          </Link>

          {item.status === "AUTHENTIC" && item.certificate_id && (
            <Link
              href={`/certificate/${item.certificate_id}`}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold hover:text-gold-light transition-colors cursor-pointer"
              title="View NFT Certificate"
            >
              <Award className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
