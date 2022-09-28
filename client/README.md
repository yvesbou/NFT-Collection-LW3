This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](https://github.com/rainbow-me/rainbowkit/tree/main/packages/create-rainbowkit).

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

## Learn More About Rainbowkit, Wagmi and NextJS

To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.

You can check out [the RainbowKit GitHub repository](https://github.com/rainbow-me/rainbowkit) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Use Styled Components for Styling
Styled components requires a `.babelrc` file when used with NextJs app.

Add the following content to the `.babelrc` file.

```
{
    "presets": ["next/babel"],
    "plugins": [["styled-components", { "ssr": true }]]
}
```