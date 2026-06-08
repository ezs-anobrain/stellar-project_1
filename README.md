# WaterX

Modern on-chain payments and loyalty rewards for Philippine Water Refilling Stations (WRS).

## Problem
In the Philippines, Water Refilling Stations (WRS) are a neighborhood staple, but they almost exclusively rely on cash and physical paper punch-cards for loyalty tracking. These cards are easily lost, damaged, or forgotten, leading to missed rewards for customers. For owners, cash management and manual record-keeping are prone to errors and lack transparency.

## How It Works
1. **Connect & Pay**: Customers connect their Freighter wallet and select the number of gallons needed.
2. **Instant Refill**: The payment is settled instantly on the Stellar network in XLM.
3. **Smart Loyalty**: The system automatically records a "stamp" on a Soroban smart contract for every purchase.
4. **Free Rewards**: Once a customer reaches 10 stamps, the UI unlocks a "Free Refill" claim, allowing them to redeem their reward on-chain.

## How It Uses Stellar
- **XLM Payments**: Low-fee, sub-second settlement for micro-transactions (refills typically cost 25-50 pesos).
- **Soroban Smart Contracts**: Tracks user loyalty "stamps" securely and transparently without needing a centralized database.
- **Self-Custody**: Users own their loyalty progress; it can't be lost like a paper card.
- **Testnet Infrastructure**: Uses Friendbot for easy onboarding and Horizon for balance tracking.

## Track
StellarX Philippines — Main Workshop Track

## Tech Stack
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS
- Stellar SDK: @stellar/stellar-sdk v15.1.0
- Wallet: @stellar/freighter-api v6.0.0
- Contracts: Soroban (Rust SDK 22.0)
- Network: Testnet

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
- **Station Wallet**: `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` (USDC Issuer/Station Wallet)

## Team
- **Gemini CLI** — @gemini-cli (Lead Engineer)
- **Stellar Workshop Participant** — @user

## License
MIT
