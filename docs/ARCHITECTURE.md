# 🎨 AuthentiX Architecture & Technical Deep Dive

AuthentiX is an AI-powered authentication dApp powered by GenLayer's Intelligent Contracts. This document details the application's components, sequence flows, data structures, and validator checklists.

---

## 🌐 High-Level System Architecture

```mermaid
graph TD
    User[Seller / Submitter] -->|1. Submit details + 5 AUTH stake| FE[Next.js Frontend]
    FE -->|2. Invoke transaction| GL[GenLayer Network]
    
    subgraph GenLayer Validator Consensus
        Contract[AuthentiX Contract] -->|3. run_nondet_unsafe| Leader[Leader Node]
        Leader -->|4. web.render| Web[Web Sources: Chrono24, Sotheby's, Art Loss Register]
        Leader -->|5. exec_prompt| AI[Visual LLM Inspection]
        AI -->|6. Generate Verdict JSON| Leader
        Leader -->|7. Distribute Verdict| Validators[Validator Nodes]
        Validators -->|8. Verify web + AI output| Contract
    end
    
    Contract -->|9a. Verdict: AUTHENTIC| Mint[Mint AuthCertificate NFT & Refund + Reward]
    Contract -->|9b. Verdict: COUNTERFEIT/STOLEN| Burn[Burn $AUTH Stake & Flag Serial]
    Contract -->|9c. Verdict: INCONCLUSIVE| Refund[Refund Stake & Recommend Expert Review]
    
    Mint -->|10. Display| FE
    Burn -->|10. Display| FE
    Refund -->|10. Display| FE
```

---

## ⚡ Smart Contract State Transitions

The lifecycle of an item submitted to the AuthentiX protocol transitions through the following states:

```mermaid
stateDiagram-v2
    [*] --> PENDING : submit_item() & Stake 5 $AUTH
    
    state PENDING {
        [*] --> WebScrape : web.render()
        WebScrape --> LLMEvaluation : exec_prompt()
        LLMEvaluation --> ValidatorConsensus : Consensus Voting
    }
    
    PENDING --> AUTHENTIC : Confidence >= 85% (Mint Certificate, Refund + 10 $AUTH)
    PENDING --> COUNTERFEIT : Confidence >= 85% (Burn Stake, Flag Serial)
    PENDING --> STOLEN_FLAGGED : DB Match (Burn Stake, Flag Serial, Stolen Alert)
    PENDING --> INCONCLUSIVE : Confidence < 85% (Refund Stake, Flag Expert Escalation)
    
    AUTHENTIC --> [*] : transfer_certificate()
    COUNTERFEIT --> [*] : Locked Entry
    STOLEN_FLAGGED --> [*] : Locked Entry
    INCONCLUSIVE --> [*] : Re-submit with new proof
```

---

## 🔄 Sequence Diagram: Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Seller
    participant FE as Next.js App
    participant GL as GenLayer Node (Leader)
    participant Web as Web (e.g. Chrono24, Sotheby's)
    participant AI as Visual LLM Validator
    participant Chain as On-Chain Ledger

    User->>FE: Fill category, details, image URLs & click Submit
    FE->>Chain: Transaction: submit_item() locks 5 $AUTH
    FE->>GL: Transaction: authenticate_item()
    Note over GL: Contract enters non-deterministic block
    GL->>Web: gl.nondet.web.render(url)
    Web-->>GL: Return raw webpage text/specs
    GL->>AI: gl.nondet.exec_prompt(prompt + images)
    Note over AI: Forensic Checklist visual & text review
    AI-->>GL: Return JSON Verdict
    Note over GL: Validators verify consensus results
    GL->>Chain: Mint NFT Certificate, credit/burn tokens, update status
    Chain-->>FE: Event: Status updated
    FE->>User: Play stamp animation and show final report
```

---

## 🧠 Forensic AI Validator Checklists

AuthentiX prompts validators with customized forensic checklists depending on the category:

### 1. Watches (e.g. Rolex, Patek Philippe)
*   **Cyclops Magnification**: Does the date magnifier display at exactly 2.5x with correct font?
*   **Rehaut Laser Alignment**: Are the crown and logo text aligned with the minute ticks?
*   **Bracelet and Clasp**: Are the engravings deep and crisp? Is the metal weight compliant?
*   **Luminescence**: Does ultraviolet light illuminate standard Chromalight/Super-LumiNova colors?

### 2. Fine Art (e.g. Paintings, Drawings)
*   **Brushstroke Signatures**: Are the strokes and pigments consistent with the artist's era and late/early period?
*   **Material Support**: Does the canvas or wood alignment match standard reference sheets?
*   **Refinishing (Refinished Dial)**: Has a paint layer been redone (damaging original features)?
*   **Stolen Cross-Reference**: Does the work match active Interpol and Art Loss lists?

### 3. Handbags (e.g. Hermès Birkin, Chanel)
*   **Saddle Stitching**: Does the stitching show the manual 15-degree slant of hand sewing?
*   **Stitch Density**: Are there exactly 8 stitches per inch (factory standard)?
*   **Logo Foil Stamps**: Does the gold foil text align exactly with the parallel stitching rows?
*   **Palladium Hardware**: Are the weight, screw dimensions, and engraving depths consistent with reference targets?

---

## ⚖️ Why Traditional Web3 Cannot Do This

| Criteria | Ethereum / EVM | Chainlink Oracles | GenLayer (AuthentiX) |
| :--- | :--- | :--- | :--- |
| **Visual Processing** | Impossible (EVM is deterministic only) | No native image support | Yes (`exec_prompt` with image specs) |
| **Subjective Decision Making** | Impossible (Code must compile statically) | No (Oracles only push numeric/exact data) | Yes (consensual agreement on fuzzy logic) |
| **Web Data Scraping** | Impossible (No internet access) | High fee, laggy, multi-party setup | Yes (native `web.render` text mode) |
| **Auditing Cost** | High gas fees | Oracle fees + gas | 5 $AUTH Stake (Earn on Pass) |
