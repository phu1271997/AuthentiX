"use client";

import { useState } from "react";
import { useAuthentixStore } from "@/lib/store";
import { 
  Watch, 
  ShoppingBag, 
  Palette, 
  Milestone, 
  Wine, 
  Coins, 
  Layers, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  FileCheck2
} from "lucide-react";

interface SubmissionFormProps {
  onSubmitSuccess: (itemId: string) => void;
}

export default function SubmissionForm({ onSubmitSuccess }: SubmissionFormProps) {
  const { submitItem, userBalance } = useAuthentixStore();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Form State
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [yearClaimed, setYearClaimed] = useState<number>(new Date().getFullYear());
  const [imageUrls, setImageUrls] = useState("");
  const [provenance, setProvenance] = useState("");
  const [certDocUrl, setCertDocUrl] = useState("");

  const categories = [
    { id: "watch", name: "Watches", icon: Watch, desc: "Rolex, Patek Philippe, Audemars Piguet" },
    { id: "handbag", name: "Handbags", icon: ShoppingBag, desc: "Hermès, Chanel, Louis Vuitton" },
    { id: "painting", name: "Fine Art", icon: Palette, desc: "Paintings, drawings, original prints" },
    { id: "sneakers", name: "Sneakers", icon: Milestone, desc: "Jordan Player Exclusives, rare editions" },
    { id: "wine", name: "Fine Wine", icon: Wine, desc: "Vintage Bordeaux, Burgundy reserves" },
    { id: "other", name: "Other Luxury", icon: Layers, desc: "Sculptures, rare books, high jewelry" },
  ];

  // Helper to pre-populate sample data for ease of demonstration
  const handleLoadSample = (sampleType: "rolex" | "art") => {
    if (sampleType === "rolex") {
      setCategory("watch");
      setBrand("Rolex");
      setModel("Cosmograph Daytona 'Paul Newman' 6239");
      setSerialNumber("1690132");
      setYearClaimed(1968);
      setImageUrls("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800");
      setProvenance("Sold at Phillips New York in 2017. Acquired by current owner from private collection in Milan. Keeps original rivet bracelet.");
      setCertDocUrl("https://phillips.com/detail/rolex/NY080117/8");
    } else if (sampleType === "art") {
      setCategory("painting");
      setBrand("Claude Monet");
      setModel("Water Lilies (Nymphéas)");
      setSerialNumber("M-1906-NL");
      setYearClaimed(1906);
      setImageUrls("https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800");
      setProvenance("Exhibited at Galerie Durand-Ruel, Paris, 1909. Purchased by the Rockefeller family in 1955. Bequeathed to family estate.");
      setCertDocUrl("https://moma.org/collection/works/79783");
    }
    setStep(2);
  };

  const handleNextStep = () => {
    setError("");
    if (step === 1 && !category) {
      setError("Please select a category first.");
      return;
    }
    if (step === 2) {
      if (!brand || !model || !serialNumber || !yearClaimed) {
        setError("Brand, Model, Serial, and Year are required.");
        return;
      }
      if (yearClaimed < 1000 || yearClaimed > 2030) {
        setError("Please enter a valid year between 1000 and 2030.");
        return;
      }
    }
    if (step === 3 && !imageUrls.trim()) {
      setError("Please provide at least one high-res image URL.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (userBalance < 5) {
      setError("Insufficient $AUTH balance. Claim 100 starter tokens in the navbar!");
      return;
    }

    const res = submitItem({
      category,
      brand,
      model,
      serial_number: serialNumber,
      year_claimed: yearClaimed,
      image_urls: imageUrls,
      provenance,
      cert_doc_url: certDocUrl,
    });

    if (res.success && res.itemId) {
      onSubmitSuccess(res.itemId);
    } else {
      setError(res.error || "An error occurred during submission.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass p-8 rounded-2xl bg-[#121110]/40 border border-gold/15">
      {/* Header & Steps Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-wide text-foreground">
              Authenticate Luxury Goods
            </h1>
            <p className="text-sm text-foreground/60 font-light mt-1">
              Submit provenance details and photos to the GenLayer AI validator consensus.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleLoadSample("rolex")} 
              className="px-3 py-1 bg-gold/5 border border-gold/20 text-[10px] uppercase font-semibold text-gold tracking-wider hover:bg-gold/10 rounded transition-colors"
            >
              Demo: Rolex
            </button>
            <button 
              onClick={() => handleLoadSample("art")} 
              className="px-3 py-1 bg-gold/5 border border-gold/20 text-[10px] uppercase font-semibold text-gold tracking-wider hover:bg-gold/10 rounded transition-colors"
            >
              Demo: Art
            </button>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="flex items-center w-full justify-between mt-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-gold-dark to-gold transition-all duration-300 -z-10" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`flex items-center justify-center h-8 w-8 rounded-full border text-xs font-mono font-bold transition-all duration-300 ring-8 ring-[#0A0908] ${
                step === num
                  ? "border-gold bg-gold text-background scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : step > num
                  ? "border-gold-dark bg-zinc-900 text-gold"
                  : "border-zinc-800 bg-[#0A0908] text-foreground/45"
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-foreground/50 uppercase tracking-widest px-1 font-mono">
          <span>Category</span>
          <span>Details</span>
          <span>Photos</span>
          <span>Confirm & Stake</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-gold-light">Select Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    category === cat.id
                      ? "border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
                      : "border-gold/10 hover:border-gold/30 hover:bg-zinc-900/20"
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-3 ${category === cat.id ? "text-gold" : "text-foreground/60"}`} />
                  <span className="font-serif text-base font-semibold">{cat.name}</span>
                  <span className="text-[10px] text-foreground/45 font-light leading-relaxed mt-1">{cat.desc}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ITEM DETAILS */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-gold-light">Item Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                Brand / Maker / Artist
              </label>
              <input
                type="text"
                placeholder="e.g. Rolex, Hermès, Picasso"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                Model / Title Name
              </label>
              <input
                type="text"
                placeholder="e.g. Submariner 116610LN, Birkin 30, Water Lilies"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                Serial / Signature Number
              </label>
              <input
                type="text"
                placeholder="e.g. V39A2081, stamp details"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
                Year Claimed / Creation Date
              </label>
              <input
                type="number"
                value={yearClaimed}
                onChange={(e) => setYearClaimed(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
              Provenance & Ownership History
            </label>
            <textarea
              rows={3}
              placeholder="Detail chain of custody, acquisitions, auction history (e.g. Purchased from Sotheby's 2019; Prior: Rockefeller Estate)"
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
              className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-2">
              External Certificate Link (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. URL to digital receipt or auction house lot"
              value={certDocUrl}
              onChange={(e) => setCertDocUrl(e.target.value)}
              className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/10 hover:border-gold/30 rounded-lg text-xs uppercase font-semibold text-foreground/80 hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: HIGH-RES PHOTOS */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl text-gold-light">Visual Proof (URLs)</h2>
          <p className="text-xs text-foreground/50 leading-relaxed font-light">
            In GenLayer, validators examine images on-chain. Provide high-quality Unsplash image URLs to simulate. You can separate multiple URLs with commas.
          </p>

          <div className="border-2 border-dashed border-gold/15 bg-zinc-950/20 rounded-xl p-8 text-center">
            <Upload className="h-10 w-10 text-gold/40 mx-auto mb-4" />
            <span className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
              Image Address URLs (comma separated)
            </span>
            <textarea
              rows={3}
              placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              className="w-full bg-[#0A0908]/80 border border-gold/15 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-mono leading-relaxed"
            />
            
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setImageUrls("https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800")}
                className="px-2.5 py-1 text-[10px] border border-gold/10 hover:border-gold/20 text-gold-light/60 hover:text-gold rounded transition-colors cursor-pointer"
              >
                Insert Watch Photo
              </button>
              <button
                type="button"
                onClick={() => setImageUrls("https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800")}
                className="px-2.5 py-1 text-[10px] border border-gold/10 hover:border-gold/20 text-gold-light/60 hover:text-gold rounded transition-colors cursor-pointer"
              >
                Insert Canvas Photo
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/10 hover:border-gold/30 rounded-lg text-xs uppercase font-semibold text-foreground/80 hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-dark to-gold text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Review Details</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & STAKE SUBMISSION */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="font-serif text-xl text-gold-light">Final Review & On-Chain Stake</h2>
          
          <div className="bg-zinc-950/40 border border-gold/10 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-y-3 text-xs border-b border-gold/5 pb-4">
              <span className="text-foreground/50 uppercase tracking-widest text-[10px]">Category</span>
              <span className="font-semibold text-foreground uppercase tracking-wide">{category}</span>

              <span className="text-foreground/50 uppercase tracking-widest text-[10px]">Brand / Maker</span>
              <span className="font-serif font-bold text-foreground">{brand}</span>

              <span className="text-foreground/50 uppercase tracking-widest text-[10px]">Model / Title</span>
              <span className="text-foreground/80">{model}</span>

              <span className="text-foreground/50 uppercase tracking-widest text-[10px]">Serial / Mark</span>
              <span className="font-mono text-gold-light">{serialNumber}</span>

              <span className="text-foreground/50 uppercase tracking-widest text-[10px]">Year Claimed</span>
              <span className="font-mono text-gold">{yearClaimed}</span>
            </div>

            <div className="text-xs space-y-1">
              <span className="block text-foreground/50 uppercase tracking-widest text-[10px]">Declared Provenance</span>
              <p className="text-foreground/75 leading-relaxed font-light italic bg-background/30 p-3 rounded border border-gold/5">
                "{provenance || "No provenance history submitted."}"
              </p>
            </div>

            <div className="text-xs space-y-2 border-t border-gold/5 pt-4">
              <div className="flex items-center space-x-2 text-gold">
                <Coins className="h-4 w-4" />
                <span className="font-semibold uppercase tracking-wider text-[10px]">Anti-Spam Token Lock</span>
              </div>
              <p className="text-[11px] text-foreground/50 leading-relaxed font-light">
                To submit an item, you must stake **5 $AUTH** tokens. 
                If the AI Jury consensus rules **AUTHENTIC**, your stake is refunded and you earn a **+10 $AUTH** reward. 
                If ruled **COUNTERFEIT** or **STOLEN**, your stake is burned.
              </p>
              <div className="flex items-center justify-between bg-gold/5 p-3 rounded border border-gold/10 mt-2">
                <span className="text-xs font-medium text-foreground/80">Staked Stake Amount</span>
                <span className="font-mono font-bold text-gold">5.00 AUTH</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/10 hover:border-gold/30 rounded-lg text-xs uppercase font-semibold text-foreground/80 hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB] text-background rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Stake 5 $AUTH & Submit</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
