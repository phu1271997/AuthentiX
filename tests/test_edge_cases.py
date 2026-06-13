import pytest
import json

def test_year_boundary_low(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Year 999 is too low (min 1000)
    with pytest.raises(Exception) as excinfo:
        contract.submit_item(
            category="watch",
            brand="Rolex",
            model="Submariner",
            serial_number="V39",
            year_claimed=999,
            image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
            provenance="Provenance",
            cert_doc_url="none"
        )
    assert "year_claimed must be between 1000-2030" in str(excinfo.value)

def test_year_boundary_high(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Year 2031 is too high (max 2030)
    with pytest.raises(Exception) as excinfo:
        contract.submit_item(
            category="watch",
            brand="Rolex",
            model="Submariner",
            serial_number="V39",
            year_claimed=2031,
            image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
            provenance="Provenance",
            cert_doc_url="none"
        )
    assert "year_claimed must be between 1000-2030" in str(excinfo.value)

def test_semicolon_image_fallback(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Pass semicolon-separated URL string instead of JSON array
    submit_raw = contract.submit_item(
        category="watch",
        brand="Rolex",
        model="Submariner",
        serial_number="V39A2081",
        year_claimed=2019,
        image_urls_json="https://example.com/img1.jpg;https://example.com/img2.jpg",
        provenance="Provenance",
        cert_doc_url="none"
    )
    res = json.loads(submit_raw)
    assert res["status"] == "submitted"
    
    # Retrieve the item and check that image_urls are stored as semicolon string
    item_id = res["item_id"]
    item_details = json.loads(contract.get_item(item_id))
    assert item_details["image_urls"] == "https://example.com/img1.jpg;https://example.com/img2.jpg"
