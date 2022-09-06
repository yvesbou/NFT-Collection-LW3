// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

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
    // contract address on goerli
    address whitelistContract = 0x61390Fc02A4c21Bf4A6A60A03B287706A81b0489;
    // whitelisted addresses in contract deployed on goerli (contract misses state which stores all addresses)
    address[3] whitelistedAddresses = [
        0x26a58e69f3FF059191d5a72764eD795779Cb1221,
        0x23E5BBFD0A97b93EC889C097A3d9C581391603Da,
        0x19c170541c7d51457E2800B4cB3a76414dE88De3
    ];
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
        vm.prank(whitelistedAddresses[0]);
        // how to send some ether with the transaction?
        cryptoDevs.presaleMint();
        // how to assert?
    }

    // function testPresaleMintFailsPeriodOver() public {
    //     cryptoDevs.startPresale();
    //     uint256 timePresaleEnded = block.timestamp + 5 minutes + 1 seconds;
    //     vm.rollFork(timePresaleEnded);
    //     // asserEq();
    // }
}
