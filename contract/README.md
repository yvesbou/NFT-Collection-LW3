# Contracts
### Project built with Foundry

Start your own Foundry Project with:
```shell
mkdir contract
cd contract
forge init
```
### Third Party Libraries in Foundry Project

Install dependencies Foundry natively via Github
```shell
forge install OpenZeppelin/openzeppelin-contracts

```

Use it in solidity script
```Solidity
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
```