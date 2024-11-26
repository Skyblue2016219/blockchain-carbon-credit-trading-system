// SPDX-License-Identifier: MIT
// 指定開源許可證類型
pragma solidity ^0.8.20;
// 聲明使用的 Solidity 版本

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// 定義區塊鏈碳信用合約，繼承自 ERC20、Ownable 和 Pausable
contract BlockchainCarbonCredit is ERC20, Ownable, Pausable {
    // 使用 Counters 庫來管理計數器
    using Counters for Counters.Counter;

    // 定義抵免結構體，包含抵免者地址和抵免數量
    struct Redemption {
        address redeemer;
        uint256 amount;
    }

    // 映射：抵免者地址 => 抵免ID數組
    mapping(address => uint256[]) private redeemerToIds;
    // 映射：抵免ID => 抵免詳情
    mapping(uint256 => Redemption) private idToRedemption;
    // 抵免ID計數器
    Counters.Counter private _redemptionIdCounter;

    // 修改抵免事件，添加 message 參數
    event Redeemed(address indexed redeemer, uint256 amount, uint256 id, string message);

    // 構造函數，初始化代幣名稱、符號和所有者
    constructor(address initialOwner) ERC20("BlockchainCarbonCredit", "BCC") Ownable(initialOwner) {
        _pause(); // 初始暫停合約，等待後續設置
    }

    // 鑄造新代幣，只有合約所有者可以調用
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // 修改抵免函數，添加可選的 message 參數
    function redeem(uint256 amount, string memory message) external whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount); // 銷毀代幣

        // 創建新的抵免記錄並觸發事件
        uint256 newRedemptionId = _createRedemption(msg.sender, amount);
        emit Redeemed(msg.sender, amount, newRedemptionId, message);
    }

    // 根據抵免ID獲取抵免詳情
    function getRedemptionById(uint256 id) external view returns (address, uint256) {
        Redemption memory redemption = idToRedemption[id];
        return (redemption.redeemer, redemption.amount);
    }

    // 獲取指定地址的所有抵免ID
    function getRedemptionIdsByAddress(address redeemer) external view returns (uint256[] memory) {
        return redeemerToIds[redeemer];
    }

    // 暫停合約，只有所有者可以調用
    function pause() external onlyOwner {
        _pause();
    }

    // 恢復合約，只有所有者可以調用
    function unpause() external onlyOwner {
        _unpause();
    }

    // 內部函數：創建新的抵免記錄
    function _createRedemption(address redeemer, uint256 amount) internal returns (uint256) {
        _redemptionIdCounter.increment();
        uint256 newRedemptionId = _redemptionIdCounter.current();

        // 創建新的抵免結構體
        Redemption memory newRedemption = Redemption({
            redeemer: redeemer,
            amount: amount
        });

        // 更新映射
        redeemerToIds[redeemer].push(newRedemptionId);
        idToRedemption[newRedemptionId] = newRedemption;

        return newRedemptionId;
    }

    // 獲取最新的抵免ID
    function getLatestRedemptionId() external view returns (uint256) {
        return _redemptionIdCounter.current();
    }

    // 重寫此函數以禁止放棄所有權，防止意外操作
    function renounceOwnership() public view override onlyOwner {
        revert("Ownership renouncement is disabled");
        
    }
}
