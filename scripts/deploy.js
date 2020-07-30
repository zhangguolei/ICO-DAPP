const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const contractPath = path.resolve(__dirname, '../compiled/ICOList.json');
const { interface, bytecode } = require(contractPath);

const HDProvider = new HDWalletProvider(
    //这里是以太坊钱包的助记词
    'spy yellow senior steel chicken average deal boss ripple sausage nose bus',
    //这里是infura的以太坊节点入口网址
    'https://rinkeby.infura.io/v3/e333690ca61a4ad987b4ee109635fbca'
);

//初始化一个web3实例
const web3 = new Web3(HDProvider);

(async () => {
    //获取钱包里的账户
    accounts = await web3.eth.getAccounts();
    console.log('The accout that deploy the contract: ', accounts[0]);

    //创建合约实例，并且部署智能合约
    const contractDeployResult = new web3.eth.Contract(JSON.parse(interface));
    const tx = contractDeployResult.deploy({ data:bytecode });
    const re = await tx.send({ from:accounts[0], gas:'1000000' });

    const contractAddress = re.options.address;

    console.log('contract deploy successful: ', contractAddress);
    console.log('contact address: ', `https://rinkeby.etherscan.io/address/${contractAddress}`);

    const addressFile = path.resolve(__dirname, '../address.json');
    fs.writeFileSync(addressFile, JSON.stringify(contractAddress));
    console.log('write address sccessful: ', addressFile);

    console.log('Contract deployment successful.', re);
})();

