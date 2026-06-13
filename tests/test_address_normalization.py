import pytest
import json

def test_address_case_insensitivity(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    sender = direct_vm.sender
    
    # 1. Claim tokens
    contract.claim_starter_tokens()
    
    # Check balance using uppercase and lowercase forms
    sender_hex = "0x" + sender.hex()
    sender_hex_upper = "0x" + sender.hex().upper()
    sender_hex_mixed = "0x" + "".join([c.upper() if idx % 2 == 0 else c.lower() for idx, c in enumerate(sender.hex())])
    
    # All queries should return 100
    assert int(contract.get_balance(sender_hex)) == 100
    assert int(contract.get_balance(sender_hex_upper)) == 100
    assert int(contract.get_balance(sender_hex_mixed)) == 100

def test_transfer_case_insensitivity(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/authentix.py")
    contract.claim_starter_tokens()
    
    # Mixed-case recipient address
    recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    recipient_upper = recipient.upper()
    recipient_lower = recipient.lower()
    
    # Transfer to uppercase version
    contract.transfer(to=recipient_upper, amount=50)
    
    # Both upper and lower address checks should show 50
    assert int(contract.get_balance(recipient_lower)) == 50
    assert int(contract.get_balance(recipient_upper)) == 50
