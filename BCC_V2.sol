pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BlockchainCarbonCredit is ERC20, Ownable, Pausable {
    using Counters for Counters.Counter;

    struct Redemption {
        address redeemer;
        uint256 amount;
    }

    mapping(address => uint256[]) private redeemerToIds;
    mapping(uint256 => Redemption) private idToRedemption;
    Counters.Counter private _redemptionIdCounter;

    event Redeemed(address indexed redeemer, uint256 amount, uint256 id, string message);

    constructor(address initialOwner) ERC20("BlockchainCarbonCredit", "BCC") Ownable(initialOwner) {
        _pause();
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function redeem(uint256 amount, string calldata message) external whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);

        uint256 newRedemptionId = _createRedemption(msg.sender, amount);
        emit Redeemed(msg.sender, amount, newRedemptionId, message);
    }

    function getRedemptionById(uint256 id) external view returns (address redeemer, uint256 amount) {
        Redemption storage redemption = idToRedemption[id];
        return (redemption.redeemer, redemption.amount);
    }

    function getRedemptionIdsByAddress(address redeemer) external view returns (uint256[] memory) {
        return redeemerToIds[redeemer];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _createRedemption(address redeemer, uint256 amount) internal returns (uint256) {
        _redemptionIdCounter.increment();
        uint256 newRedemptionId = _redemptionIdCounter.current();

        redeemerToIds[redeemer].push(newRedemptionId);
        idToRedemption[newRedemptionId] = Redemption(redeemer, amount);

        return newRedemptionId;
    }

    function getLatestRedemptionId() external view returns (uint256) {
        return _redemptionIdCounter.current();
    }

    function renounceOwnership() public view override onlyOwner {
        revert("Ownership renouncement is disabled");
    }
}
