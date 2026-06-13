"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuthentixStore } from "@/lib/store";
import ForensicAnalysisModal from "@/components/ForensicAnalysisModal";
import { 
  Watch, 
  ShoppingBag, 
  Palette, 
  Coins, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Fingerprint
} from "lucide-react";
import { truncateAddress } from "@/lib/utils";

interface Scenario {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  yearClaimed: number;
  imageUrls: string;
  provenance: string;
  certDocUrl: string;
  icon: any;
  color: string;
  borderColor: string;
  badgeColor: string;
  expectedVerdict: "AUTHENTIC" | "COUNTERFEIT" | "STOLEN_FLAGGED";
  description: string;
}

export default function DemoPage() {
  const { 
    userAddress, 
    userBalance, 
    claimedStarter, 
    connectWallet, 
    claimStarterTokens, 
    submitItem, 
    refreshState 
  } = useAuthentixStore();

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [runningScenarioId, setRunningScenarioId] = useState<string | null>(null);
  const [demoStatus, setDemoStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    connectWallet().then(() => refreshState());
  }, [connectWallet, refreshState]);

  const scenarios: Scenario[] = [
    {
      id: "rolex-authentic",
      name: "Rolex Cosmograph Daytona 'Paul Newman' 6239",
      category: "watch",
      brand: "Rolex",
      model: "Cosmograph Daytona 'Paul Newman' 6239",
      serialNumber: "1690132",
      yearClaimed: 1968,
      imageUrls: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
      provenance: "Historically significant timepiece originally owned by Paul Newman. Auction history verified: Sold at Phillips New York in 2017 to the current owner. Comes with original packaging, receipts, and service papers.",
      certDocUrl: "https://phillips.com/detail/rolex/NY080117/8",
      icon: Watch,
      color: "text-amber-500",
      borderColor: "border-amber-500/20",
      badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      expectedVerdict: "AUTHENTIC",
      description: "Verifies visual matches of a genuine 1968 Cosmograph Daytona and cross-references auction registers."
    },
    {
      id: "hermes-counterfeit",
      name: "Hermès Birkin 30 Crocodile",
      category: "handbag",
      brand: "Hermès",
      model: "Birkin 30 Matte Alligator Gold Hardware",
      serialNumber: "H-BIRKIN-CROCO-999-FAKE",
      yearClaimed: 2022,
      imageUrls: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
      provenance: "Acquired from an online peer-to-peer marketplace with incomplete documentation. Material analysis detects irregularities in lock stamp engraving and alignment.",
      certDocUrl: "none",
      icon: ShoppingBag,
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
      badgeColor: "bg-red-500/10 border-red-500/30 text-red-400",
      expectedVerdict: "COUNTERFEIT",
      description: "Triggers neural checklist failure regarding leather stamp symmetry and missing hardware hallmarks."
    },
    {
      id: "picasso-stolen",
      name: "Pablo Picasso — Le Rêve (The Dream)",
      category: "painting",
      brand: "Pablo Picasso",
      model: "Le Rêve (The Dream)",
      serialNumber: "P-1932-STOLEN",
      yearClaimed: 1932,
      imageUrls: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
      provenance: "Bequeathed to a private collection. Subsequently reported stolen during gallery transport from Paris in 2011.",
      certDocUrl: "https://www.artloss.com/register/stolen/picasso-le-reve",
      icon: Palette,
      color: "text-purple-500",
      borderColor: "border-purple-500/20",
      badgeColor: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
      expectedVerdict: "STOLEN_FLAGGED",
      description: "Performs active web scraper checks against stolen art registries. Triggers immediate alert verdict."
    }
  ];

  const runScenario = async (scenario: Scenario) => {
    if (runningScenarioId) return;
    setRunningScenarioId(scenario.id);
    setError("");
    setDemoStatus("Initializing demo account...");

    try {
      // 1. Check/Ensure Wallet Connected
      let activeAddress = userAddress;
      if (!activeAddress) {
        setDemoStatus("Generating fallback sandbox wallet...");
        await connectWallet();
        // Read fresh address
        activeAddress = useAuthentixStore.getState().userAddress;
        if (!activeAddress) {
          throw new Error("Failed to initialize sandbox account.");
        }
      }

      // 2. Check/Ensure Tokens Funded
      setDemoStatus("Checking token balance...");
      await refreshState();
      let activeBalance = useAuthentixStore.getState().userBalance;
      
      if (activeBalance < 5) {
        setDemoStatus("Faucet active: claiming $AUTH tokens for gas/stake...");
        const claimRes = await claimStarterTokens();
        if (!claimRes.success) {
          throw new Error(claimRes.message || "Failed to fund demo account.");
        }
        activeBalance = useAuthentixStore.getState().userBalance;
      }

      // 3. Submit Item Spec
      setDemoStatus(`Submitting ${scenario.brand} to GenLayer...`);
      const submitRes = await submitItem({
        category: scenario.category,
        brand: scenario.brand,
        model: scenario.model,
        serial_number: scenario.serialNumber,
        year_claimed: scenario.yearClaimed,
        image_urls: scenario.imageUrls,
        provenance: scenario.provenance,
        cert_doc_url: scenario.certDocUrl
      });

      if (submitRes.success && submitRes.itemId) {
        setDemoStatus("Submission complete! Opening validator jury console...");
        setActiveItemId(submitRes.itemId);
        setIsModalOpen(true);
      } else {
        throw new Error(submitRes.error || "Submission rejected by contract.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during the demo simulation.");
    } finally {
      setRunningScenarioId(null);
      setDemoStatus("");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActiveItemId(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 px-4 max-w-7xl mx-auto w-full">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-gold/15 border border-gold/30 text-gold rounded font-mono">
            Interactive Test Sandbox
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide">
            Decentralized AI Jury Scenarios
          </h1>
          <p className="text-sm text-foreground/60 font-light leading-relaxed">
            Run complete end-to-end authentication flows with a single click. Our demo mode automatically handles account creation, tokens, and multi-validator AI consensus simulations.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 text-xs max-w-3xl mx-auto font-medium">
            {error}
          </div>
        )}

        {/* Sandbox Wallet Status Card */}
        <div className="max-w-4xl mx-auto mb-12 glass bg-zinc-950/30 border border-gold/15 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gold/5 border border-gold/20 flex items-center justify-center text-gold rounded-lg">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 font-serif">Sandbox Evaluator Wallet</h2>
              <p className="text-xs text-foreground/45 mt-1 font-mono">
                {userAddress ? `Address: ${truncateAddress(userAddress)}` : "Not initialized yet (auto-generated on run)"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-zinc-900 border border-gold/10 px-4 py-2 rounded-lg text-sm">
              <Coins className="h-4 w-4 text-gold" />
              <span className="font-mono text-gold-light font-bold">{userBalance} $AUTH</span>
            </div>
            {!claimedStarter && userAddress && (
              <button 
                onClick={claimStarterTokens}
                className="px-4 py-2 border border-gold/30 hover:border-gold rounded-lg text-xs font-semibold uppercase tracking-widest text-gold hover:bg-gold/5 transition-colors cursor-pointer"
              >
                Faucet Starter Tokens
              </button>
            )}
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isRunning = runningScenarioId === sc.id;
            return (
              <div 
                key={sc.id} 
                className={`glass bg-[#121110]/40 border ${sc.borderColor} rounded-xl p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-300`}
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex justify-between items-center">
                    <div className={`h-10 w-10 bg-zinc-950 border ${sc.borderColor} flex items-center justify-center ${sc.color} rounded-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border rounded font-mono ${sc.badgeColor}`}>
                      Expected: {sc.expectedVerdict.replace("_", " ")}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-bold leading-snug">{sc.brand}</h3>
                    <p className="text-xs text-foreground/50 mt-1">{sc.model}</p>
                  </div>

                  <p className="text-xs text-foreground/70 leading-relaxed font-light font-sans line-clamp-3">
                    {sc.provenance}
                  </p>

                  <div className="text-[10px] font-mono text-foreground/40 bg-black/20 p-2.5 rounded border border-gold/5">
                    <strong>Serial:</strong> {sc.serialNumber} <br />
                    <strong>Category:</strong> {sc.category} | <strong>Year:</strong> {sc.yearClaimed}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => runScenario(sc)}
                  disabled={!!runningScenarioId}
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-3 border border-gold/20 rounded-lg text-xs font-semibold uppercase tracking-wider text-gold hover:text-background bg-zinc-950/20 hover:bg-gradient-to-r hover:from-gold-dark hover:to-gold hover:border-transparent transition-all cursor-pointer disabled:opacity-50`}
                >
                  {isRunning ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-gold" />
                      <span>{demoStatus || "Processing..."}</span>
                    </span>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" />
                      <span>Run Simulation</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Forensic Modal View */}
      {activeItemId && (
        <ForensicAnalysisModal
          itemId={activeItemId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
