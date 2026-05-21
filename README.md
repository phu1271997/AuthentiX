# 🎨 AuthentiX — AI-Powered Authentication for Luxury Goods & Fine Art

```
     ___         __  __              __ _ _  __
    / _ \       / /_/ /_  ___  ___  / /_(_)_ \ \
   / /_/ /_____/ __/ __ \/ _ \/ _ \/ __/ /\ \ \ \
  / _, _/_____/ /_/ / / /  __/  __/ /_/ / /\ \ \ \
 /_/ |_|      \__/_/ /_/\___/\___/\__/_/_/  \_\_\_\
                                                  
```

> *Every authentic. Every traceable. Forever on-chain.*

AuthentiX is a decentralized authentication protocol built from scratch for the GenLayer hackathon. It provides visual and textual provenance validation for luxury items (Rolex, Hermès, Patek Philippe) and fine art (paintings, sculpture, limited prints) by leveraging GenLayer Intelligent Contracts.

---

## 🚨 The Problem

*   **Counterfeits are a $1.7 Trillion/year global crisis** (OECD).
*   In the secondary luxury resale market, **between 10% and 30% of transacted goods are fakes**.
*   Fine art forgery is so rampant that the FBI Art Crime Team estimates **up to 20% of museum-held art may be misattributed or forged**.
*   Traditional certification systems (like Entrupy or physical expert review) charge high flat fees, take 24–72 hours, and introduce a single point of failure (bribery, human error, or lack of auditable trails).

---

## 💡 The Solution

AuthentiX moves trust from centralized gatekeepers to a decentralized consensus of AI validator nodes.

1.  **Staked Submissions**: Sellers submit high-res item photos and detailed provenance history while staking **5 $AUTH** tokens to prevent spam.
2.  **Validator consensus**: Multiple independent AI validators inspect visual features (stitching density, serial number fonts, hallmark stamps) and fetch live records (auction results, catalog raisonnés) via GenLayer.
3.  **NFT Certificates**: If the consensus confidence passes $\ge 85\%$, the contract refunds the stake, pays a **+10 $AUTH** reward, and mints an immutable **AuthCertificate NFT** that travels with the item's on-chain ownership trail.

---

## ⚡ Why GenLayer?

AuthentiX is physically impossible on traditional smart contract networks like Ethereum or Solana because:
1.  **Subjective Analysis**: Traditional VM-based nodes cannot evaluate visual traits. GenLayer allows validator consensus using LLMs (`exec_prompt`) to make subjective decisions.
2.  **No Oracles Needed**: Oracles are brittle. GenLayer allows intelligent contracts to read web data natively (`web.render`) without trusted third-party feeds.

### Intelligent Contract Snippet (`contracts/authentix.py`):

```python
# Fetch live auction data from Sotheby's/Christie's on-chain
evidence_dump = gl.nondet.web.render(sources[0], mode="text")

# Prompt AI Jury validator consensus
prompt = f"Examine item {brand} {model} against reference specs..."
raw_verdict = gl.nondet.exec_prompt(prompt, response_format="json")
```

---

## 📦 Categories Supported

*   **Watches**: Rolex, Patek Philippe, Audemars Piguet, Omega.
*   **Handbags**: Hermès (Birkin/Kelly), Chanel, Louis Vuitton.
*   **Fine Art**: Painting, sketch work, woodcuts, sculpture.
*   **Sneakers**: Rare Nike Jordan Player Exclusives, vintage collabs.
*   **Wines & Spirits**: Vintage Bordeaux, aged Scotch casks.

---

## 🪙 Tokenomics

```
     [ Seller ] ─── Stake 5 $AUTH ───> [ AuthentiX Contract ]
         │                                       │
         │ (Verdict: AUTHENTIC >= 85%)           │ (Verdict: COUNTERFEIT/STOLEN)
         ▼                                       ▼
   Mint Cert NFT                         Burn 5 $AUTH Stake
   Refund Stake + 10 $AUTH Reward        Flag Serial Permanent
```

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Blockchain** | GenLayer Network | AI-native consensus executing Intelligent Python Contracts |
| **Frontend** | Next.js 14 (App Router) | High-performance React framework with static rendering |
| **Styling** | Tailwind CSS v4 | Luxury charcoal (`#0A0908`), gold (`#D4AF37`), emerald theme |
| **State** | Zustand | Persistent local storage for smooth demo simulations |
| **Icons & Motion**| Lucide-react + CSS | Premium vector iconography and 3D card tilt transformations |

---

## 🚀 Local Setup

To run the Next.js demo application locally:

1.  **Clone and navigate to the frontend directory**:
    ```bash
    cd "frontend"
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Launch the development server**:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ GenLayer Contract Deployment Guide

Follow these steps to run the contract suite in the GenLayer Studio:

### Step 1: Open and Reset Studio
1. Navigate to the [GenLayer Run & Debug Studio](https://studio.genlayer.com/run-debug).
2. Go to **Settings** -> Click **Reset Storage** -> Confirm.
3. Perform a hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+F5`) to clear cache.

### Step 2: Deploy Sanity Contract First
1. Create a new contract file named `storage_test.py` and paste the contents of `contracts/storage_test.py`.
2. Click **Deploy** -> Verify successful deployment.

### Step 3: Deploy AuthentiX Contract
1. Create a new contract file named `authentix.py` and paste the contents of `contracts/authentix.py`.
2. Click **Deploy** -> Verify successful compilation.

### Step 4: Interact with the Contract
1. **Claim Tokens**: Click on the `claim_starter_tokens` function and run it. Your address is granted 100 $AUTH tokens.
2. **Register Asset**: Call `submit_item` with test parameters (e.g. `category="watch"`, `brand="Rolex"`, `model="Submariner 116610LN"`, `image_urls="..."`).
3. **Execute AI Jury**: Call `authenticate_item` using the `item_id` you registered. Wait for the validators to process.
4. **View Certification**: Call `get_certificate` with the returned `certificate_id` to inspect NFT metadata on-chain.

---

## 🏆 Hackathon Submission Info
*   **Project Name**: AuthentiX
*   **Track**: AI-Native dApps
*   **License**: MIT
