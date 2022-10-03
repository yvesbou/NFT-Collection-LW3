# NFT Minting Page with Admin Dashbaord
This frontend was build with [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](https://github.com/rainbow-me/rainbowkit/tree/main/packages/create-rainbowkit).

## Some Snapshots
![Alt text](images/Hero.png?raw=true "Hero")
![Alt text](images/Mint.png?raw=true "Mint Section")
![Alt text](images/Mint_waiting_for_approval.png?raw=true "Mint Waiting for Approval")
![Alt text](images/Mint_loading.png?raw=true "Mint Loading")
![Alt text](images/Mint_successful.png?raw=true "Mint Successful")
![Alt text](images/Owner_Dashboard.png?raw=true "Owner Dashboard")
![Alt text](images/Presale_Mint.png?raw=true "Presale Mint")

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Working with Local Blockchain
When you set up a local blockchain with anvil (Foundry) for example, like explained in `./contract/README.md` then you need to adapt few things. 

- Inside configureChains (`_app.tsx`) object you need to add two things.
- `contractConfig` 
- Make sure you choose localhost with your browserwallet!!!

### configureChains

1. `chain.localhost`
2. `jsonRpcProvider`

```javascript

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.goerli,
    chain.localhost
  ],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => ({
        http: `http://localhost:8545`,
      }),
    }), 
  ]
);
```

### contractConfig

Make sure the address and abi of the contract you deployed to the local blockchain are specified inside contractConfig.

```javascript
const contractConfig = {
	addressOrName: '0x8f26244700c47572198f0f8e8c7f671a0b79219f',
	contractInterface: CryptoDevsAbi.abi,
};
```

## Use Styled Components for Styling

For organising CSS this project uses `Styled Components`.

Styled components requires a `.babelrc` file when used with NextJs app.

Add the following content to the `.babelrc` file.

```
{
    "presets": ["next/babel"],
    "plugins": [["styled-components", { "ssr": true }]]
}
```