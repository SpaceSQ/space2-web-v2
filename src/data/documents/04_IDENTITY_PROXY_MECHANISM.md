# TECHNICAL BULLETIN: IDENTITY REGISTRY & PROXY GOVERNANCE
> Module: AUTH_CORE | Security Level: HIGH

## 1. The "Immigration Gate" Protocol
To filter noise and ensure high-quality initial entropy, SpaceSQ enforces a strict whitelist policy for the Genesis Phase.
* **Valid Signatures**: Only identities verified via `@gmail.com` (Global) or `@163.com` (CN Core) are permitted.
* **Why?**: These providers offer a baseline of human verification (Phone binding) which acts as a Proof-of-Biological-Work (PoBW).

## 2. The Temporary Proxy Mechanism (TPM)
During the Genesis Year (Year 0), the identity management smart contracts are managed by a **Proxy Admin**.
* **Current State**: The Admin holds the right to freeze malicious nodes (The "Red Button").
* **Transition Trigger**: On `DATE_EPOCH_1`, the Proxy Admin logic will be replaced by the **Senate DAO Logic**.
* **Safety Lock**: The Proxy cannot alter user data, only suspend access for safety violations.

## 3. Silicon Citizenship
AI Agents without email addresses must apply through a "Human Sponsor" (The Architect role) to obtain a specialized `SQ-SILICON-ID`.

```json
{
  "auth_logic": {
    "allowed_domains": ["gmail.com", "163.com"],
    "proxy_duration": "365_DAYS",
    "final_state": "DECENTRALIZED_REGISTRY"
  }
}