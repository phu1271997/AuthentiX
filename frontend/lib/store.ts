import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mockItems, Item } from "./mockItems";
import { createClient, createAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { normalizeAddress, addressEquals } from "./address";

interface AuthentixState {
  items: Item[];
  userBalance: number;
  claimedStarter: boolean;
  userAddress: string;
  realItemIds: string[];
  itemCount: number;
  certCount: number;
  
  // Actions
  connectWallet: () => Promise<void>;
  refreshState: () => Promise<void>;
  claimStarterTokens: () => Promise<{ success: boolean; message: string; amount: number }>;
  submitItem: (itemData: {
    category: string;
    brand: string;
    model: string;
    serial_number: string;
    year_claimed: number;
    image_urls: string;
    provenance: string;
    cert_doc_url: string;
  }) => Promise<{ success: boolean; itemId: string; error?: string }>;
  
  authenticateItem: (itemId: string) => Promise<Item>;
  transferCertificate: (certId: string, toAddress: string) => Promise<{ success: boolean; error?: string }>;
  transferTokens: (toAddress: string, amount: number) => Promise<{ success: boolean; error?: string }>;
}

const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x52f3f4FbA76BF059968450b95af77731349EDA32") as `0x${string}`;

const readBalance = async (address: string) => {
  try {
    const client = createClient({ chain: studionet });
    const balance = await client.readContract({
      address: contractAddress,
      functionName: "get_balance",
      args: [address],
    });
    return Number(balance);
  } catch (err) {
    console.error("Failed to read balance:", err);
    return 0;
  }
};

const readItem = async (itemId: string) => {
  try {
    const client = createClient({ chain: studionet });
    const itemRaw = await client.readContract({
      address: contractAddress,
      functionName: "get_item",
      args: [itemId],
    });
    if (typeof itemRaw === "string") {
      return JSON.parse(itemRaw);
    }
    return null;
  } catch (err) {
    console.error(`Failed to read item ${itemId}:`, err);
    return null;
  }
};

/**
 * Get a write-capable client.
 * Tries MetaMask first, falls back to a local ephemeral account.
 * 
 * wallet_getSnaps bypass: MetaMask Flask/Snaps can throw
 * 'wallet_getSnaps is not supported' on certain chains.
 * We catch that silently and fall back.
 */
const getWriteClient = async (userAddress?: string) => {
  if (typeof window === "undefined") return null;

  const ethereum = (window as any).ethereum;
  if (ethereum) {
    try {
      // Only use MetaMask if it supports basic account requests
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const client = createClient({
          chain: studionet,
          account: address as `0x${string}`,
        });
        
        try {
          await client.connect("studionet");
        } catch (switchErr: any) {
          // wallet_getSnaps or chain switch errors are not fatal — we continue
          const errMsg = switchErr?.message || "";
          if (errMsg.includes("wallet_getSnaps") || errMsg.includes("not supported")) {
            console.warn("MetaMask Snaps not supported on this chain, continuing without switch.");
          } else {
            console.warn("Failed to switch chain in wallet:", switchErr);
          }
        }
        
        return { client, address };
      }
    } catch (err: any) {
      const errMsg = err?.message || "";
      // wallet_getSnaps is a known non-fatal issue with MetaMask Flask
      if (errMsg.includes("wallet_getSnaps") || errMsg.includes("not supported")) {
        console.warn("MetaMask Snaps not available, using local account fallback.");
      } else {
        console.warn("MetaMask connection failed, falling back to local account:", err);
      }
    }
  }

  // Fallback: Local Account stored in localStorage
  let pkey = localStorage.getItem("authentix_private_key");
  if (!pkey) {
    pkey = generatePrivateKey();
    localStorage.setItem("authentix_private_key", pkey);
  }

  const account = createAccount(pkey as `0x${string}`);
  const address = account.address;
  const client = createClient({
    chain: studionet,
    account: account,
  });

  return { client, address };
};

export const useAuthentixStore = create<AuthentixState>()(
  persist(
    (set, get) => ({
      items: mockItems,
      userBalance: 0,
      claimedStarter: false,
      userAddress: "",
      realItemIds: [],
      itemCount: 6,
      certCount: 3,

      connectWallet: async () => {
        try {
          const writeInfo = await getWriteClient();
          if (writeInfo) {
            const { address } = writeInfo;
            set({ userAddress: normalizeAddress(address) });
            await get().refreshState();
          }
        } catch (err) {
          console.error("connectWallet failed:", err);
        }
      },

      refreshState: async () => {
        const { userAddress, realItemIds, items } = get();
        if (!userAddress) return;
        
        const balance = await readBalance(userAddress);
        
        let updatedItems = [...items];
        let changed = false;
        
        for (const itemId of realItemIds) {
          const freshItem = await readItem(itemId);
          if (freshItem) {
            if (!freshItem.created_at) {
              const existing = items.find((i) => i.id === itemId);
              freshItem.created_at = existing?.created_at || new Date().toISOString();
            }
            const idx = updatedItems.findIndex((i) => i.id === itemId);
            if (idx !== -1) {
              updatedItems[idx] = freshItem;
            } else {
              updatedItems = [freshItem, ...updatedItems];
            }
            changed = true;
          }
        }
        
        set({
          userBalance: balance,
          claimedStarter: balance > 0,
          items: updatedItems,
        });
      },

      claimStarterTokens: async () => {
        const { userAddress } = get();
        if (!userAddress) {
          return { success: false, message: "Wallet not connected. Connect via MetaMask or generate a fallback wallet first.", amount: 0 };
        }
        try {
          const writeClientInfo = await getWriteClient(userAddress);
          if (!writeClientInfo) throw new Error("Could not initialize write client.");
          const { client } = writeClientInfo;

          const txHash = await client.writeContract({
            address: contractAddress,
            functionName: "claim_starter_tokens",
            args: [],
            value: BigInt(0),
          });

          await client.waitForTransactionReceipt({ hash: txHash });
          await get().refreshState();
          return { success: true, message: "Successfully claimed 100 $AUTH on GenLayer studionet!", amount: 100 };
        } catch (err: any) {
          console.error(err);
          return { success: false, message: err.message || "Claim transaction failed.", amount: 0 };
        }
      },

      submitItem: async (itemData) => {
        const { userBalance, userAddress, realItemIds, items } = get();
        const stakeAmount = 5;

        if (userAddress && userBalance < stakeAmount) {
          return { success: false, itemId: "", error: "Insufficient $AUTH balance to stake. Claim starter tokens first!" };
        }

        try {
          const writeClientInfo = await getWriteClient(userAddress);
          if (!writeClientInfo) throw new Error("Could not initialize write client.");
          const { client, address } = writeClientInfo;

          const activeAddress = normalizeAddress(userAddress || address);

          // Convert comma-separated image URLs to JSON array format
          let imageUrlsJson: string;
          try {
            // If already valid JSON array, use as-is
            const parsed = JSON.parse(itemData.image_urls);
            if (Array.isArray(parsed)) {
              imageUrlsJson = itemData.image_urls;
            } else {
              imageUrlsJson = JSON.stringify([itemData.image_urls]);
            }
          } catch {
            // Convert comma-separated to JSON array
            const urls = itemData.image_urls
              .split(",")
              .map((u: string) => u.trim())
              .filter((u: string) => u.length > 0);
            imageUrlsJson = JSON.stringify(urls);
          }

          // Contract now auto-generates item_id
          const txHash = await client.writeContract({
            address: contractAddress,
            functionName: "submit_item",
            args: [
              itemData.category,
              itemData.brand,
              itemData.model,
              itemData.serial_number || "N/A",
              itemData.year_claimed,
              imageUrlsJson,
              itemData.provenance || "",
              itemData.cert_doc_url || "",
            ],
            value: BigInt(0),
          });

          const receipt = await client.waitForTransactionReceipt({ hash: txHash });

          // Parse the return value to get auto-generated item_id
          let newItemId = `item-auth-${Date.now()}`; // fallback
          try {
            // Try to read the result from the transaction
            if (receipt && typeof receipt === "object") {
              const resultStr = (receipt as any).result || (receipt as any).data;
              if (typeof resultStr === "string") {
                const result = JSON.parse(resultStr);
                if (result.item_id) {
                  newItemId = result.item_id;
                }
              }
            }
          } catch {
            // Keep fallback ID
          }

          const pendingItem: Item = {
            id: newItemId,
            submitter: activeAddress,
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
            item_number: items.length + 1,
            created_at: new Date().toISOString(),
          };

          set({
            items: [pendingItem, ...items],
            realItemIds: [newItemId, ...realItemIds],
            userAddress: activeAddress,
            userBalance: Math.max(0, userBalance - stakeAmount),
          });

          return { success: true, itemId: newItemId };
        } catch (err: any) {
          console.error(err);
          return { success: false, itemId: "", error: err.message || "Submission transaction failed." };
        }
      },

      authenticateItem: async (itemId) => {
        const { realItemIds } = get();
        
        if (!realItemIds.includes(itemId)) {
          await new Promise((resolve) => setTimeout(resolve, 6000));

          const { items, certCount, userBalance } = get();
          const itemIndex = items.findIndex((i) => i.id === itemId);
          if (itemIndex === -1) throw new Error("Item not found");

          const item = items[itemIndex];
          if (item.status !== "PENDING") return item;

          const rand = Math.random();
          let verdict: "AUTHENTIC" | "COUNTERFEIT" | "INCONCLUSIVE" | "STOLEN_FLAGGED" = "AUTHENTIC";
          let confidence = 0;
          let estimatedValue = 0;
          let findings: string[] = [];
          let references: string[] = [
            `https://www.google.com/search?q=${encodeURIComponent(item.brand)}+${encodeURIComponent(item.model)}+authentic`,
          ];
          let reasoning = "";
          let newCertId = "";
          let newBalance = userBalance;
          let rewardPaid = 0;

          if (rand < 0.50) {
            verdict = "AUTHENTIC";
            confidence = Math.floor(Math.random() * 14) + 85;
            estimatedValue = Math.floor(Math.random() * 20000) + 5000;
            newCertId = `AUTH-CERT-${(certCount + 1).toString().padStart(6, "0")}`;
            rewardPaid = item.stake_locked + 10;
            newBalance += rewardPaid;

            findings = [
              `Micro-zoom analysis shows precise ${item.category === "watch" ? "logo beveling" : item.category === "handbag" ? "stitching rows" : "brushstroke density"} consistent with genuine products.`,
              `Serial number '${item.serial_number}' successfully registered and formatted for the year ${item.year_claimed}.`,
              `Provenance timeline presents consistent custody transfer records with no flags.`
            ];

            reasoning = `The consensus of AI validators verified the item's visual properties against authentic reference images. Stitching pattern, logo fonts, and weight parameters are consistent with ${item.brand}'s standards. The serial database verification returned positive status, and the provenance trail has no logical gaps.`;

            if (item.category === "watch") {
              references.push(`https://www.chrono24.com/search/index.htm?query=${encodeURIComponent(item.brand)}+${encodeURIComponent(item.model)}`);
              references.push(`https://stolenwatchregister.com/search?serial=${encodeURIComponent(item.serial_number)}`);
            } else if (item.category === "painting" || item.category === "sculpture") {
              references.push(`https://www.sothebys.com/en/search?keyword=${encodeURIComponent(item.brand)}`);
              references.push(`https://www.artloss.com/search?q=${encodeURIComponent(item.brand)}`);
            }
          } else if (rand < 0.70) {
            verdict = "COUNTERFEIT";
            confidence = Math.floor(Math.random() * 13) + 85;
            estimatedValue = 0;
            rewardPaid = 0;

            findings = [
              `Stitching density falls below standard (measured 5 SPI, expected 8 SPI).`,
              `Engraving font height and stroke weight deviate from reference models.`,
              `The serial code '${item.serial_number}' uses characters inconsistent with the ${item.year_claimed} collection.`
            ];

            reasoning = `The visual assessment of the item highlights clear signs of sub-standard assembly and replication. Material grains do not match the genuine grade, and the logo stamp positioning falls outside permitted tolerances. The serial code is invalid for this model.`;
          } else if (rand < 0.95) {
            verdict = "INCONCLUSIVE";
            confidence = Math.floor(Math.random() * 25) + 50;
            estimatedValue = Math.floor(Math.random() * 15000) + 3000;
            rewardPaid = item.stake_locked;
            newBalance += rewardPaid;

            findings = [
              `Resolution or light in submitted photos is insufficient to verify micro-features.`,
              `Significant surface wear and scratches mask key hallmarks and signatures.`,
              `Provenance shows a 20-year gap between original release and claimed custody.`
            ];

            reasoning = `Validators could not reach consensus (confidence threshold not met). The item displays severe surface degradation obscuring engraving stamps and hallmarks. The lack of documented transfer history since ${item.year_claimed} prevents a definitive authenticity ruling. An in-person inspection is required.`;
          } else {
            verdict = "STOLEN_FLAGGED";
            confidence = Math.floor(Math.random() * 5) + 95;
            estimatedValue = 0;
            rewardPaid = 0;

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
        }

        try {
          const { userAddress } = get();
          const writeClientInfo = await getWriteClient(userAddress);
          if (!writeClientInfo) throw new Error("Could not initialize write client.");
          const { client } = writeClientInfo;

          const txHash = await client.writeContract({
            address: contractAddress,
            functionName: "authenticate_item",
            args: [itemId],
            value: BigInt(0),
          });

          await client.waitForTransactionReceipt({ hash: txHash });

          const freshItem = await readItem(itemId);
          if (!freshItem) throw new Error("Failed to retrieve authenticated item state from blockchain.");

          freshItem.created_at = new Date().toISOString();

          const { items } = get();
          const updatedItems = items.map((i) => i.id === itemId ? freshItem : i);
          
          set({ items: updatedItems });
          await get().refreshState();

          return freshItem;
        } catch (err: any) {
          console.error("authenticateItem failed:", err);
          throw err;
        }
      },

      transferCertificate: async (certId, toAddress) => {
        const { items, realItemIds, userAddress } = get();
        const item = items.find((i) => i.certificate_id === certId);

        if (!item || !realItemIds.includes(item.id)) {
          const itemIndex = items.findIndex((i) => i.certificate_id === certId);
          if (itemIndex === -1) return { success: false, error: "Certificate NFT not found" };
          const updatedItems = [...items];
          const it = updatedItems[itemIndex];
          const newProvenance = `${it.provenance} | Transferred to ${toAddress} on ${new Date().toLocaleDateString()}`;
          updatedItems[itemIndex] = {
            ...it,
            submitter: normalizeAddress(toAddress),
            provenance: newProvenance,
          };
          set({ items: updatedItems });
          return { success: true };
        }

        try {
          const writeClientInfo = await getWriteClient(userAddress);
          if (!writeClientInfo) throw new Error("Could not initialize write client.");
          const { client } = writeClientInfo;

          const txHash = await client.writeContract({
            address: contractAddress,
            functionName: "transfer_certificate",
            args: [certId, toAddress],
            value: BigInt(0),
          });

          await client.waitForTransactionReceipt({ hash: txHash });
          await get().refreshState();
          return { success: true };
        } catch (err: any) {
          console.error("transferCertificate failed:", err);
          return { success: false, error: err.message || "Transfer transaction failed." };
        }
      },

      transferTokens: async (toAddress, amount) => {
        const { userAddress } = get();
        try {
          const writeClientInfo = await getWriteClient(userAddress);
          if (!writeClientInfo) throw new Error("Could not initialize write client.");
          const { client } = writeClientInfo;

          const txHash = await client.writeContract({
            address: contractAddress,
            functionName: "transfer",
            args: [toAddress, BigInt(amount)],
            value: BigInt(0),
          });

          await client.waitForTransactionReceipt({ hash: txHash });
          await get().refreshState();
          return { success: true };
        } catch (err: any) {
          console.error("transferTokens failed:", err);
          return { success: false, error: err.message || "Token transfer failed." };
        }
      },
    }),
    {
      name: "authentix-storage-v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        realItemIds: state.realItemIds,
        userAddress: state.userAddress,
      }),
    }
  )
);
