# v0.2.16
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import json

# === Helper functions ===

def safe_address(value: str) -> str:
    """Normalize address input. Raises UserError if invalid."""
    try:
        return str(Address(value))
    except Exception:
        raise gl.vm.UserError(f"Invalid address: {value}")

def normalize_verdict(raw: dict) -> dict:
    """Sanitize AI Jury output to known schema."""
    valid_verdicts = ["AUTHENTIC", "COUNTERFEIT", "INCONCLUSIVE", "STOLEN_FLAGGED"]
    verdict = str(raw.get("verdict", "INCONCLUSIVE")).upper()
    if verdict not in valid_verdicts:
        verdict = "INCONCLUSIVE"
    
    confidence_raw = raw.get("confidence", 0)
    try:
        confidence = int(round(float(confidence_raw)))
    except Exception:
        confidence = 0
    confidence = max(0, min(100, confidence))
    
    forensic_findings = raw.get("forensic_findings", [])
    if not isinstance(forensic_findings, list):
        forensic_findings = []
    findings = [str(f).strip() for f in forensic_findings if str(f).strip()][:8]
    
    cross_references = raw.get("cross_references", [])
    if not isinstance(cross_references, list):
        cross_references = []
    refs = [str(r).strip() for r in cross_references if str(r).strip()][:5]
    
    return {
        "verdict": verdict,
        "confidence": confidence,
        "forensic_findings": findings,
        "cross_references": refs,
        "reasoning": str(raw.get("reasoning", "No reasoning provided.")).strip()[:3000],
        "estimated_value_usd": int(raw.get("estimated_value_usd", 0)) if str(raw.get("estimated_value_usd", "")).strip().lstrip("-").isdigit() else 0,
    }

def verdict_is_valid(data) -> bool:
    """Validator check — re-runs leader_fn output validation."""
    if not isinstance(data, dict):
        return False
    if str(data.get("verdict", "")).upper() not in ["AUTHENTIC", "COUNTERFEIT", "INCONCLUSIVE", "STOLEN_FLAGGED"]:
        return False
    try:
        c = int(round(float(data.get("confidence", -1))))
        if c < 0 or c > 100:
            return False
    except Exception:
        return False
    if not isinstance(data.get("forensic_findings", []), list):
        return False
    return True

# === Main Contract ===

class Contract(gl.Contract):
    # Storage field DECLARATIONS — auto zero-initialized by GenVM
    items: TreeMap[str, str]               # item_id -> JSON-encoded item
    certificates: TreeMap[str, str]        # cert_id -> JSON-encoded certificate NFT
    balances: TreeMap[str, u256]           # address -> $AUTH balance
    ownership: TreeMap[str, str]           # cert_id -> current owner address
    user_items: TreeMap[str, str]          # address -> JSON list of item_ids submitted
    
    total_supply: u256
    token_symbol: str
    item_counter: u256
    cert_counter: u256
    initial_grant: u256                    # tokens given to new users
    stake_amount: u256                     # tokens locked per submission
    truth_reward: u256                     # bonus for authentic items

    def __init__(self):
        # ONLY primitives here — TreeMaps auto-init to empty
        self.total_supply = u256(0)
        self.token_symbol = "AUTH"
        self.item_counter = u256(0)
        self.cert_counter = u256(0)
        self.initial_grant = u256(100)
        self.stake_amount = u256(5)
        self.truth_reward = u256(10)

    @gl.public.write
    def claim_starter_tokens(self) -> str:
        """New users claim 100 AUTH to get started. One-time per address."""
        sender = str(gl.message.sender_address)
        current_balance = self.balances.get(sender, u256(0))
        if current_balance > u256(0):
            raise gl.vm.UserError("Already claimed starter tokens")
        self.balances[sender] = self.initial_grant
        self.total_supply = self.total_supply + self.initial_grant
        return json.dumps({
            "status": "granted",
            "amount": int(self.initial_grant),
            "balance": int(self.initial_grant),
        })

    @gl.public.write
    def submit_item(
        self,
        item_id: str,
        category: str,            # "watch", "handbag", "painting", "sculpture", "sneakers", "wine", etc.
        brand: str,               # "Rolex", "Hermès", "Picasso", etc.
        model: str,               # "Submariner 116610LN", "Birkin 30", "Les Demoiselles d'Avignon"
        serial_number: str,       # Or signature ID for art
        year_claimed: int,        # Year of manufacture/creation
        image_urls: str,          # Comma-separated URLs to high-res photos
        provenance: str,          # Ownership history: "Bought from Sotheby's 2019; Prior: Rockefeller Estate"
        cert_doc_url: str,        # URL to certificate of authenticity (if any)
    ) -> str:
        """Submit an item for authentication. Stakes 5 AUTH tokens."""
        # Validate inputs
        item_id = item_id.strip()
        category = category.strip().lower()
        brand = brand.strip()
        model = model.strip()
        
        if not item_id:
            raise gl.vm.UserError("item_id required")
        if self.items.get(item_id, "") != "":
            raise gl.vm.UserError("item_id already exists")
        if not category or not brand or not model:
            raise gl.vm.UserError("category, brand, and model are required")
        if year_claimed < 1000 or year_claimed > 2030:
            raise gl.vm.UserError("year_claimed must be between 1000-2030")
        if not image_urls.strip():
            raise gl.vm.UserError("At least one image_url is required")
        
        sender = str(gl.message.sender_address)
        balance = self.balances.get(sender, u256(0))
        if balance < self.stake_amount:
            raise gl.vm.UserError("Insufficient AUTH balance to stake")
        
        # Lock stake
        self.balances[sender] = balance - self.stake_amount
        self.item_counter = self.item_counter + u256(1)
        
        item = {
            "id": item_id,
            "submitter": sender,
            "category": category,
            "brand": brand,
            "model": model,
            "serial_number": serial_number.strip(),
            "year_claimed": year_claimed,
            "image_urls": image_urls.strip(),
            "provenance": provenance.strip(),
            "cert_doc_url": cert_doc_url.strip(),
            "status": "PENDING",
            "verdict": "",
            "confidence": 0,
            "forensic_findings": [],
            "cross_references": [],
            "reasoning": "",
            "estimated_value_usd": 0,
            "stake_locked": int(self.stake_amount),
            "reward_paid": 0,
            "certificate_id": "",
            "item_number": int(self.item_counter),
        }
        self.items[item_id] = json.dumps(item, sort_keys=True)
        
        return json.dumps({
            "status": "submitted",
            "item_id": item_id,
            "item_number": int(self.item_counter),
            "balance_remaining": int(self.balances[sender]),
        })

    @gl.public.write
    def authenticate_item(self, item_id: str) -> str:
        """
        Triggers AI Jury to perform forensic analysis.
        AI examines images, cross-references databases, validates provenance.
        """
        item_raw = self.items.get(item_id, "")
        if item_raw == "":
            raise gl.vm.UserError("Unknown item_id")
        
        item = json.loads(item_raw)
        if item["status"] != "PENDING":
            raise gl.vm.UserError("Item already authenticated")
        
        category = str(item["category"])
        brand = str(item["brand"])
        model = str(item["model"])
        serial = str(item["serial_number"])
        year = int(item["year_claimed"])
        image_urls = str(item["image_urls"])
        provenance = str(item["provenance"])
        cert_doc_url = str(item["cert_doc_url"])
        submitter = str(item["submitter"])
        
        # Cross-reference sources based on category
        # Different sources for watches vs art vs handbags
        if category in ["watch", "watches"]:
            sources = [
                f"https://www.chrono24.com/search/index.htm?query={brand}+{model}",
                "https://www.hodinkee.com",
            ]
        elif category in ["painting", "sculpture", "art", "drawing"]:
            sources = [
                f"https://www.sothebys.com/en/search?keyword={brand}",
                f"https://www.christies.com/en/search?searchphrase={brand}",
            ]
        elif category in ["handbag", "bag", "leather"]:
            sources = [
                f"https://www.therealreal.com/products?keywords={brand}+{model}",
                "https://www.vestiairecollective.com",
            ]
        else:
            sources = [
                f"https://www.google.com/search?q={brand}+{model}+authentic+features",
            ]
        
        def leader_fn():
            # Fetch cross-reference data from authoritative sources
            evidence_dump = ""
            for src in sources[:2]:  # Limit to 2 to manage token budget
                try:
                    snippet = gl.nondet.web.render(src, mode="text")
                    evidence_dump += f"\n\n=== {src} ===\n{snippet[:1200]}"
                except Exception as e:
                    evidence_dump += f"\n\n=== {src} ===\n[Unable to fetch]"
            
            # Build category-specific forensic prompt
            forensic_checklist = ""
            if category in ["watch", "watches"]:
                forensic_checklist = """
- Crown logo crispness and engraving depth
- Dial printing alignment and font consistency
- Movement visible through caseback (if applicable)
- Bracelet clasp engravings
- Serial number font, depth, and placement
- Date wheel font and magnification (cyclops)
- Lume application uniformity
"""
            elif category in ["handbag", "bag", "leather"]:
                forensic_checklist = """
- Stitching density (target ~6-8 stitches per inch for Hermès)
- Hardware quality: weight, plating, screw heads
- Logo placement, font, and embossing depth
- Leather grain consistency and edge painting
- Interior lining material and brand stamps
- Date code / serial location and font
- Tab/zipper pull markings
"""
            elif category in ["painting", "sculpture", "art", "drawing"]:
                forensic_checklist = """
- Brushstroke characteristics matching artist's known style
- Pigment composition consistent with claimed era
- Canvas/support material consistent with period
- Signature placement, slant, and pressure
- Craquelure pattern (aging) authenticity
- Provenance gaps or red flags
- Match against catalogue raisonné
"""
            else:
                forensic_checklist = """
- Material quality and craftsmanship
- Brand-specific identifiers
- Manufacturing date code consistency
- Wear patterns appropriate for claimed age
- Any anomalies suggesting reproduction
"""
            
            prompt = f"""
You are an expert AI forensic authenticator for AuthentiX, a decentralized luxury goods & art authentication protocol.

YOUR TASK: Examine the submitted item and determine if it is AUTHENTIC, COUNTERFEIT, INCONCLUSIVE, or matches a STOLEN_FLAGGED record.

ITEM DETAILS:
- Category: {category}
- Brand/Artist: {brand}
- Model/Title: {model}
- Serial/Signature: {serial}
- Year Claimed: {year}
- Image URLs (you should reason about typical appearance for this item type): {image_urls}
- Provenance Provided: {provenance}
- Certificate Document URL: {cert_doc_url if cert_doc_url else "None provided"}

FORENSIC CHECKLIST FOR {category.upper()}:
{forensic_checklist}

CROSS-REFERENCE DATA FROM AUTHORITATIVE SOURCES:
{evidence_dump}

ANALYSIS INSTRUCTIONS:
1. Evaluate whether the brand/model combination is plausible for the claimed year (e.g., Rolex Submariner 116610LN was produced 2010-2020)
2. Assess provenance: are there gaps, inconsistencies, or red flags?
3. Cross-reference serial number patterns with brand databases
4. Consider current market price range for authentic version
5. Be CONSERVATIVE: prefer INCONCLUSIVE over FALSE positives

CLASSIFICATION RULES:
- AUTHENTIC: strong evidence supports authenticity, no red flags
- COUNTERFEIT: clear evidence of fakery (impossible serial, wrong era specs, provenance fraud)
- INCONCLUSIVE: insufficient evidence to determine — recommend human expert
- STOLEN_FLAGGED: matches known stolen item registry (Art Loss Register, Interpol)

Return STRICT JSON with EXACTLY this schema:
{{
  "verdict": "AUTHENTIC" | "COUNTERFEIT" | "INCONCLUSIVE" | "STOLEN_FLAGGED",
  "confidence": integer 0-100,
  "forensic_findings": [
    "Brief specific finding 1 (e.g., 'Serial number format matches Rolex 2015-2018 production')",
    "Brief specific finding 2",
    "Brief specific finding 3"
  ],
  "cross_references": [
    "URL or database name supporting the verdict"
  ],
  "reasoning": "3-5 sentence detailed justification of verdict",
  "estimated_value_usd": integer (current market value if authentic, 0 if counterfeit)
}}
""".strip()
            
            raw_verdict = gl.nondet.exec_prompt(prompt, response_format="json")
            return normalize_verdict(raw_verdict)
        
        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            return verdict_is_valid(leader_result.calldata)
        
        verdict = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        
        # Apply economic consequences and minting based on verdict
        stake_locked = u256(int(item["stake_locked"]))
        reward_amount = u256(0)
        burned_amount = u256(0)
        cert_id = ""
        
        if verdict["verdict"] == "AUTHENTIC" and verdict["confidence"] >= 85:
            # Mint AuthCertificate NFT, refund stake + reward
            self.cert_counter = self.cert_counter + u256(1)
            cert_id = f"AUTH-CERT-{int(self.cert_counter):06d}"
            
            certificate = {
                "cert_id": cert_id,
                "item_id": item_id,
                "category": category,
                "brand": brand,
                "model": model,
                "serial_number": serial,
                "year_claimed": year,
                "verdict": "AUTHENTIC",
                "confidence": verdict["confidence"],
                "forensic_findings": verdict["forensic_findings"],
                "estimated_value_usd": verdict["estimated_value_usd"],
                "minted_to": submitter,
                "mint_number": int(self.cert_counter),
            }
            self.certificates[cert_id] = json.dumps(certificate, sort_keys=True)
            self.ownership[cert_id] = submitter
            
            # Refund stake + reward
            reward_amount = stake_locked + self.truth_reward
            self.balances[submitter] = self.balances.get(submitter, u256(0)) + reward_amount
            self.total_supply = self.total_supply + self.truth_reward
            
            item["status"] = "AUTHENTIC"
            item["certificate_id"] = cert_id
            item["reward_paid"] = int(reward_amount)
        elif verdict["verdict"] == "COUNTERFEIT" and verdict["confidence"] >= 85:
            # Burn stake permanently
            burned_amount = stake_locked
            self.total_supply = self.total_supply - burned_amount
            item["status"] = "COUNTERFEIT"
        elif verdict["verdict"] == "STOLEN_FLAGGED":
            # Burn stake + flag permanently
            burned_amount = stake_locked
            self.total_supply = self.total_supply - burned_amount
            item["status"] = "STOLEN_FLAGGED"
        else:
            # INCONCLUSIVE or low-confidence: return stake
            self.balances[submitter] = self.balances.get(submitter, u256(0)) + stake_locked
            item["status"] = "INCONCLUSIVE"
        
        # Update item state with full forensic report
        item["verdict"] = verdict["verdict"]
        item["confidence"] = verdict["confidence"]
        item["forensic_findings"] = verdict["forensic_findings"]
        item["cross_references"] = verdict["cross_references"]
        item["reasoning"] = verdict["reasoning"]
        item["estimated_value_usd"] = verdict["estimated_value_usd"]
        self.items[item_id] = json.dumps(item, sort_keys=True)
        
        return json.dumps({
            "status": item["status"],
            "item_id": item_id,
            "certificate_id": cert_id,
            "verdict": verdict,
            "reward_paid": int(reward_amount),
            "burned": int(burned_amount),
            "submitter_balance": int(self.balances.get(submitter, u256(0))),
        })

    @gl.public.write
    def transfer_certificate(self, cert_id: str, to: str) -> str:
        """Transfer ownership of an AuthCertificate NFT to another address."""
        cert_raw = self.certificates.get(cert_id, "")
        if cert_raw == "":
            raise gl.vm.UserError("Unknown cert_id")
        
        current_owner = self.ownership.get(cert_id, "")
        sender = str(gl.message.sender_address)
        if current_owner != sender:
            raise gl.vm.UserError("Only current owner can transfer")
        
        new_owner = safe_address(to)
        self.ownership[cert_id] = new_owner
        
        return json.dumps({
            "status": "transferred",
            "cert_id": cert_id,
            "from": sender,
            "to": new_owner,
        })

    @gl.public.view
    def get_item(self, item_id: str) -> str:
        item_raw = self.items.get(item_id, "")
        if item_raw == "":
            raise gl.vm.UserError("Unknown item_id")
        return item_raw

    @gl.public.view
    def get_certificate(self, cert_id: str) -> str:
        cert_raw = self.certificates.get(cert_id, "")
        if cert_raw == "":
            raise gl.vm.UserError("Unknown cert_id")
        owner = self.ownership.get(cert_id, "")
        cert = json.loads(cert_raw)
        cert["current_owner"] = owner
        return json.dumps(cert, sort_keys=True)

    @gl.public.view
    def get_balance(self, address: str) -> u256:
        addr = safe_address(address)
        return self.balances.get(addr, u256(0))

    @gl.public.view
    def get_total_supply(self) -> u256:
        return self.total_supply

    @gl.public.view
    def get_item_count(self) -> u256:
        return self.item_counter

    @gl.public.view
    def get_certificate_count(self) -> u256:
        return self.cert_counter

    @gl.public.write
    def transfer(self, to: str, amount: u256) -> str:
        """Standard ERC-20-like transfer of $AUTH tokens."""
        recipient = safe_address(to)
        sender = str(gl.message.sender_address)
        if amount <= u256(0):
            raise gl.vm.UserError("Amount must be positive")
        sender_balance = self.balances.get(sender, u256(0))
        if sender_balance < amount:
            raise gl.vm.UserError("Insufficient balance")
        self.balances[sender] = sender_balance - amount
        self.balances[recipient] = self.balances.get(recipient, u256(0)) + amount
        return json.dumps({
            "status": "transferred",
            "from": sender,
            "to": recipient,
            "amount": int(amount),
        })
