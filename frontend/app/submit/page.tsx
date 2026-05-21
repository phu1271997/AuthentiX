"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SubmissionForm from "@/components/SubmissionForm";
import ForensicAnalysisModal from "@/components/ForensicAnalysisModal";

export default function SubmitPage() {
  const router = useRouter();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitSuccess = (itemId: string) => {
    setActiveItemId(itemId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (activeItemId) {
      router.push(`/item/${activeItemId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-16 px-4">
        <SubmissionForm onSubmitSuccess={handleSubmitSuccess} />
      </main>

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
