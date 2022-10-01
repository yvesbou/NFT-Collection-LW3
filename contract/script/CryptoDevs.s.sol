// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {CryptoDevs} from "../src/CryptoDevs.sol";

contract CryptoDevsScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();
        address whitelistAddress = 0x61390Fc02A4c21Bf4A6A60A03B287706A81b0489;
        string memory METADATA_URL = "https://example.example";
        new CryptoDevs(METADATA_URL, whitelistAddress);
    }
}
