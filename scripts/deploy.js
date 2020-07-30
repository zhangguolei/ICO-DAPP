const path = require('path');
const fs = require('fs-extra');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const contractPath = path.resolve(__dirname, '../compiled/ICOList.json');
const { interface, bytecode } = require(contractPath);

const HDProvider = new HDWalletProvider(
    //��������̫��Ǯ�������Ǵ�
    'spy yellow senior steel chicken average deal boss ripple sausage nose bus',
    //������infura����̫���ڵ������ַ
    'https://rinkeby.infura.io/v3/e333690ca61a4ad987b4ee109635fbca'
);

//��ʼ��һ��web3ʵ��
const web3 = new Web3(HDProvider);

(async () => {
    //��ȡǮ������˻�
    accounts = await web3.eth.getAccounts();
    console.log('The accout that deploy the contract: ', accounts[0]);

    //������Լʵ�������Ҳ������ܺ�Լ
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

