import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockItems, Item } from "./mockItems";

interface AuthentixState {
  items: Item[];
  userBalance: number;
  claimedStarter: boolean;
  userAddress: string;
  itemCount: number;
  certCount: number;
  
  // Actions
  claimStarterTokens: () => { success: boolean; message: string; amount: number };
  submitItem: (itemData: {
    category: string;
    brand: string;
    model: string;
    serial_number: string;
    year_claimed: number;
    image_urls: string;
    provenance: string;
    cert_doc_url: string;
  }) => { success: boolean; itemId: string; error?: string };
  
  authenticateItem: (itemId: string) => Promise<Item>;
  transferCertificate: (certId: string, toAddress: string) => { success: boolean; error?: string };
  transferTokens: (toAddress: string, amount: number) => { success: boolean; error?: string };
}

export const useAuthentixStore = create<AuthentixState>()(
  persist(
    (set, get) => ({
      items: mockItems,
      userBalance: 0,
      claimedStarter: false,
      userAddress: "0x5A8E67a127B08a54d6D40B2D4b4458315Bc496", // Demo User Wallet
      itemCount: 6,
      certCount: 3,

      claimStarterTokens: () => {
        const { claimedStarter, userBalance } = get();
        if (claimedStarter) {
          return { success: false, message: "Starter tokens already claimed", amount: 0 };
        }
        set({
          userBalance: userBalance + 100,
          claimedStarter: true,
        });
        return { success: true, message: "Granted 100 AUTH starter tokens!", amount: 100 };
      },

      submitItem: (itemData) => {
        const { userBalance, itemCount, items, userAddress } = get();
        const stakeAmount = 5;

        if (userBalance < stakeAmount) {
          return { success: false, itemId: "", error: "Insufficient $AUTH balance to stake. Claim starter tokens first!" };
        }

        const newItemCount = itemCount + 1;
        const newItemId = `item-custom-${newItemCount.toString().padStart(3, "0")}`;

        const newItem: Item = {
          id: newItemId,
          submitter: userAddress,
          category: itemData.category,
          brand: itemData.brand,
          model: itemData.model,
          serial_number: itemData.serial_number || "N/A",
          year_claimed: itemData.year_claimed,
          image_urls: itemData.image_urls,
          provenance: itemData.provenance,
          cert_doc_url: itemData.cert_doc_url,
          status: "PENDING",
          verdict: "",
          confidence: 0,
          forensic_findings: [],
          cross_references: [],
          reasoning: "",
          estimated_value_usd: 0,
          stake_locked: stakeAmount,
          reward_paid: 0,
          certificate_id: "",
          item_number: newItemCount,
          created_at: new Date().toISOString(),
        };

        set({
          items: [newItem, ...items],
          userBalance: userBalance - stakeAmount,
          itemCount: newItemCount,
        });

        return { success: true, itemId: newItemId };
      },

      authenticateItem: async (itemId) => {
        // Wait 6 seconds to simulate the cinematic validator consensus
        await new Promise((resolve) => setTimeout(resolve, 6000));

        const { items, certCount, userBalance } = get();
        const itemIndex = items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) throw new Error("Item not found");

        const item = items[itemIndex];
        if (item.status !== "PENDING") return item;

        // Perform weighted random selection for user items
        // 50% AUTHENTIC, 20% COUNTERFEIT, 25% INCONCLUSIVE, 5% STOLEN_FLAGGED
        const rand = Math.random();
        let verdict: "AUTHENTIC" | "COUNTERFEIT" | "INCONCLUSIVE" | "STOLEN_FLAGGED" = "AUTHENTIC";
        let confidence = 0;
        let estimatedValue = 0;
        let findings: string[] = [];
        let references: string[] = [];
        let reasoning = "";
        let newCertId = "";
        let newBalance = userBalance;
        let rewardPaid = 0;

        // Base search engines
        references = [
          `https://www.google.com/search?q=${encodeURIComponent(item.brand)}+${encodeURIComponent(item.model)}+authentic`,
        ];

        if (rand < 0.50) {
          verdict = "AUTHENTIC";
          confidence = Math.floor(Math.random() * 14) + 85; // 85-98
          estimatedValue = Math.floor(Math.random() * 20000) + 5000; // 5k-25k
          newCertId = `AUTH-CERT-${(certCount + 1).toString().padStart(6, "0")}`;
          rewardPaid = item.stake_locked + 10; // refund stake + 10 reward
          newBalance += rewardPaid;

          findings = [
            `Micro-zoom analysis shows precise ${item.category === "watch" ? "logo beveling" : item.category === "handbag" ? "stitching rows" : "brushstroke density"} consistent with genuine products.`,
            `Serial number '${item.serial_number}' successfully registered and formatted for the year ${item.year_claimed}.`,
            `Provenance timeline presents consistent custody transfer records with no flags.`
          ];

          reasoning = `The consensus of AI validators verified the item's visual properties against authentic reference images. Stitching pattern, logo fonts, and weight parameters are consistent with ${item.brand}'s standards. The serial database verification returned positive status, and the provenance trail has no logical gaps.`;

          if (item.category === "watch") {
            references.push(`https://www.chrono24.com/search/index.htm?query=${encodeURIComponent(item.brand)}+${encodeURIComponent(item.model)}`);
          } else if (item.category === "painting" || item.category === "sculpture") {
            references.push(`https://www.sothebys.com/en/search?keyword=${encodeURIComponent(item.brand)}`);
          }
        } else if (rand < 0.70) {
          verdict = "COUNTERFEIT";
          confidence = Math.floor(Math.random() * 13) + 85; // 85-97
          estimatedValue = 0;
          rewardPaid = 0; // Stake is burned

          findings = [
            `Stitching density falls below standard (measured 5 SPI, expected 8 SPI).`,
            `Engraving font height and stroke weight deviate from reference models.`,
            `The serial code '${item.serial_number}' uses characters inconsistent with the ${item.year_claimed} collection.`
          ];

          reasoning = `The visual assessment of the item highlights clear signs of sub-standard assembly and replication. Material grains do not match the genuine grade, and the logo stamp positioning falls outside permitted tolerances. The serial code is invalid for this model.`;
        } else if (rand < 0.95) {
          verdict = "INCONCLUSIVE";
          confidence = Math.floor(Math.random() * 25) + 50; // 50-74
          estimatedValue = Math.floor(Math.random() * 15000) + 3000;
          rewardPaid = item.stake_locked; // Refund stake only
          newBalance += rewardPaid;

          findings = [
            `Resolution or light in submitted photos is insufficient to verify micro-features.`,
            `Significant surface wear and scratches mask key hallmarks and signatures.`,
            `Provenance shows a 20-year gap between original release and claimed custody.`
          ];

          reasoning = `Validators could not reach consensus (confidence threshold not met). The item displays severe surface degradation obscuring engraving stamps and hallmarks. The lack of documented transfer history since ${item.year_claimed} prevents a definitive authenticity ruling. An in-person inspection is required.`;
        } else {
          verdict = "STOLEN_FLAGGED";
          confidence = Math.floor(Math.random() * 5) + 95; // 95-99
          estimatedValue = 0;
          rewardPaid = 0; // Stake burned

          findings = [
            `Serial number matches stolen alert in Art Loss Register database.`,
            `Provenance claims conflict with Interpol stolen report listing.`
          ];

          reasoning = `CRITICAL ALERT: The serial number and description of this item match an active registry for stolen assets (Art Loss database). The validator consensus has flagged this item and locked further transfers. The submitter's stake has been burned.`;
        }

        const updatedItem: Item = {
          ...item,
          status: verdict,
          verdict,
          confidence,
          estimated_value_usd: estimatedValue,
          forensic_findings: findings,
          cross_references: references,
          reasoning,
          certificate_id: newCertId,
          reward_paid: rewardPaid,
        };

        const updatedItems = [...items];
        updatedItems[itemIndex] = updatedItem;

        set({
          items: updatedItems,
          userBalance: newBalance,
          certCount: newCertId ? certCount + 1 : certCount,
        });

        return updatedItem;
      },

      transferCertificate: (certId, toAddress) => {
        const { items } = get();
        // Validate target address format
        if (!toAddress.startsWith("0x") || toAddress.length !== 42) {
          return { success: false, error: "Invalid Ethereum/GenLayer address format. Must be 42 characters starting with '0x'." };
        }

        const itemIndex = items.findIndex((i) => i.certificate_id === certId);
        if (itemIndex === -1) {
          return { success: false, error: "Certificate NFT not found" };
        }

        const updatedItems = [...items];
        const item = updatedItems[itemIndex];
        
        // Simulating the ownership trail update by modifying the submitter to the new owner,
        // and logging the transfer event in the provenance timeline
        const oldOwner = item.submitter;
        const newProvenance = `${item.provenance} | Transferred to ${toAddress} on ${new Date().toLocaleDateString()}`;
        
        updatedItems[itemIndex] = {
          ...item,
          submitter: toAddress,
          provenance: newProvenance,
        };

        set({ items: updatedItems });
        return { success: true };
      },

      transferTokens: (toAddress, amount) => {
        const { userBalance } = get();
        if (amount <= 0) return { success: false, error: "Amount must be greater than zero." };
        if (userBalance < amount) return { success: false, error: "Insufficient $AUTH balance." };
        if (!toAddress.startsWith("0x") || toAddress.length !== 42) {
          return { success: false, error: "Invalid recipient address." };
        }

        set({ userBalance: userBalance - amount });
        return { success: true };
      },
    }),
    {
      name: "authentix-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
