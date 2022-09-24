// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "src/CryptoDevs.sol";
import "src/IWhitelist.sol";

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
        // createSelectFork is a one-liner for createFork plus selectFork
        goerliFork = vm.createSelectFork(goerli_RPC_URL);
        // Tests are deployed to 0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84
        // will also be owner, if evm not pranked otherwise
        deployer = address(this);
        // make the following address deployer and owner
        vm.prank(whitelistedAddresses[0]);
        cryptoDevs = new CryptoDevs("someBaseURI", whitelistContract);
    }

    function testPresaleStarted() public {
        // setup state
        vm.prank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();

        // action
        bool started = cryptoDevs.presaleStarted();

        // assert
        assertEq(started, true);
    }

    // test presale timestamp like 5 minutes from now
    function testPresalePeriod() public {
        // setup state
        vm.prank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();

        // action
        vm.warp(block.timestamp + 5 minutes);

        // assert
        assertEq(cryptoDevs.presaleEnded(), block.timestamp);
    }

    // presaleMint call without any error
    function testPresaleMint() public payable {
        // setup state
        vm.startPrank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();

        // actual presaleMint with revert
        // send enough ether
        cryptoDevs.presaleMint{value: 0.01 ether}();
        uint256 tokenIds = cryptoDevs.tokenIds();
        assertEq(tokenIds, 1);
        vm.stopPrank();
    }

    // send not enough ether
    function testPresaleMintNotEnoughEther() public payable {
        // setup state
        vm.startPrank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();

        // actual presaleMint with revert
        // send not enough ether
        vm.expectRevert(bytes("Ether sent is not enough"));
        cryptoDevs.presaleMint{value: 0.001 ether}();
        vm.stopPrank();
    }

    // test presale before started
    function testPresaleMintBeforePeriod() public {
        // actual presaleMint with revert
        vm.prank(whitelistedAddresses[0]);
        vm.expectRevert(bytes("Presale is not running"));
        cryptoDevs.presaleMint{value: 0.01 ether}();
    }

    // test presale after presale period is over
    function testPresaleMintAfterExpiration() public {
        // setup state
        vm.startPrank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();
        emit log_uint(block.timestamp);
        uint256 timestampPresaleEnded = block.timestamp + 6 minutes;
        vm.warp(timestampPresaleEnded);
        emit log_uint(block.timestamp);

        // actual presaleMint with revert
        vm.expectRevert(bytes("Presale is not running"));
        cryptoDevs.presaleMint{value: 0.01 ether}();
        vm.stopPrank();
    }

    // test presale mint with EOA not from Whitelist
    function testPresaleMintNotWhitelisted() public {
        // setup state
        vm.prank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();
        address someRandomUser = vm.addr(1);
        emit log_address(someRandomUser);
        vm.prank(someRandomUser);
        vm.deal(someRandomUser, 1 ether);

        // actual presaleMint with revert
        vm.expectRevert(bytes("You are not whitelisted"));
        cryptoDevs.presaleMint{value: 0.01 ether}();
    }

    // test minting during paused presale
    function testPresaleMintDuringPausedContract() public {
        // setup state
        vm.startPrank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();
        cryptoDevs.setPaused(true);

        // actual presaleMint with revert
        vm.expectRevert(bytes("Contract currently paused"));
        cryptoDevs.presaleMint{value: 0.01 ether}();
        vm.stopPrank();
    }

    function testPresaleMintMoreThanAvailable() public {
        // setup state
        vm.startPrank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();
        for (uint256 index = 0; index < 20; index++) {
            emit log_uint(cryptoDevs.tokenIds());
            cryptoDevs.presaleMint{value: 0.01 ether}();
        }

        // actual mint with revert
        vm.expectRevert(bytes("Exceeded maximum Crypto Devs supply"));
        cryptoDevs.presaleMint{value: 0.01 ether}();
        vm.stopPrank();
    }

    function testNormalMintDuringPresale() public {
        // setup state
        vm.prank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();
        address someRandomUser = vm.addr(1);
        vm.prank(someRandomUser);
        vm.deal(someRandomUser, 1 ether);

        // actual mint with revert
        vm.expectRevert(bytes("Presale has not ended yet"));
        cryptoDevs.mint{value: 0.01 ether}();
    }

    function testNormalMint() public {
        // setup state
        vm.prank(whitelistedAddresses[0]);
        cryptoDevs.startPresale();
        uint256 timestampPresaleEnded = block.timestamp + 6 minutes;
        vm.warp(timestampPresaleEnded);
        address someRandomUser = vm.addr(1);
        vm.prank(someRandomUser);
        vm.deal(someRandomUser, 1 ether);

        // actual mint
        cryptoDevs.mint{value: 0.01 ether}();

        // assert
        uint256 tokenIds = cryptoDevs.tokenIds();
        assertEq(tokenIds, 1);
    }

    // test normal withdraw
    function testWithdraw() public {
        vm.startPrank(whitelistedAddresses[0]);
        // setup specific state
        cryptoDevs.startPresale();
        for (uint256 index = 0; index < 20; index++) {
            emit log_uint(cryptoDevs.tokenIds());
            cryptoDevs.presaleMint{value: 0.01 ether}();
        }
        // sold out and 0.2 ether in the contract
        // withdraw after presale just to have a clear testcase
        uint256 timestampPresaleEnded = block.timestamp + 6 minutes;
        vm.warp(timestampPresaleEnded);
        uint256 ownerBalanceBefore = whitelistedAddresses[0].balance;
        emit log_uint(ownerBalanceBefore);

        // actual withdraw
        cryptoDevs.withdraw();

        // assert
        uint256 ownerBalanceAfter = whitelistedAddresses[0].balance;
        emit log_uint(ownerBalanceAfter);
        uint256 ownerProfit = ownerBalanceAfter - ownerBalanceBefore;
        assertEq(ownerProfit, 0.2 ether);
        vm.stopPrank();
    }
}
