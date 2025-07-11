

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BasicNeedsUnitToken is ERC20Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    
    uint ownBalance;
    // NOT USED ANYMORE:
    //enum Resources{ Kcal, Protein, Fat, Electricity, Water, Total }
    //mapping(Resources => uint) public resourceRatios;

    //function updateResourceData(uint newRatio, Resources resource) external onlyOwner {
        //resourceRatios[resource] = newRatio;
    //}

    uint public latestElecDemand; //for now: the average of demand in USA + CAN + UK
    uint public latestElecSupply; //for now: the average of supply in USA + CAN + UK
    uint public latestUpdateTime;
    uint public latestDataTime;

    function provideElecData(uint _demand, uint _supply) public {
        latestElecDemand = _demand;
        latestElecSupply = _supply;
        latestDataTime = block.timestamp;
    }

    function mintTo(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("BasicNeedsUnitToken", "BNU");
        __Ownable_init(msg.sender);
        _mint(msg.sender, 1000 * 1e18);
        ownBalance = 0;
        latestUpdateTime = block.timestamp;
    }

    // allow upgrades
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}



}



