import pytest
import json

def test_authenticate_authentic(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # 1. Prepare: claim and submit
    contract.claim_starter_tokens()
    submit_raw = contract.submit_item(
        category="watch",
        brand="Rolex",
        model="Submariner",
        serial_number="V39A2081",
        year_claimed=2019,
        image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
        provenance="Purchased from dealer.",
        cert_doc_url="https://example.com/cert"
    )
    res = json.loads(submit_raw)
    item_id = res["item_id"]
    
    # 2. Mock LLM response for AUTHENTIC verdict
    # In direct mode, we can return the dict or json.dumps string.
    # GenLayer's mock_llm accepts a string and parses it or returns it.
    mock_response = {
        "verdict": "AUTHENTIC",
        "confidence": 95,
        "forensic_findings": ["Valid font engraving", "Cyclops matches spec"],
        "cross_references": ["https://chrono24.com"],
        "reasoning": "Excellent provenance and matching serial database details.",
        "estimated_value_usd": 12000
    }
    
    direct_vm.mock_llm(r".*Rolex.*", json.dumps(mock_response))
    
    # Mock web render calls
    direct_vm.mock_web(r".*", "Sample web snippet evidence content.")
    
    # 3. Authenticate
    auth_raw = contract.authenticate_item(item_id)
    auth_res = json.loads(auth_raw)
    
    assert auth_res["status"] == "AUTHENTIC"
    assert "certificate_id" in auth_res
    
    # 4. Check balance: 95 + 15 (stake refunded + 10 reward) = 110
    assert int(contract.get_balance(sender)) == 110
    
    # Check that certificate was stored
    cert_id = auth_res["certificate_id"]
    cert_raw = contract.get_certificate(cert_id)
    cert = json.loads(cert_raw)
    assert cert["cert_id"] == cert_id
    assert cert["brand"] == "Rolex"
    assert cert["minted_to"] == "0x" + sender.hex().lower()

def test_authenticate_counterfeit(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # 1. Prepare: claim and submit
    contract.claim_starter_tokens()
    submit_raw = contract.submit_item(
        category="watch",
        brand="Rolex",
        model="Submariner",
        serial_number="FAKE-SERIAL",
        year_claimed=2019,
        image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
        provenance="Purchased online.",
        cert_doc_url="none"
    )
    res = json.loads(submit_raw)
    item_id = res["item_id"]
    
    # 2. Mock LLM response for COUNTERFEIT verdict
    mock_response = {
        "verdict": "COUNTERFEIT",
        "confidence": 90,
        "forensic_findings": ["Poor alignment", "Laser etching mismatch"],
        "cross_references": ["none"],
        "reasoning": "Stitching and laser markings fail official specs.",
        "estimated_value_usd": 0
    }
    
    direct_vm.mock_llm(r".*Rolex.*", json.dumps(mock_response))
    direct_vm.mock_web(r".*", "Sample web evidence.")
    
    # 3. Authenticate
    auth_raw = contract.authenticate_item(item_id)
    auth_res = json.loads(auth_raw)
    
    assert auth_res["status"] == "COUNTERFEIT"
    assert "certificate_id" not in auth_res or auth_res["certificate_id"] == ""
    
    # 4. Check balance: 95 (stake burned)
    assert int(contract.get_balance(sender)) == 95

def test_authenticate_stolen(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    contract.claim_starter_tokens()
    submit_raw = contract.submit_item(
        category="painting",
        brand="Picasso",
        model="Le Reve",
        serial_number="P-1932-STOLEN",
        year_claimed=1932,
        image_urls_json=json.dumps(["https://example.com/picasso.jpg"]),
        provenance="Stolen archive record.",
        cert_doc_url="https://example.com/stolen"
    )
    res = json.loads(submit_raw)
    item_id = res["item_id"]
    
    mock_response = {
        "verdict": "STOLEN_FLAGGED",
        "confidence": 100,
        "forensic_findings": ["Matches stolen registry records"],
        "cross_references": ["https://artloss.com/stolen/picasso"],
        "reasoning": "This piece matches serial and provenance records flagged as stolen in 2011.",
        "estimated_value_usd": 0
    }
    
    direct_vm.mock_llm(r".*", json.dumps(mock_response))
    direct_vm.mock_web(r".*", "Matches stolen archive details.")
    
    auth_raw = contract.authenticate_item(item_id)
    auth_res = json.loads(auth_raw)
    
    assert auth_res["status"] == "STOLEN_FLAGGED"
    assert int(contract.get_balance(sender)) == 95
