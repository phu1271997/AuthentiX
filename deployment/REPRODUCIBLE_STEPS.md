# 🚀 Reproducible Deployment & Verification Steps

Follow this step-by-step guide to compile, deploy, and verify the AuthentiX contract in the official GenLayer Studio environment.

---

## 🎛️ Phase 1: Environment Reset

To prevent caching anomalies or conflict records:
1. Open the [GenLayer Run & Debug Studio](https://studio.genlayer.com/run-debug).
2. Click **Settings** (Gear Icon) in the bottom-left.
3. Click **Reset Storage** and confirm.
4. Force refresh the page (`Cmd+Shift+R` or `Ctrl+F5`) to ensure a completely clean database.

---

## 📦 Phase 2: Deploy Contracts

### Step 1: Deploy Storage Test (Linter Verification)
1. In the file explorer on the left, click **Create File** -> name it `storage_test.py`.
2. Open `contracts/storage_test.py` from this repository and copy the content.
3. Paste it into the file editor.
4. Click **Deploy** -> verify successful deployment.

### Step 2: Deploy AuthentiX Contract
1. Click **Create File** -> name it `authentix.py`.
2. Open `contracts/authentix.py` from this repository and copy the content.
3. Paste it into the file editor.
4. Under the class selector, verify **`AuthentiX`** is selected.
5. Click **Deploy**. Compilation takes under 2 seconds. Verify success indicator.

---

## 🕹️ Phase 3: Manual Verification Sequence

Once deployed, select the deployed `AuthentiX` contract instance from the **Deployed Contracts** sidebar:

### 1. Claim Gas and Stake
* Expand the **`claim_starter_tokens`** function.
* Click **Run**.
* Scroll to the bottom to verify the returned log shows:
  ```json
  {"status": "granted", "amount": 100}
  ```
* Call **`get_balance`** with your address to verify it now reads `100`.

### 2. Submit Luxury Item
* Expand **`submit_item`**.
* Fill in the parameters:
  * `category`: `"watch"`
  * `brand`: `"Rolex"`
  * `model`: `"Daytona"`
  * `serial_number`: `"V39A2081"`
  * `year_claimed`: `2019`
  * `image_urls_json`: `["https://images.unsplash.com/photo-1523170335258-f5ed11844a49"]` (must be valid JSON array)
  * `provenance`: `"Purchased from Sotheby's 2017."`
  * `cert_doc_url`: `"https://example.com/receipt"`
* Click **Run**.
* The transaction returns the auto-generated `item_id` (e.g. `ITEM-000001-dc18aa`).
* Call `get_balance` to verify your balance is now `95` (5 staked).

### 3. Subjective AI Consensus
* Expand **`authenticate_item`**.
* Input the `item_id` generated in the previous step.
* Click **Run**.
* GenLayer validators will fetch web evidence and run visual/textual consensus.
* If successful, the return payload includes the minted certificate ID (e.g., `AUTH-CERT-000001`).
* Call `get_balance` to verify your balance is now `110` (95 + 5 refunded + 10 reward).
