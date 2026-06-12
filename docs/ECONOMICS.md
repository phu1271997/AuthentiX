# 🪙 AuthentiX Tokenomics & Game Theory

AuthentiX utilizes the **$AUTH** utility token to align incentives between asset submitters and decentralized AI validators, preventing spam, penalizing counterfeit submissions, and rewarding authentic provenance records.

---

## ⚖️ Economic Incentive Loop

```
                        +----------------------+
                        |  Submitter (Seller)  |
                        +-----------+----------+
                                    |
                       Stakes 5 $AUTH for Submission
                                    v
                        +-----------+----------+
                        |  AuthentiX Contract  |
                        +-----------+----------+
                                    |
                    Decide consensus outcome (AI Jury)
                                    |
             +----------------------+----------------------+
             | (AUTHENTIC)                                 | (COUNTERFEIT / STOLEN)
             v                                             v
+------------+------------+                   +------------+------------+
| - Refund 5 $AUTH Stake  |                   | - Burn 5 $AUTH Stake    |
| - Pay +10 $AUTH Reward  |                   | - Permanent Serial Flag |
| - Mint Certificate NFT  |                   | - Total Supply Shrinks  |
+-------------------------+                   +-------------------------+
```

---

## ⚙️ Core Parameters

| Parameter | Value | Description |
|:---|:---|:---|
| **`initial_grant`** | `100 $AUTH` | Allocated to new users via the faucet for evaluation and initial submissions. |
| **`stake_amount`** | `5 $AUTH` | Minimum tokens locked per submission. Prevents Sybil attacks and spam. |
| **`truth_reward`** | `10 $AUTH` | Minted and distributed to submitters of verified authentic luxury goods. |
| **`burn_rate`** | `5 $AUTH` | Penalty burned directly from the total supply on counterfeit or stolen verdicts. |

---

## 🔒 Economics Invariants

1. **Anti-Spam Cost**: Submitting an item always requires having at least `5 $AUTH` tokens. This ensures that submitting hundreds of random items is economically punitive.
2. **Deflationary Counterfeit Penalty**: When a counterfeit or stolen item is identified, the staked tokens are permanently burned. This reduces `total_supply`, acting as a deflationary pressure on the token economy.
3. **Inconclusive Safety**: If validators cannot reach agreement or find insufficient details (verdict: `INCONCLUSIVE`), the `5 $AUTH` stake is refunded in full with no extra reward. This ensures submitters are not penalized for ambiguous items.
