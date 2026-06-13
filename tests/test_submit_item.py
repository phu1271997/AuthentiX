import pytest
import json

def test_submit_success(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # 1. Claim starter tokens
    contract.claim_starter_tokens()
    assert int(contract.get_balance(sender)) == 100
    
    # 2. Submit item
    item_json_raw = contract.submit_item(
        category="watch",
        brand="Rolex",
        model="Submariner 116610LN",
        serial_number="V39A2081",
        year_claimed=2019,
        image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
        provenance="Purchased from authorized dealer.",
        cert_doc_url="https://example.com/cert"
    )
    
    res = json.loads(item_json_raw)
    assert res["status"] == "submitted"
    assert "item_id" in res
    
    # 3. Verify stake was deducted
    assert int(contract.get_balance(sender)) == 95
    
    # 4. Verify item exists in contract storage
    item_id = res["item_id"]
    item_details = json.loads(contract.get_item(item_id))
    assert item_details["brand"] == "Rolex"
    assert item_details["status"] == "PENDING"
    assert item_details["submitter"] == "0x" + sender.hex().lower()

def test_submit_missing_fields(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Missing brand should fail
    with pytest.raises(Exception) as excinfo:
        contract.submit_item(
            category="watch",
            brand="",
            model="Submariner",
            serial_number="V39",
            year_claimed=2019,
            image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
            provenance="...",
            cert_doc_url="..."
        )
    assert "required" in str(excinfo.value)

def test_submit_invalid_category(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Invalid category should fail
    with pytest.raises(Exception) as excinfo:
        contract.submit_item(
            category="spaceship",
            brand="SpaceX",
            model="Starship",
            serial_number="SN15",
            year_claimed=2021,
            image_urls_json=json.dumps(["https://example.com/starship.jpg"]),
            provenance="...",
            cert_doc_url="..."
        )
    assert "Unsupported category" in str(excinfo.value)

def test_submit_insufficient_balance(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    
    # Do not claim starter tokens -> balance is 0
    with pytest.raises(Exception) as excinfo:
        contract.submit_item(
            category="watch",
            brand="Rolex",
            model="Submariner",
            serial_number="V39",
            year_claimed=2019,
            image_urls_json=json.dumps(["https://example.com/rolex.jpg"]),
            provenance="...",
            cert_doc_url="..."
        )
    assert "Insufficient AUTH balance" in str(excinfo.value)
