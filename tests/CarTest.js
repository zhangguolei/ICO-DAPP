const path = require('path');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

//�õ���Լ�Ķ����ƴ���
const contractPath = path.resolve(__dirname, '../compiled/Car.json');
const { interface, bytecode } = require(contractPath);

//����provider
const web3 = new Web3(ganache.provider());

let accounts;
let contract;
const inittialBrand = 'BMW';

describe('test contract Car', () => {
    //��ʾÿ�����е���ʱ������Ҫ���²����Լʵ��
    beforeEach(async () => {
        // accounts = await web3.eth.getAccounts();
        // console.log('The account that deploy contract, ', accounts[0]);

        // web3.eth.getAccounts(function (error, accounts) {
        //     if (!error)
        //         console.log(accounts)//��Ȩ�ɹ���result��������ȡ���˺���
        // });


        // contract = await new web3.eth.Contract(JSON.parse(interface)).deploy({ data: bytecode, arguments: [inittialBrand] }).send({ from: accounts[0], gas: '1000000' });
        // const tx = contract.deploy({ data:bytecode, arguments:[inittialBrand] });
        // const deployRe = tx.send({ from:accounts[0], gas:'1000000' });

        //��ȡǮ������˻�
        const accounts = await web3.eth.getAccounts();
        console.log('The accout that deploy the contract: ', accounts[0]);

        //������Լʵ�������Ҳ������ܺ�Լ
        const contractDeployResult = new web3.eth.Contract(JSON.parse(interface));
        const tx = contractDeployResult.deploy({ data: bytecode, arguments: ['BMW'] });
        contract = await tx.send({ from: accounts[0], gas: '1000000' });
    });
    //��Ԫ���ԣ����Ժ�Լ�Ƿ���ɹ�
    it('deploy is ok or not', () => {
        assert.ok(contract.options.address);
    });
    //��Ԫ���ԣ����Թ��캯���Ƿ��Ѿ���ʼ����״̬����
    it('has initial contract', async () => {
        const getBrand = await contract.methods.brand().call();
        assert.equal(getBrand, inittialBrand);
    });
    //��Ԫ���ԣ������޸ĺ����Ƿ�����
    it('has modify brand', async () => {
        const newBrand = 'Benz';
        await contract.methods.setBrand(newBrand).send({ from: accounts[0] });
        const afterSetBrand = await contract.methods.brand().call();
        assert.equal(afterSetBrand, newBrand);
    });
})