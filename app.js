// Web3 已經通過 CDN 在 HTML 中引入,所以這裡不需要再導入

// 注意：請將以下合約地址替換為您自己部署的智能合約地址
const contractAddress = "0x9494ed8b95297a1487ddd0cffa12a1461b4b9667";

// 使用完整的 JSON 格式的 ABI（應用程序二進制接口）
const contractABI = [
    // 事件
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "redeemer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "Redeemed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    // 函數
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "initialOwner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getRedemptionById",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "redeemer",
                "type": "address"
            }
        ],
        "name": "getRedemptionIdsByAddress",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLatestRedemptionId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "redeem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 定義全局變量
let web3, contract;

// 連接錢包函數
async function connectWallet() {
    console.log("開始連接錢包");
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log("檢測到 MetaMask，嘗試請求帳戶訪問權限");
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);

            // 在創建合約實例之前，先檢查並切換網絡
            await checkNetwork();

            // 創建合約實例
            contract = new web3.eth.Contract(contractABI, contractAddress);

            const accounts = await web3.eth.getAccounts();
            const address = accounts[0];
            console.log("連接的地址:", address);
            document.getElementById('accountInfo').innerText = `已連接地址: ${address}`;

            // 更新餘額和最近的抵免記錄
            await updateBalance();
            await updateRecentRedemptions();

            console.log("錢包連接成功");
        } catch (error) {
            console.error("連接錢包或切換網絡時發生錯誤:", error);
            handleError(error, "連接錢包或切換網絡失敗");
        }
    } else {
        console.error("未檢測到 MetaMask");
        alert('請安裝 MetaMask! 如果您已安裝，請確保它在瀏覽器中已啟用。');
    }
}

// 檢查網絡並切換到 Holesky 測試網
async function checkNetwork() {
    try {
        const network = await web3.eth.net.getId();
        if (network !== 17000) {  // Holesky 測試網的網絡 ID 是 17000
            console.log("當前不是 Holesky 網絡，嘗試切換...");
            await switchToHolesky();
            console.log("成功切換到 Holesky 網絡");
        } else {
            console.log("當前已經是 Holesky 網絡");
        }
    } catch (error) {
        console.error("檢查或切換網絡失敗:", error);
        throw new Error("無法切換到 Holesky 測試網，請手動切換");
    }
}

// 切換到 Holesky 測試網
async function switchToHolesky() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4268' }],  // 0x4268 是 17000 的十六進制表示
        });
    } catch (switchError) {
        // 如果用戶的錢包中沒有 Holesky 網絡，我們需要添加它
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x4268',
                        chainName: 'Holesky 測試網',
                        nativeCurrency: {
                            name: 'Holesky ETH',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://ethereum-holesky.publicnode.com'],
                        blockExplorerUrls: ['https://holesky.etherscan.io']
                    }],
                });
            } catch (addError) {
                console.error("添加 Holesky 網絡失敗:", addError);
                throw new Error("無法添加 Holesky 測試網，請手動添加");
            }
        } else {
            throw switchError;
        }
    }
}

// 更新用戶餘額
async function updateBalance() {
    try {
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const balance = await contract.methods.balanceOf(address).call();
        document.getElementById('contractInfo').innerText = `代幣餘額: ${web3.utils.fromWei(balance, 'ether')}`;
    } catch (error) {
        console.error("更新餘額失敗:", error);
    }
}

// 更新最近的抵免記錄
async function updateRecentRedemptions() {
    try {
        const tbody = document.getElementById('recentRedemptions');
        if (!tbody) {
            console.error("找不到表格體元素");
            return;
        }
        
        tbody.innerHTML = '';
        console.log("清空表格完成");

        // 確保 web3 實例存在
        if (!web3) {
            web3 = new Web3('https://ethereum-holesky.publicnode.com');
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("創建新的 Web3 實例");
        }

        // 獲取最新的抵免ID
        const latestId = await contract.methods.getLatestRedemptionId().call();
        console.log("最新抵免ID:", latestId);

        if (latestId === '0') {
            console.log("還沒有抵免記錄");
            tbody.innerHTML = '<tr><td colspan="4">暫無抵免記錄</td></tr>';
            return;
        }

        // 獲取所有 Redeemed 事件
        const currentBlock = await web3.eth.getBlockNumber();
        const events = await contract.getPastEvents('Redeemed', {
            fromBlock: Math.max(0, currentBlock - 50000),
            toBlock: 'latest'
        });

        console.log("獲取到的事件:", events);

        const redemptions = new Set();
        let currentId = parseInt(latestId);
        let count = 0;

        // 獲取最新的5條記錄
        while (count < 5 && currentId > 0) {
            try {
                console.log(`正在獲取ID ${currentId} 的記錄`);
                const result = await contract.methods.getRedemptionById(currentId).call();
                
                // 在事件列表中查找對應的事件
                const event = events.find(e => e.returnValues.id === currentId.toString());
                const message = event ? event.returnValues.message : "";
                
                if (result[0] !== '0x0000000000000000000000000000000000000000') {
                    const redemptionKey = `${currentId}-${result[0]}-${result[1]}`;
                    if (!redemptions.has(redemptionKey)) {
                        redemptions.add(redemptionKey);
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${currentId}</td>
                            <td>${result[0]}</td>
                            <td>${web3.utils.fromWei(result[1], 'ether')}</td>
                            <td>${message || ''}</td>
                        `;
                        tbody.appendChild(row);
                        count++;
                        console.log(`成功添加ID ${currentId} 的記錄，消息: ${message}`);
                    }
                }
            } catch (error) {
                console.error(`獲取ID ${currentId} 的記錄失敗:`, error);
            }
            currentId--;
        }

        if (tbody.children.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">暫無抵免記錄</td></tr>';
        }

        console.log(`成功顯示 ${count} 條記錄`);
    } catch (error) {
        console.error("更新抵免記錄時發生錯誤:", error);
        const tbody = document.getElementById('recentRedemptions');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4">載入記錄時發生錯誤</td></tr>';
        }
    }
}

// 鑄造新代幣
async function mint() {
    const amount = document.getElementById('mintAmount').value;
    const to = document.getElementById('mintAddress').value;
    try {
        const accounts = await web3.eth.getAccounts();
        const tx = await contract.methods.mint(to, web3.utils.toWei(amount, 'ether')).send({ from: accounts[0] });
        console.log("發送交易:", tx.transactionHash);
        alert('鑄造成功!');
    } catch (error) {
        console.error("鑄造失敗:", error);
        handleError(error, "鑄造失敗");
    }
}

// 抵��代幣
async function redeem() {
    const amount = document.getElementById('redeemAmount').value;
    const message = document.getElementById('redeemMessage').value;
    try {
        console.log("開始抵免操作");
        await checkNetwork();
        console.log("網絡檢查通過");
        
        // 檢查用戶餘額
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        console.log("用戶地址:", address);
        const balance = await contract.methods.balanceOf(address).call();
        console.log("用戶餘額:", web3.utils.fromWei(balance, 'ether'));
        const redeemAmount = web3.utils.toWei(amount, 'ether');
        console.log("抵免數量:", amount);
        
        if (parseInt(balance) < parseInt(redeemAmount)) {
            throw new Error("餘額不足");
        }
        
        // 執行抵免操作
        console.log("開始執行合約的 redeem 函數");
        const tx = await contract.methods.redeem(redeemAmount, message).send({ from: address });
        console.log("抵免交易已發送:", tx.transactionHash);
        
        alert('抵免成功!');
        await updateBalance();
        await updateRecentRedemptions(); // 確保這行存在
        
    } catch (error) {
        console.error("抵免操作��細錯誤:", error);
        handleError(error, "抵免失敗");
    }
}

// 獲取抵免記錄
async function getRedemption() {
    const id = document.getElementById('redemptionId').value;
    try {
        if (!id || isNaN(id)) {
            throw new Error("請輸入有效的抵免 ID");
        }

        const result = await contract.methods.getRedemptionById(id).call();
        console.log("合約返回的結果:", result);

        if (!result || result[0] === '0x0000000000000000000000000000000000000000') {
            throw new Error("該 ID 沒有對應的抵免記錄");
        }

        const redeemer = result[0];
        const amount = result[1];
        document.getElementById('redemptionInfo').innerText = `抵免者: ${redeemer}, 數量: ${web3.utils.fromWei(amount, 'ether')}`;
    } catch (error) {
        console.error("查詢抵免記錄失敗:", error);
        alert('查詢失敗，請檢查 ID 是否正確。');
    }
}

// 錯誤處理函數
function handleError(error, defaultMessage) {
    console.error(defaultMessage + ":", error);
    if (error.message.includes("user rejected")) {
        alert("操作被用戶取消");
    } else if (error.message.includes("請切換到 Holesky 測試網")) {
        alert("請確保您已連接到 Holesky 測試網");
    } else if (error.message.includes("餘額不足")) {
        alert("您的帳戶餘額不足，無法完成抵免操作");
    } else if (error.data && error.data.message) {
        alert(error.data.message);
    } else {
        alert(defaultMessage + "，請檢查您的操作是否正確。詳細錯誤：" + error.message);
    }
}

// 頁面加載完成後執行的函數
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 已加載，添加事件監聽器");
    
    // 連接按鈕事件監聽
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
        connectButton.addEventListener('click', connectWallet);
        console.log("已為連接按鈕添加點擊事件監聽器");
    } else {
        console.error("未找到連接按鈕元素");
    }

    // 其他按鈕事件監聽
    const redeemButton = document.getElementById('redeemButton');
    if (redeemButton) {
        redeemButton.addEventListener('click', redeem);
    }
    
    const getRedemptionButton = document.getElementById('getRedemptionButton');
    if (getRedemptionButton) {
        getRedemptionButton.addEventListener('click', getRedemption);
    }
    
    const queryAddressButton = document.getElementById('queryAddressButton');
    if (queryAddressButton) {
        queryAddressButton.addEventListener('click', queryAddressRedemptions);
    }

    // 初始化時嘗試更新最近的抵免記錄
    try {
        // 使用公共節點初始化 web3，這樣即使未連接錢包也能讀取數據
        web3 = new Web3('https://ethereum-holesky.publicnode.com');
        contract = new web3.eth.Contract(contractABI, contractAddress);
        updateRecentRedemptions();
    } catch (error) {
        console.error("初始化時更新記錄失敗:", error);
    }
});

// 定期更新最近的抵免記錄（每30秒）
setInterval(async () => {
    if (web3 && contract) {
        try {
            await updateRecentRedemptions();
        } catch (error) {
            console.error("定期更新記錄失敗:", error);
        }
    }
}, 30000);

// 查詢地址抵免記錄的功能
async function queryAddressRedemptions() {
    const infoElement = document.getElementById('addressRedemptionInfo');
    infoElement.innerText = "正在查詢...";
    try {
        await checkNetwork();
        const addressToQuery = document.getElementById('addressToQuery').value;

        if (!web3.utils.isAddress(addressToQuery)) {
            throw new Error("無效的以太坊地址");
        }

        // 獲取指定地址的所有抵免ID
        const redemptionIds = await contract.methods.getRedemptionIdsByAddress(addressToQuery).call();
        
        if (redemptionIds.length === 0) {
            infoElement.innerText = "該地址沒有抵免記錄";
            return;
        }

        let redemptionDetails = "";
        // 遍歷每個抵免ID並獲取詳細信息
        for (const id of redemptionIds) {
            const result = await contract.methods.getRedemptionById(id).call();
            const redeemer = result[0];
            const amount = result[1];
            redemptionDetails += `抵免ID: ${id}, 抵免者: ${redeemer}, 數量: ${web3.utils.fromWei(amount, 'ether')}\n`;
        }

        infoElement.innerText = redemptionDetails;
    } catch (error) {
        console.error("查詢地址抵免記錄失敗:", error);
        infoElement.innerText = "查詢失敗: " + (error.message || "未知錯誤，請檢查控制台");
    }
}
