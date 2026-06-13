"use client";

import { useEffect } from "react";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x52f3f4FbA76BF059968450b95af77731349EDA32";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("AuthentiX Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0908] text-[#FAF7F2] px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-6xl">⚠️</div>
        <h1 className="font-serif text-3xl font-bold tracking-wide text-[#D4AF37]">
          Something went wrong
        </h1>
        <p className="text-sm text-[#FAF7F2]/60 font-light leading-relaxed">
          AuthentiX encountered an unexpected error. This may be a temporary issue with the GenLayer network connection.
        </p>
        <pre className="bg-zinc-900/50 border border-[#D4AF37]/10 rounded-lg p-4 text-xs text-red-400 font-mono text-left overflow-auto max-h-32">
          {error.message}
        </pre>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#F3E5AB] text-[#0A0908] font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-2.5 border border-[#D4AF37]/20 hover:border-[#D4AF37] rounded-lg text-xs uppercase tracking-widest text-[#FAF7F2]/80 hover:text-[#D4AF37] transition-colors"
          >
            Go Home
          </a>
        </div>
        <div className="text-[10px] font-mono text-[#FAF7F2]/30 pt-4 border-t border-[#D4AF37]/10">
          Contract: {CONTRACT_ADDRESS} | Network: studionet
        </div>
      </div>
    </div>
  );
}
