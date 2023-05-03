# *UPDATED 2022-08-04*

## How to use

### To use this template, you need:
- [Node.js](https://nodejs.dev/)
- [yarn](https://yarnpkg.com/getting-started/install)

### Get Started:
```
git clone https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-front-end-template
cd ppbl-front-end-template
yarn install
yarn dev
```

In a browser, go to [https://localhost:3000](https://localhost:3000) and connect a Wallet. This project can connect to Browser Wallets on Cardano Mainnet, Testnet, Pre-Production, and Preview. Currently, most of the transaction functionality is configured to work with Pre-Production, and has been tested with [Eternl Wallet on Pre-Production](https://eternl.io/app/preprod/welcome). `Only a few changes are required to make this template work with other Cardano networks, like Mainnet and Preview.

### You'll know you are successful if:
You can see the "Congratulations" message with your wallet address after clicking the button at [https://localhost:3000](https://localhost:3000). Try it with both Testnet and Mainnet!

---

## Reasoning About Web3 Dapps

### 3 sources of information:

1. The user's wallet
2. Current on-chain data
3. Historical blockchain data
