"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import { useAuthentixStore } from "@/lib/store";
import { Search, Filter, RefreshCcw } from "lucide-react";

export default function Marketplace() {
  const { items } = useAuthentixStore();
  const [mounted, setMounted] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 text-center text-foreground/50">
          Loading Registry...
        </main>
      </div>
    );
  }

  // Filter Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesStatus = 
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "watch", label: "Watches" },
    { value: "handbag", label: "Handbags" },
    { value: "painting", label: "Fine Art" },
    { value: "sneakers", label: "Sneakers" },
    { value: "wine", label: "Wine" },
  ];

  const statuses = [
    { value: "all", label: "All Verdicts" },
    { value: "AUTHENTIC", label: "Verified Authentic" },
    { value: "COUNTERFEIT", label: "Counterfeit Fake" },
    { value: "INCONCLUSIVE", label: "Inconclusive" },
    { value: "STOLEN_FLAGGED", label: "Stolen Flagged" },
    { value: "PENDING", label: "Pending Audit" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gold/15 pb-8">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">Consensus Record Registry</span>
            <h1 className="font-serif text-4xl font-bold tracking-wide text-foreground mt-1">
              The AuthentiX Registry
            </h1>
            <p className="text-xs text-foreground/50 font-light mt-1 max-w-xl">
              Browse public items verified by GenLayer multi-validator consensus. 
              Search serial numbers, provenance trails, and visual forensic report logs.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#121110]/50 p-4 rounded-xl border border-gold/10 glass">
          
          {/* Search Box */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/45" />
            <input
              type="text"
              placeholder="Search by Brand, Model, Serial #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-gold/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-background border border-gold/10 rounded-lg px-3 py-2.5 text-xs text-foreground/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-background">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-background border border-gold/10 rounded-lg px-3 py-2.5 text-xs text-foreground/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value} className="bg-background">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Icon */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
              className="p-2.5 rounded-lg border border-gold/10 hover:border-gold/30 text-foreground/50 hover:text-gold transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Item Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/20 border border-gold/5 rounded-xl">
            <p className="text-sm text-foreground/40 font-light">No authenticated items match the active filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
