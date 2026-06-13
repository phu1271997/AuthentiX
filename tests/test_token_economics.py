import pytest
import json

def test_claim_starter_once(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # First claim succeeds
    contract.claim_starter_tokens()
    assert int(contract.get_balance(sender)) == 100
    
    # Second claim fails
    with pytest.raises(Exception) as excinfo:
        contract.claim_starter_tokens()
    assert "Already claimed" in str(excinfo.value)

def test_transfer_tokens(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # Recipient address
    recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    
    contract.claim_starter_tokens()
    
    # Transfer 40 tokens
    tx_raw = contract.transfer(to=recipient, amount=40)
    tx_res = json.loads(tx_raw)
    
    assert tx_res["status"] == "transferred"
    assert int(contract.get_balance(sender)) == 60
    assert int(contract.get_balance(recipient)) == 40

def test_transfer_insufficient(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    
    contract.claim_starter_tokens()
    
    # Try transferring 150 (greater than balance of 100)
    with pytest.raises(Exception) as excinfo:
        contract.transfer(to=recipient, amount=150)
    assert "Insufficient balance" in str(excinfo.value)

def test_transfer_invalid_address(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Invalid address format
    with pytest.raises(Exception) as excinfo:
        contract.transfer(to="invalid_address_format", amount=10)
    assert "Invalid address" in str(excinfo.value)
