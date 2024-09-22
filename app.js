// 注意：請將以下合約地址替換為您自己部署的智能合約地址
// 當前地址僅供示例，您需要將其更改為您在 Holesky 測試網上部署的實際合約地址
const contractAddress = "0x9494ed8b95297a1487ddd0cffa12a1461b4b9667";

const contractABI = [
    "function mint(address to, uint256 amount) external",
    "function redeem(uint256 amount, string memory message) external",
    "function getRedemptionById(uint256 id) external view returns (address, uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function getLatestRedemptionId() external view returns (uint256)",
    "event Redeemed(address indexed redeemer, uint256 amount, uint256 id, string message)",
    "function getRedemptionIdsByAddress(address redeemer) external view returns (uint256[] memory)"
];

let provider, signer, contract;

async function connectWallet() {
    console.log("開始連接錢包");
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log("檢測到 MetaMask，嘗試請求帳戶訪問權限");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("獲得的帳戶:", accounts);
            
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            const network = await provider.getNetwork();
            console.log("當前網絡:", network);
            if (network.chainId !== 17000) {
                console.log("需要切換到 Holesky 測試網");
                await switchToHolesky();
            }

            const address = await signer.getAddress();
            console.log("連接的地址:", address);
            document.getElementById('accountInfo').innerText = `已連接地址: ${address}`;
            
            await updateBalance();
            await updateRecentRedemptions(); // 添加這行
            
            console.log("錢包連接成功");
        } catch (error) {
            console.error("連接錢包時發生錯誤:", error);
            alert("連接錢包失敗: " + error.message);
        }
    } else {
        console.error("未檢測到 MetaMask");
        alert('請安裝 MetaMask! 如果您已安裝，請確保它在瀏覽器中已啟用。');
    }
}

async function switchToHolesky() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4268' }],
        });
    } catch (error) {
        if (error.code === 4902) {
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x4268',
                    chainName: 'Holesky Testnet',
                    nativeCurrency: {
                        name: 'Holesky ETH',
                        symbol: 'ETH',
                        decimals: 18
                    },
                    rpcUrls: ['https://ethereum-holesky.publicnode.com'],
                    blockExplorerUrls: ['https://holesky.etherscan.io']
                }]
            });
        } else {
            throw error;
        }
    }
}

async function updateBalance() {
    try {
        const address = await signer.getAddress();
        const balance = await contract.balanceOf(address);
        document.getElementById('contractInfo').innerText = `代幣餘額: ${ethers.utils.formatUnits(balance, 18)}`;
    } catch (error) {
        console.error("更新餘額失敗:", error);
    }
}

async function updateRecentRedemptions() {
    try {
        const tbody = document.querySelector('#recentRedemptions tbody');
        tbody.innerHTML = '';

        const filter = contract.filters.Redeemed();
        const events = await contract.queryFilter(filter, -1000, 'latest');
        const recentEvents = events.slice(-5).reverse();

        for (const event of recentEvents) {
            const { redeemer, amount, id, message } = event.args;
            const row = tbody.insertRow();
            row.insertCell(0).textContent = id.toString();
            row.insertCell(1).textContent = redeemer;
            row.insertCell(2).textContent = ethers.utils.formatUnits(amount, 18);
            row.insertCell(3).textContent = message;

            // 添加適當的 CSS 類
            row.cells[0].className = 'id-cell';
            row.cells[1].className = 'address-cell';
            row.cells[2].className = 'amount-cell';
            row.cells[3].className = 'message-cell';
        }
    } catch (error) {
        console.error("更新最近抵免記錄失敗:", error);
    }
}

async function mint() {
    const amount = document.getElementById('mintAmount').value;
    const to = document.getElementById('mintAddress').value;
    try {
        await checkNetwork();
        const tx = await contract.mint(to, ethers.utils.parseUnits(amount, 18));
        console.log("發送交易:", tx.hash);
        await tx.wait();
        console.log("交易確認");
        alert('鑄造成功!');
    } catch (error) {
        console.error("鑄造失敗:", error);
        handleError(error, "鑄造失敗");
    }
}

async function redeem() {
    const amount = document.getElementById('redeemAmount').value;
    const message = document.getElementById('redeemMessage').value;
    try {
        console.log("開始抵免操作");
        await checkNetwork();
        console.log("網絡檢查通過");
        
        // 檢查用戶餘額
        const address = await signer.getAddress();
        console.log("用戶地址:", address);
        const balance = await contract.balanceOf(address);
        console.log("用戶餘額:", ethers.utils.formatUnits(balance, 18));
        const redeemAmount = ethers.utils.parseUnits(amount, 18);
        console.log("抵免數量:", amount);
        
        if (balance.lt(redeemAmount)) {
            throw new Error("餘額不足");
        }
        
        // 執行抵免操作
        console.log("開始執行合約的 redeem 函數");
        const tx = await contract.redeem(redeemAmount, message);
        console.log("抵免交易已發送:", tx.hash);
        await tx.wait();
        console.log("抵免交易已確認");
        
        alert('抵免成功!');
        await updateBalance();
        await updateRecentRedemptions(); // 確保這行存在
        
    } catch (error) {
        console.error("抵免操作詳細錯誤:", error);
        handleError(error, "抵免失敗");
    }
}

async function getRedemption() {
    const id = document.getElementById('redemptionId').value;
    try {
        const [redeemer, amount] = await contract.getRedemptionById(id);
        document.getElementById('redemptionInfo').innerText = `抵免者: ${redeemer}, 數量: ${ethers.utils.formatUnits(amount, 18)}`;
    } catch (error) {
        console.error("查詢抵免記錄失敗:", error);
        alert('查詢失敗，請檢查 ID 是否正確。');
    }
}

// 添加檢查網絡的函數
async function checkNetwork() {
    const network = await provider.getNetwork();
    if (network.chainId !== 17000) {
        throw new Error("請切換到 Holesky 測試網");
    }
}

// 添加錯誤處理函數
function handleError(error, defaultMessage) {
    console.error(defaultMessage + ":", error);
    if (error.message.includes("user rejected")) {
        alert("操作被用戶取消");
    } else if (error.message.includes("切換到 Holesky 測試網")) {
        alert("請確保您已連接到 Holesky 測試網");
    } else if (error.message.includes("餘額不足")) {
        alert("您的帳戶餘額不足，無法完成抵免操作");
    } else if (error.data && error.data.message) {
        alert(error.data.message);
    } else {
        alert(defaultMessage + "，請檢查您的操作是否正確。詳細錯誤：" + error.message);
    }
}

// 更新 DOMContentLoaded 事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 已加載，添加事件監聽器");
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
        console.log("已為連接按鈕添加點擊事件監聽器");
    } else {
        console.error("未找到連接按鈕元素");
    }
    document.getElementById('mintButton').addEventListener('click', mint);
    document.getElementById('redeemButton').addEventListener('click', redeem);
    document.getElementById('getRedemptionButton').addEventListener('click', getRedemption);
    document.getElementById('queryAddressButton').addEventListener('click', queryAddressRedemptions);
});

// 定期更新最近的抵免記錄
setInterval(async () => {
    if (contract) {
        await updateRecentRedemptions();
    }
}, 30000);

// 新增查詢地址抵免記錄的功能
async function queryAddressRedemptions() {
    const infoElement = document.getElementById('addressRedemptionInfo');
    infoElement.innerText = "正在查詢...";
    try {
        await checkNetwork();
        const addressToQuery = document.getElementById('addressToQuery').value;

        if (!ethers.utils.isAddress(addressToQuery)) {
            throw new Error("無效的以太坊地址");
        }

        // 首先獲取指定地址的所有抵免ID
        const redemptionIds = await contract.getRedemptionIdsByAddress(addressToQuery);
        
        if (redemptionIds.length === 0) {
            infoElement.innerText = "該地址沒有抵免記錄";
            return;
        }

        let redemptionDetails = "";
        // 遍歷每個抵免ID並獲取詳細信息
        for (const id of redemptionIds) {
            const [redeemer, amount] = await contract.getRedemptionById(id);
            redemptionDetails += `抵免ID: ${id}, 抵免者: ${redeemer}, 數量: ${ethers.utils.formatUnits(amount, 18)}\n`;
        }

        infoElement.innerText = redemptionDetails;
    } catch (error) {
        console.error("查詢地址抵免記錄失敗:", error);
        infoElement.innerText = "查詢失敗: " + (error.message || "未知錯誤，請檢查控制台");
    }
}

// 在 DOMContentLoaded 事件監聽器中添加新的按鈕事件
document.addEventListener('DOMContentLoaded', function() {
    // ... 現有代碼 ...
    document.getElementById('queryAddressButton').addEventListener('click', queryAddressRedemptions);
});