import pytest
import json

def test_transfer_certificate_success(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # 1. Prepare: Claim tokens, submit and authenticate
    contract.claim_starter_tokens()
    submit_raw = contract.submit_item(
        category="watch",
        brand="Rolex",
        model="Submariner",
        serial_number="V39A2081",
        year_claimed=2019,
        image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
        provenance="Owner provenance",
        cert_doc_url="https://example.com/cert"
    )
    res = json.loads(submit_raw)
    item_id = res["item_id"]
    
    mock_response = {
        "verdict": "AUTHENTIC",
        "confidence": 95,
        "forensic_findings": ["Valid engraving"],
        "cross_references": ["https://chrono24.com"],
        "reasoning": "Consistent with authentic manufacturing specs.",
        "estimated_value_usd": 12000
    }
    direct_vm.mock_llm(r".*", json.dumps(mock_response))
    direct_vm.mock_web(r".*", "Web database check.")
    
    auth_raw = contract.authenticate_item(item_id)
    auth_res = json.loads(auth_raw)
    cert_id = auth_res["certificate_id"]
    
    # Recipient bytes address (using hex representation)
    recipient_hex = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    recipient_bytes = bytes.fromhex(recipient_hex[2:])
    
    # 2. Transfer certificate to recipient
    transfer_raw = contract.transfer_certificate(cert_id, recipient_hex)
    transfer_res = json.loads(transfer_raw)
    assert transfer_res["status"] == "transferred"
    
    # 3. Verify owner is updated in ownership mapping
    cert_raw = contract.get_certificate(cert_id)
    cert = json.loads(cert_raw)
    assert cert["current_owner"] == recipient_hex.lower()
    
    # 4. Switch caller to recipient and transfer it back to original sender
    direct_vm.sender = recipient_bytes
    sender_hex = "0x" + sender.hex().lower()
    
    transfer_back_raw = contract.transfer_certificate(cert_id, sender_hex)
    transfer_back_res = json.loads(transfer_back_raw)
    assert transfer_back_res["status"] == "transferred"
    
    cert_raw_final = contract.get_certificate(cert_id)
    cert_final = json.loads(cert_raw_final)
    assert cert_final["current_owner"] == sender_hex

def test_transfer_certificate_non_owner(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    
    contract.claim_starter_tokens()
    submit_raw = contract.submit_item(
        category="watch",
        brand="Rolex",
        model="Submariner",
        serial_number="V39A2081",
        year_claimed=2019,
        image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
        provenance="Provenance",
        cert_doc_url="none"
    )
    res = json.loads(submit_raw)
    item_id = res["item_id"]
    
    mock_response = {
        "verdict": "AUTHENTIC",
        "confidence": 95,
        "forensic_findings": ["Valid"],
        "cross_references": [],
        "reasoning": "Genuine.",
        "estimated_value_usd": 12000
    }
    direct_vm.mock_llm(r".*", json.dumps(mock_response))
    direct_vm.mock_web(r".*", "Web data.")
    
    auth_raw = contract.authenticate_item(item_id)
    auth_res = json.loads(auth_raw)
    cert_id = auth_res["certificate_id"]
    
    # Switch sender to someone else (non-owner)
    bob_bytes = bytes.fromhex("3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")
    direct_vm.sender = bob_bytes
    
    with pytest.raises(Exception) as excinfo:
        contract.transfer_certificate(cert_id, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    assert "Only current owner" in str(excinfo.value)

def test_transfer_certificate_not_found(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    
    with pytest.raises(Exception) as excinfo:
        contract.transfer_certificate("AUTH-CERT-999999", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
    assert "Unknown cert_id" in str(excinfo.value)
