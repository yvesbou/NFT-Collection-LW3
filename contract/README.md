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

Meaning, you deleted the `.git` file in your foundry project, which was automatically setup, and you work from a .git file in the main project repo, because you wanted to have frontend and contract in the same git repository, `forge install` will setup `.gitmodules` in the myrepo folder outside of the contract folder. Make sure to copy it over to the existing `.gitmodules` file inside the contract folder.

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
