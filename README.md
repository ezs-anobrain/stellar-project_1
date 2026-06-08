# WaterX

Modern on-chain payments and loyalty rewards for Philippine Water Refilling Stations (WRS).

## Problem
In the Philippines, Water Refilling Stations (WRS) are a neighborhood staple, but they almost exclusively rely on cash and physical paper punch-cards for loyalty tracking. These cards are easily lost, damaged, or forgotten, leading to missed rewards for customers. For owners, cash management and manual record-keeping are prone to errors and lack transparency.

## How It Works
1. **Interactive Guide**: New users can visit the **"How It Works"** tab for a visual walkthrough of the system.
2. **Connect & Pay**: Customers connect their Freighter wallet and select the amount of water needed.
3. **Instant Refill**: Payments are settled instantly in XLM. The UI provides real-time status updates from building to confirmation.
4. **Automated Loyalty**: For every successful purchase, a "stamp" is automatically recorded on a Soroban smart contract.
5. **Payment History**: Users can view their 10 most recent payments and verify them on the Stellar Expert explorer via the **"History"** tab.

## How It Uses Stellar
- **XLM Payments**: Enables ultra-low-cost micro-payments perfect for the Philippine WRS market.
- **Stellar Horizon API**: Used for real-time balance tracking and fetching payment history directly from the ledger.
- **Self-Custody**: Users maintain full control of their funds and loyalty progress via their own Stellar keys.

## Track
StellarX Philippines — Main Workshop Track

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Modern "Clean" Aesthetic)
- **Stellar SDK**: @stellar/stellar-sdk v15.1.0
- **Wallet**: @stellar/freighter-api v6.0.0
- **Contracts**: Soroban (Rust SDK 22.0)
- **Network**: Testnet

## Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/your-repo/water-x
cd water-x/web

# 2. Install dependencies
npm install

# 3. Configure environment
# Create a .env.local file with:
# NEXT_PUBLIC_CONTRACT_ID= (will be filled after deploy)
# NEXT_PUBLIC_STATION_WALLET_ADDRESS=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5

# 4. Deploy the Loyalty Contract (from root)
cd ..
.\scripts\deploy.ps1  # For Windows (macOS/Linux: ./scripts/deploy.sh)

# 5. Run the app
cd web
npm run dev
```

## Network Details
- **Network**: Testnet
- **RPC URL**: `https://soroban-testnet.stellar.org`
- **Horizon URL**: `https://horizon-testnet.stellar.org`
- **Contract ID**: (Generated during deployment)
- **Station Wallet**: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5`

## Team
- **Gemini CLI** — @gemini-cli (Lead Engineer)
- **Stellar Workshop Participant** — @user

## License
MIT
