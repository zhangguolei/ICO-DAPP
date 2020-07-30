const path = require('path');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

//拿到合约的二进制代码
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const { interface, bytecode } = require(contractPath);

//配置provider
const web3 = new Web3(ganache.provider());

let accounts;
let contract;
const inittialBrand = 'BMW';

describe('test contract Car', () => {
    //表示每次运行单测时，都需要重新部署合约实例
    beforeEach(async () => {
        // accounts = await web3.eth.getAccounts();
        // console.log('The account that deploy contract, ', accounts[0]);

        // web3.eth.getAccounts(function (error, accounts) {
        //     if (!error)
        //         console.log(accounts)//授权成功后result能正常获取到账号了
        // });


        // contract = await new web3.eth.Contract(JSON.parse(interface)).deploy({ data: bytecode, arguments: [inittialBrand] }).send({ from: accounts[0], gas: '1000000' });
        // const tx = contract.deploy({ data:bytecode, arguments:[inittialBrand] });
        // const deployRe = tx.send({ from:accounts[0], gas:'1000000' });

        //获取钱包里的账户
        const accounts = await web3.eth.getAccounts();
        console.log('The accout that deploy the contract: ', accounts[0]);

        //创建合约实例，并且部署智能合约
        const contractDeployResult = new web3.eth.Contract(JSON.parse(interface));
        const tx = contractDeployResult.deploy({ data: bytecode, arguments: ['BMW'] });
        contract = await tx.send({ from: accounts[0], gas: '1000000' });
    });
    //单元测试，测试合约是否部署成功
    it('deploy is ok or not', () => {
        assert.ok(contract.options.address);
    });
    //单元测试，测试构造函数是否已经初始化了状态变量
    it('has initial contract', async () => {
        const getBrand = await contract.methods.brand().call();
        assert.equal(getBrand, inittialBrand);
    });
    //单元测试，测试修改函数是否正常
    it('has modify brand', async () => {
        const newBrand = 'Benz';
        await contract.methods.setBrand(newBrand).send({ from: accounts[0] });
        const afterSetBrand = await contract.methods.brand().call();
        assert.equal(afterSetBrand, newBrand);
    });
})