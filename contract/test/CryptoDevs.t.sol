// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// solidity settings lost, add them again...

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "src/CryptoDevs.sol";
import "src/IWhitelist.sol";

interface CheatCodes {
    // Gets address for a given private key, (privateKey) => (address)
   function addr(uint256) external returns (address);
}

contract CryptoDevsTest is Test {
    CryptoDevs cryptoDevs;
    address deployer;
    address whitelistContract = 0x61390Fc02A4c21Bf4A6A60A03B287706A81b0489;
    uint256 goerliFork;

    // need to create a fork
    function setUp() public {
        string memory goerli_RPC_URL = vm.envString("GOERLI_RPC_URL");
        goerliFork = vm.createSelectFork(goerli_RPC_URL);

        cryptoDevs = new CryptoDevs("someBaseURI", whitelistContract);
        // Tests are deployed to 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84
        // will also be owner
        deployer = address(this);
    }

    function testPresaleStarted() public {
        cryptoDevs.startPresale();
        bool started = cryptoDevs.presaleStarted();
        assertEq(started, true);
    }

    function testPresaleMint() public {

    }

    // function testPresaleMintFailsPeriodOver() public {
    //     cryptoDevs.startPresale();
    //     uint256 timePresaleEnded = block.timestamp + 5 minutes + 1 seconds;
    //     vm.rollFork(timePresaleEnded);
    //     // asserEq();
    // }
}
