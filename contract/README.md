# Contracts

## Deployed Contracts

| Contract                | Network | Contract address                                                                                                                  |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| CryptoDevsNFTCollection | Goerli  | [0x96788D3aA03B6afAE42F15c059934ac53094Aca8](https://goerli.etherscan.io/address/0x96788d3aa03b6afae42f15c059934ac53094aca8#code) |
| WhitelistContract       | Goerli  | [0x61390Fc02A4c21Bf4A6A60A03B287706A81b0489](https://goerli.etherscan.io/address/0x61390fc02a4c21bf4a6a60a03b287706a81b0489#code) |

\*Whitelist is from another [repo](https://github.com/yvesbou/Whitelist-DApp_Contract).

## Project built with Foundry

Start your own Foundry Project with:

```shell
mkdir contract
cd contract
forge init
```

### Deploy contracts

```shell
# To give our shell access to our environment variables
source .env
# To deploy and verify our contract
forge script script/CryptoDevs.s.sol:CryptoDevsScript --rpc-url $GOERLI_RPC_URL  --private-key $GOERLI_PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY -vvvv

```

### Test contracts

Using foundry

```shell
forge test
# for more details, logging with emit, add verbosity 1 up to 5 v's
forge test -vvvv
```

### Local Blockchain with Anvil (Foundry)

Set up a local blockchain like this

```shell
# set up fresh local blockchain
anvil

# if you want to fork an existing blockchain, because you need to interact with existing contracts, e.g on goerli testnet
anvil -f https://eth-goerli.g.alchemy.com/v2/<your_api_keys>
```

#### Deploy the CryptoDevs NFT Smart Contract

- specify the script which deploys the contract `script/<scriptName>.s.sol:<contractName>`
- fork-url is the url from the local blockchain see terminal
- add private key to arguments
  - take a private key from the one of the accounts if you just wanna play around in the console
  - if you want to interact with the local blockchain with your frontend you need to use a key from your browser wallet
- run the following command

```
# never use the private keys from anvil with your wallet with real ether, there are for sure bots that drain the account immediately if there are tokens
forge script script/CryptoDevs.s.sol:CryptoDevsScript --fork-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

#### Make Function Calls

Use `cast call <args>` for reading from contract.

Use `cast send <args>` for writing to contract.

Selection of useful `cast` commands

```shell
# send ether from EOA to address
cast send --ledger 0x8f26244700c47572198f0f8e8c7f671a0b79219f --value 5ether --from 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
# get balance of address
cast balance 0x8f26244700c47572198f0f8e8c7f671a0b79219f
# call function with return type of address
cast call 0x8f26244700c47572198f0f8e8c7f671a0b79219f "owner()(address)"
# call withdraw function from smart contract
cast send 0x8f26244700c47572198f0f8e8c7f671a0b79219f "withdraw()" --private-key $GOERLI_PRIVATE_KEY
```

## Troubleshooting

### Third Party Libraries in Foundry Project

Install dependencies Foundry natively via Github

```shell
forge install OpenZeppelin/openzeppelin-contracts

```

Use it in solidity script

```Solidity
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
```

Note:
When having a folder structure like this because you want to have a monorepo (contract and frontend together):

```
- NFT-Collection-LW3
    - .git
    - contract (foundry project)
    - frontend
```

Meaning, you deleted the `.git` file in your foundry project, which was automatically setup, and you work from a .git file in the main project repo, because you wanted to have frontend and contract in the same git repository, `forge install` will setup `.gitmodules` in the NFT-Collection-LW3 folder outside of the contract folder. Make sure to copy it over to the existing `.gitmodules` file inside the contract folder.

If you get warnings like `... not found: File import callback not supported` make sure to open the project with VS Code not at the root (NFT-Collection-LW3) but on the contract level. Furthermore, follow the next chapter as well to prevent warnings from solidity.

### VS Code Warnings

Changing to different libraries with Solidity projects can be pretty challenging. By the time writing this, I recommend to work with the [plugin](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) by Juan Blanco. But to make it work properly with Foundry settings must be set correctly. You could change global settings of VS Code inside, but if you end up working with hardhat and foundry, depending on the teams you work with, I recommend to add a settings file to your project.

```
- contract
    - .vscode
        - settings.json
```

Inside this file make sure to have at least this (ofc you can add your flavor to it regarding the aliases of the import or the solc compiler).

```
{
    "editor.formatOnSave": true,
    "solidity.formatter": "prettier",
    "solidity.defaultCompiler": "remote",
    "solidity.compileUsingRemoteVersion" : "latest",
    "git.ignoreLimitWarning": true,
    "solidity.remappings": [
        "@openzeppelin/=lib/openzeppelin-contracts/",
        "ds-test/=lib/forge-std/lib/ds-test/src/",
        "forge-std/=lib/forge-std/src/"
      ],
}
```

Solution for settings found [here](https://github.com/foundry-rs/foundry/issues/2019).

### Dependencies not found when deploying contracts

Even though we specified solidity remappings for vs code, we get an error like this.

```shell
Compiler run failed
error[6275]: ParserError: Source "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol" not found: File not found.
```

We need to add additionally a `remappings.txt` file at the root of the foundry project.

```.txt
ds-test/=lib/forge-std/lib/ds-test/src/
forge-std/=lib/forge-std/src/
@openzeppelin/=lib/openzeppelin-contracts/
```

See also this question [here](https://ethereum.stackexchange.com/questions/135652/foundry-dependencies-not-resolved-for-deployment-of-contract/135653#135653).
