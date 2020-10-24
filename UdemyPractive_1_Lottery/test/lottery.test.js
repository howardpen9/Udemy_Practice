const assert = require('assert');
const ganache =  require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider()); // 選定好測試框架是屬於哪一個 testnet 

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach (async () => {
    accounts = await web3.eth.getAccounts()

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract:', ()=> {
    it('deploys a contract', ()=> {
        assert.ok(lottery.opti
            
            
            ons.address);
    });

    it('allows one account to enter', async() => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async() => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
        await lottery.methods.enter().send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });
        await lottery.methods.enter().send({ from: accounts[2], value: web3.utils.toWei('0.02', 'ether') });

        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
        
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('require a minimum amount of Ether to enter', async() => {
        try { 
            await lottery.methods.enter().send({ from: accounts[0], value: 0});
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only Manager can call pickWinner', async() => {
        try { 
            await lottery.methods.pickWinner().send({ from: accounts[1] });
            assert(false);
        } catch (err) {
            assert(err);
        } 
    });

    it('sneds money to the winner and resets the players array', async() => {
        await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('2','ether') }); //送 Ether 給預設的第一個帳號
        
        const inintialBalance = await web3.eth.getBalance(accounts[0]); // 所以初始的帳號 餘額應該要有東西
        await lottery.methods.pickWinner().send({ from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]); // 宣告最後的 Balance
        const difference = finalBalance - inintialBalance;
        console.log(finalBalance - inintialBalance); // 讀一下兩者差值為多少，可以隱藏此行

        assert(difference > web3.utils.toWei('1.8','ether')); //差值，應該是大於兩者（有手續費
    });

});