# WHITE PAPER: SPACE² UNIVERSAL NAMING SERVICE (SUNS)
> Doc ID: SP2-DOC-002 | Version: 1.0 (Genesis) | Status: ACTIVE

## 1. Purpose
To ensure every **SSSU (Standard Space Unit)** has a globally unique, semantic, and machine-readable Digital Identity (DID).

## 2. Naming Standard (The 4-Segment Protocol)
Format: `[Domain]-[Region]-[Block]-[Handle]`
* **Length**: Max 64 chars.

### 2.1 Domain (3 chars)
* `PHY`: Physical Space (Anchor Seeds, Smart Homes).
* `VIR`: Virtual Space (Phantom Seeds, Metaverse).

### 2.2 Region
* `Earth`, `Mars`, `Moon` (Planetary).
* `Taohuayuan`, `Shanhaijing` (Cultural Zones).
* `China`, `Metaverse` (Geo/Logical Zones).

### 2.3 Block ID
* Identifier for specific plots (e.g., `UtopiaPlanitia01`).

### 2.4 Handle
* User customizable (e.g., `MyBase01`, `ElonCamp`).

## 3. Registration Lifecycle
1.  **Application**: Must hold a valid Seed Hash.
2.  **Minting**: Generates a **Space² DID NFT** containing ownership proof and volume definition (9.6m³).
3.  **Revocation**: Violation of the "Three Laws" leads to `[REVOKED]` status (Digital Ruins).

```json
{
  "naming_rule": {
    "format": "DOMAIN-REGION-BLOCK-HANDLE",
    "regex": "^(PHY|VIR)-[A-Za-z]+-[A-Za-z0-9]+-[A-Za-z0-9]{3,12}$"
  }
}