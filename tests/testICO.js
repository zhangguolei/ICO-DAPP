const assert = require('assert');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs-extra');
const ganache = require('ganache-cli');

const web3 = new Web3(ganache.provider());
const ICOList = require(path.resolve(__dirname, '../compiled/ICOList.json'));
const ICOPro = require(path.resolve(__dirname, '../compiled/ICO.json'));

let accounts;
let icoList;
let ico;

describe('ICO Contract', () => {
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
        icoList = await new web3.eth.Contract(JSON.parse(ICOList.interface)).deploy({ data: ICOList.bytecode }).send({ from:accounts[0], gas:'1000000' });
        
        await icoList.methods.createICO('20000', '1000', '5000', 'creating llei coin.').send({
            from: accounts[0],
            gas: '1000000',
        });

        const [address] = await icoList.methods.getAllICOPros().call();  /////////?????????????????????????? 
        ico = await new web3.eth.Contract(JSON.parse(ICOPro.interface), address);  /////////??????????????????????????
    });

    it('should deploy icolist and ico', async () => {
        assert.ok(icoList.options.address);
        assert.ok(ico.options.address);
    });

    it('could save correct project properties', async () => {
        const tempGoalAmount = await ico.methods.goalAmount().call();
        const tempMinAmount = await ico.methods.minAmount().call();
        const tempMaxAmount = await ico.methods.maxAmount().call();
        const tempDescription = await ico.methods.description().call();
        const tempOnwer = await ico.methods.owner().call();

        assert.equal(tempOnwer, accounts[0]);
        assert.equal(tempGoalAmount, '20000');
        assert.equal(tempMinAmount, '1000');
        assert.equal(tempMaxAmount, '5000');
        assert.equal(tempDescription, 'creating llei coin.');
    });

    it('test contribute is ok or not', async () => {
        const tempInvester = accounts[1];
        await ico.methods.invest().send({
            from: tempInvester,
            value: '100'
        });

        const tempInvest = await ico.methods.investers(tempInvester).call();
        assert.ok(tempInvest == '100');
    });

    it('should require minInvest', async () => {
        try {
            const tempInvester = accounts[1];
            await ico.methods.invest().send({
                from: tempInvester,
                value: '10'
            });
            assert.ok(false);
        } catch (error) {
            assert.ok(error);
        }
    });

    it('should require maxInvest', async () => {
        try {
            const tempInvester = accounts[1];
            await ico.methods.invest().send({
                from: tempInvester,
                value: '10000'
            });
            assert.ok(false);
        } catch (error) {
            assert.ok(false);
        }
    });
});