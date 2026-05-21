export interface Item {
  id: string;
  submitter: string;
  category: string;
  brand: string;
  model: string;
  serial_number: string;
  year_claimed: number;
  image_urls: string; // Comma-separated or array
  provenance: string;
  cert_doc_url: string;
  status: "PENDING" | "AUTHENTIC" | "COUNTERFEIT" | "INCONCLUSIVE" | "STOLEN_FLAGGED";
  verdict: string;
  confidence: number;
  forensic_findings: string[];
  cross_references: string[];
  reasoning: string;
  estimated_value_usd: number;
  stake_locked: number;
  reward_paid: number;
  certificate_id: string;
  item_number: number;
  created_at: string;
}

export const mockItems: Item[] = [
  {
    id: "item-rolex-001",
    submitter: "0x7a83B367a127B08a54d6D40B2D4b4458315Bc496",
    category: "watch",
    brand: "Rolex",
    model: "Submariner 116610LN",
    serial_number: "V39A2081",
    year_claimed: 2015,
    image_urls: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    provenance: "Purchased from authorized Rolex dealer in Zurich (Beyer Chronometrie) in June 2015. Single owner, kept in safe. Complete box and papers included.",
    cert_doc_url: "https://authentix.protocol/docs/rolex-cert-v39.pdf",
    status: "AUTHENTIC",
    verdict: "AUTHENTIC",
    confidence: 98,
    forensic_findings: [
      "Rehype laser engraving align perfectly with dial index markings.",
      "Crown logo magnification ratio under cyclops is exactly 2.5x with correct date font.",
      "Serial number V39A2081 matches 2015 production run records.",
      "Weight of the oystersteel case is 155g, perfectly consistent with specifications.",
      "Luminescent material (Chromalight) emits correct blue wavelength under UV."
    ],
    cross_references: [
      "https://www.chrono24.com/search/index.htm?query=Rolex+Submariner+116610LN",
      "https://www.hodinkee.com/articles/rolex-submariner-116610ln-reference-points"
    ],
    reasoning: "The submitted Rolex Submariner matches all technical and weight specifications for reference 116610LN manufactured in 2015. The cyclops date magnifier shows the correct 2.5x magnification, font stroke-weight, and anti-reflective coating. Laser engravings on the rehaut and clasp match the genuine serial sequence. No visual anomalies or reproduction markers were detected by the validator consensus.",
    estimated_value_usd: 12500,
    stake_locked: 5,
    reward_paid: 15,
    certificate_id: "AUTH-CERT-000001",
    item_number: 1,
    created_at: "2026-05-18T10:00:00Z"
  },
  {
    id: "item-hermes-002",
    submitter: "0x3e18aFd8289410Bf52B62143d410B2d99215A4ab",
    category: "handbag",
    brand: "Hermès",
    model: "Birkin 30 Togo Etain",
    serial_number: "D-AM-892-PT",
    year_claimed: 2019,
    image_urls: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    provenance: "Acquired at Sotheby's Paris Auction, June 2022. Lot 148. Previously owned by a private collector in Geneva.",
    cert_doc_url: "https://sothebys.com/en/buy/auction/2022/handbags-accessories-2/hermes-etain-togo-birkin-30",
    status: "AUTHENTIC",
    verdict: "AUTHENTIC",
    confidence: 96,
    forensic_findings: [
      "Stitch pattern displays the classic Hermès 'saddle stitch' (couture sellier) with natural 15-degree slant.",
      "Togo leather texture shows correct pebbled grain size and faint veining.",
      "Hardware (palladium plated) weighs within 0.2g of reference sample; engravings are crisp and sans-serif.",
      "Logo foil stamp 'HERMÈS PARIS MADE IN FRANCE' aligns exactly with the stitching row."
    ],
    cross_references: [
      "https://www.therealreal.com/products?keywords=Hermes+Birkin+30+Togo",
      "https://www.vestiairecollective.com/women-bags/handbags/hermes/birkin-30/"
    ],
    reasoning: "The craftsmanship exhibited matches the rigorous standards of Hermès workshops. The saddle stitching is hand-sewn using beeswax-coated linen thread with the characteristic slight angle. The leather displays natural Togo graining, appropriate weight, and correct aroma. The foil stamp is pristine and properly pressed, confirming 2019 production.",
    estimated_value_usd: 18000,
    stake_locked: 5,
    reward_paid: 15,
    certificate_id: "AUTH-CERT-000002",
    item_number: 2,
    created_at: "2026-05-19T14:30:00Z"
  },
  {
    id: "item-lv-003",
    submitter: "0x892Bf89410Bf52B62143d410B2d99215A4ab412B",
    category: "handbag",
    brand: "Louis Vuitton",
    model: "Neverfull MM Monogram",
    serial_number: "GI4210",
    year_claimed: 2020,
    image_urls: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    provenance: "Purchased from a luxury reseller on eBay. Claimed to be brand new.",
    cert_doc_url: "",
    status: "COUNTERFEIT",
    verdict: "COUNTERFEIT",
    confidence: 94,
    forensic_findings: [
      "Monogram pattern is misaligned; the symbols are cropped at the seam lines.",
      "Date code GI4210 translates to the 41st week of 2020 in Spain, but this model features a 'Made in France' interior stamp, creating a location discrepancy.",
      "Stitching density is inconsistent: ranges from 4 to 6 stitches per inch, failing factory standard of 8 per inch.",
      "Interior lining canvas has a plasticky sheen and chemical odor."
    ],
    cross_references: [
      "https://www.therealreal.com/products?keywords=Louis+Vuitton+Neverfull+MM"
    ],
    reasoning: "The item displays multiple critical indicators of counterfeit manufacturing. First, there is a location conflict between the date code 'GI' (indicating Spain) and the embossed stamp 'Made in France'. Second, the classic monogram canvas is misaligned at the side seams, which does not happen in authentic Louis Vuitton bags. Lastly, the sloppy stitching fails the brand's quality controls.",
    estimated_value_usd: 0,
    stake_locked: 5,
    reward_paid: 0,
    certificate_id: "",
    item_number: 3,
    created_at: "2026-05-20T09:15:00Z"
  },
  {
    id: "item-patek-004",
    submitter: "0x9815Ac54d6D40B2D4b4458315Bc4967a83B367a1",
    category: "watch",
    brand: "Patek Philippe",
    model: "Vintage Calatrava 3445",
    serial_number: "1128902",
    year_claimed: 1965,
    image_urls: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    provenance: "Passed down from grandfather. No box or original purchase invoice.",
    cert_doc_url: "",
    status: "INCONCLUSIVE",
    verdict: "INCONCLUSIVE",
    confidence: 60,
    forensic_findings: [
      "Dial printing has been refinished ('redone dial'), which degrades original texture verification.",
      "Movement (Caliber 27-460M) appears genuine, but showing non-original replacement screws on the bridge.",
      "Gold hallmark on the case is heavily worn down and cannot be authenticated through images.",
      "Provenance gaps: lack of service history or archive extracts."
    ],
    cross_references: [
      "https://www.sothebys.com/en/search?keyword=Patek+Philippe+Calatrava+3445"
    ],
    reasoning: "While the core movement blocks match a genuine Patek Philippe Caliber 27-460M, the dial has been completely repainted (refinished), and several movement screws are non-OEM service parts. Due to the high wear on the case hallmarks and the lack of historical records, we cannot conclusively authenticate this item through virtual inspection. Recommendation is physical submission to Patek Philippe for an Extract from the Archives.",
    estimated_value_usd: 8500,
    stake_locked: 5,
    reward_paid: 0,
    certificate_id: "",
    item_number: 4,
    created_at: "2026-05-20T16:20:00Z"
  },
  {
    id: "item-picasso-005",
    submitter: "0x2D4b4458315Bc4967a83B367a127B08a54d6D40B",
    category: "painting",
    brand: "Pablo Picasso",
    model: "Femme au Chapeau (Sketch)",
    serial_number: "P-1942-890",
    year_claimed: 1942,
    image_urls: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800",
    provenance: "Acquired from a private estate in Leipzig, Germany, 1998. Supposedly hidden during WWII.",
    cert_doc_url: "",
    status: "STOLEN_FLAGGED",
    verdict: "STOLEN_FLAGGED",
    confidence: 99,
    forensic_findings: [
      "Dimensions and medium (charcoal on paper) perfectly match Art Loss Register record #ALR-1942-098.",
      "Signature details are identical to the lost artwork reported from a Parisian gallery in 1944.",
      "Item serial and provenance description match Interpol Stolen Art Database ID #INT-89021."
    ],
    cross_references: [
      "https://www.sothebys.com/en/search?keyword=Picasso+1942",
      "https://www.artloss.com"
    ],
    reasoning: "CRITICAL ALERT: This sketch matches the catalogued specifications and visuals of Pablo Picasso's 'Femme au Chapeau' (1942), which was documented as looted from the Rosenberg gallery in Paris in 1944. The record is flagged in the Art Loss Register and Interpol database. In accordance with blockchain compliance policies, the submitter's stake is burned, and the item's on-chain record is permanently flagged.",
    estimated_value_usd: 350000,
    stake_locked: 5,
    reward_paid: 0,
    certificate_id: "",
    item_number: 5,
    created_at: "2026-05-21T11:00:00Z"
  },
  {
    id: "item-banksy-006",
    submitter: "0x127B08a54d6D40B2D4b4458315Bc4967a83B367a1",
    category: "painting",
    brand: "Banksy",
    model: "Girl with Balloon (Print #143/150)",
    serial_number: "B-CERT-0143",
    year_claimed: 2004,
    image_urls: "https://images.unsplash.com/photo-1579783928621-7a13d66a6211?auto=format&fit=crop&q=80&w=800",
    provenance: "Purchased from Pictures on Walls gallery in London, 2004. Includes pest control card from Pest Control Office (Banksy's official authentication body).",
    cert_doc_url: "https://authentix.protocol/docs/pest-control-0143.pdf",
    status: "AUTHENTIC",
    verdict: "AUTHENTIC",
    confidence: 97,
    forensic_findings: [
      "Screenprint ink density and paper weight (350gsm) conform to original 2004 run.",
      "Signed signature in hand-written pencil matches Banksy's handwriting slant.",
      "Pest Control certificate serial matches the official Pest Control database entry for print #143.",
      "Stamp mark on the reverse is correctly embossed and positioned."
    ],
    cross_references: [
      "https://www.christies.com/en/search?searchphrase=Banksy+Girl+with+Balloon",
      "https://pestcontroloffice.com"
    ],
    reasoning: "The screenprint is verified as part of the original 2004 edition of 150 signed prints. The pencil signature on the bottom right and the print numbering '143/150' match reference prints from the same batch. Most importantly, the accompanying Pest Control Certificate of Authenticity is validated successfully with Pest Control Office records.",
    estimated_value_usd: 85000,
    stake_locked: 5,
    reward_paid: 15,
    certificate_id: "AUTH-CERT-000003",
    item_number: 6,
    created_at: "2026-05-21T13:45:00Z"
  }
];
