// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWhitelist {
    // mapping addressWhitelisted deployed with Contract Whitelist gets function
    function addressWhitelisted(address) external view returns (bool);
}
