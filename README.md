# 🎨 AuthentiX — AI-Powered Authentication for Luxury Goods & Fine Art

```
     ___         __  __              __ _ _  __
    / _ \       / /_/ /_  ___  ___  / /_(_)_ \ \
   / /_/ /_____/ __/ __ \/ _ \/ _ \/ __/ /\ \ \ \
  / _, _/_____/ /_/ / / /  __/  __/ /_/ / /\ \ \ \
 /_/ |_|      \__/_/ /_/\___/\___/\__/_/_/  \_\_\_\
                                                  
```

> *Every authentic. Every traceable. Forever on-chain.*

---

### 🔗 Deployed Contract Metadata (studionet)

| Attribute | Value |
| :--- | :--- |
| **Contract Address** | `0x52f3f4FbA76BF059968450b95af77731349EDA32` |
| **Contract Class Name** | `AuthentiX` *(Renamed from `Contract` for compiler compliance)* |
| **Network** | `studionet` |
| **GenLayer Studio Tool** | [GenLayer Run & Debug Studio](https://studio.genlayer.com/run-debug) |

---

AuthentiX is a decentralized authentication protocol built from scratch for the GenLayer Builder Program. It provides visual and textual provenance validation for luxury items (Rolex, Hermès, Patek Philippe) and fine art (paintings, sculpture, limited prints) by leveraging GenLayer Intelligent Contracts.

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

## 🚀 Local Setup & Execution

### Running the Frontend Locally:
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Launch the development server**:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Evaluator Demo Sandbox (No MetaMask Required)

To make evaluation seamless for the GenLayer Builder review team, we built an **Interactive Test Sandbox** directly into the frontend. 

1. Navigate to the **Demo Scenarios** tab in the top navigation bar.
2. Select any of the 3 pre-seeded scenarios:
   * **Rolex Cosmograph Daytona (Authentic)**: Verifies visual matches of a genuine 1968 timepiece and updates ownership.
   * **Hermès Birkin 30 (Counterfeit)**: Detects design hallmarks mismatching reference specs.
   * **Picasso — Le Rêve (Stolen/Flagged)**: Queries stolen art databases and flags the asset.
3. Click **Run Simulation**. The application automatically generates an ephemeral sandbox wallet, requests starter gas and stake tokens from the faucet, submits the item, and opens the **Forensic Jury Console** so you can watch validator votes process in real-time.

---

## 🧪 Unit Testing Suite (Direct Mode)

We have implemented a comprehensive test suite with **19 test cases** covering storage, tokenomics, NFT transfers, case-insensitive address normalization, and consensus edge cases. Tests run in **GenLayer Direct Mode** (in-memory simulation) for maximum speed.

### Running tests locally:
1. Ensure `genlayer-test` is installed:
   ```bash
   pip install genlayer-test pytest
   ```
2. Execute the test suite from the project root:
   ```bash
   pytest tests/ -v
   ```

---

## 📖 Technical & Protocol Documentation

*   [🎨 System Architecture & Sequence Flows](docs/ARCHITECTURE.md)
*   [🪙 Tokenomics, Burn & Incentive Models](docs/ECONOMICS.md)
*   [🛡️ Security Specifications & Prompt Canary Defenses](docs/SECURITY.md)
*   [🚀 Reproducible GenLayer Studio Steps](deployment/REPRODUCIBLE_STEPS.md)

---

## 🏆 Hackathon Submission Info
*   **Project Name**: AuthentiX
*   **Track**: Builder Program Submission / AI-Native Protocol
*   **License**: MIT
