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

Note:
When having a folder structure like this:
```
- myrepo
    - .git
    - contract (foundry project)
    - frontend
```
Meaning, you deleted the .git file in your foundry project, which was automatically setup, and you work from a .git file in the main project repo, because you wanted to have frontend and contract in the same git repository, `forge install` will setup .gitmodules in the myrepo folder outside of the contract folder. Make sure to copy it over to the existing .gitmodules file inside the contract folder.