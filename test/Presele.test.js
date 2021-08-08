const Presale = artifacts.require('./Presale.sol');
const DataGen = artifacts.require('./Datagen.sol');

const truffleAssert = require('truffle-assertions');
const { BN, constants, time } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

require('chai')
    .use(require('chai-bignumber')(BN))
    .should();

contract('Presale', accounts => {
    const _start = '1623580489';                        // presale start
    const _dead = '1642066387';                         // presale end 
    const _end = '1623882068';                          // end of the ICO 
    const maxGoal = '3000000000000000000000000000';     // max amount to reach in the presale 
    const price = new BN(22222);                        // constant to multiple to get DataGen
    const presaleClosed = false;                        // presale status


    beforeEach(async function() {
        this.token = await DataGen.new();
        this.presale = await Presale.deployed();
    });

    describe('Inizialise presale attributes', function() {
        it('has the correct maxGoal', async function () {
            const maxG = await this.presale.maxGoal();
            maxG.toString().should.equal(maxGoal);
        });

        it('has the correct token price', async function () {
            const p = await this.presale.price();
            p.toString().should.equal(price.toString());
        });
        
        it('has presaleClosed equal to false', async function () {
            const preClosed = await this.presale.presaleClosed();
            preClosed.should.equal(presaleClosed);
        });
    });

    describe('Invest', function() {
        it('has the correct starting presale time', async function () {
            const start = await this.presale.start();
            start.toString().should.equal(_start.toString());
        });

        it('has the correct deadline presale time', async function () {
            const deadline = await this.presale.deadline();
            deadline.toString().should.equal(_dead.toString());
        });

        it('has the correct end of ICO time', async function () {
            const endOfICO = await this.presale.endOfICO();
            endOfICO.toString().should.equal(_end.toString());
        });

        it('should not be able to invest if presale is not start', async function () {
            const one_eth = web3.utils.toWei('1', "ether");
            futureDate = Math.floor(Date.now() / 1000) + 100;
            
            const instance = await Presale.new(this.token.address, futureDate, _dead, _end);
            await truffleAssert.reverts(web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: one_eth, gas:6721975}));
        });

        it('should not be able to invest if presale is over deadline', async function () {
            const one_eth = web3.utils.toWei('1', "ether");
            pastDate = Math.floor(Date.now() / 1000) - 100;

            const instance = await Presale.new(this.token.address, _start, pastDate, _end);
            await truffleAssert.reverts(web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: one_eth, gas:6721975}));
        });

        it('should not be able to invest less than 0.5 eth for transaction', async function () {
            const less_eth = web3.utils.toWei('0.4', "ether");
            await truffleAssert.reverts(web3.eth.sendTransaction({from: accounts[1], to: this.presale.address, value: less_eth, gas:6721975}), 'Fund is less than 0.5 ETH');
        }); 

        it('should not be able to invest more than 20 eth for transaction', async function () {
            const more_eth = web3.utils.toWei('21', "ether");
            await truffleAssert.reverts(web3.eth.sendTransaction({from: accounts[1], to: this.presale.address, value: more_eth, gas:6721975}), 'Fund is more than 20 ETH');
        });

        it("invest 1 eth add price times 1'000'000'000'000'000'000 tokens to investor account", async function () {
            const one_eth = web3.utils.toWei('1', "ether");
            const one_ethBN = new BN(one_eth);
            let DatagenBalanceExpect = new BN;
            DatagenBalanceExpect = DatagenBalanceExpect.add(one_ethBN.mul(price));
            
            const instance = await Presale.new(this.token.address, _start, _dead, _end);
            await web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: one_eth, gas: 6721975});
            const balanceOfDataGen = await instance.balanceOfDataGen(accounts[1]);
            balanceOfDataGen.toString().should.equal(DatagenBalanceExpect.toString());
        });

        it("invest 2 eth add price times 2'000'000'000'000'000'000 tokens to investor account", async function () {
            const two_eth = web3.utils.toWei('2', "ether");
            const two_ethBN = new BN(two_eth);
            let DatagenBalanceExpect = new BN;
            DatagenBalanceExpect = DatagenBalanceExpect.add(two_ethBN.mul(price));

            const instance = await Presale.new(this.token.address, _start, _dead, _end);
            await web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: two_eth, gas:6721975});
            const balanceOfDataGen = await instance.balanceOfDataGen(accounts[1]);
            balanceOfDataGen.toString().should.equal(DatagenBalanceExpect.toString());
        });

        it("invest 2 eth from 3 different account add price times 2'000'000'000'000'000'000 tokens to amountRaised balance", async function () {
            const two_eth = web3.utils.toWei('2', "ether");
            let amountRaisedExpect = web3.utils.toWei('6', "ether");
            
            const instance = await Presale.new(this.token.address, _start, _dead, _end);
            await web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: two_eth, gas:6721975});
            await web3.eth.sendTransaction({from: accounts[2], to: instance.address, value: two_eth, gas:6721975});
            await web3.eth.sendTransaction({from: accounts[3], to: instance.address, value: two_eth, gas:6721975});

            const amountRaised = await instance.amountRaised();
            amountRaised.toString().should.equal(amountRaisedExpect.toString());
        }); 
    });

    // //must to restart ganache before take a new test
    // describe('After ICO closing', function () {
    //     it('not be able to get DataGen if there are no contributions', async function() {
    //         pastDate = Math.floor(Date.now() / 1000) - 100;
    //         const instance = await Presale.new(this.token.address, _start, pastDate, pastDate);
    //         await truffleAssert.reverts(instance.getDataGen({from: accounts[1]}), 'Zero ETH contributed.');  
    //     });
    //     it('get DataGen after the ICO if invested', async function() {
    //         const start = Math.floor(Date.now() / 1000) - 100;
    //         const deadEnd = Math.floor(Date.now() / 1000) + 100;

    //         const tokenInstance = await DataGen.new();
    //         const presaleInstance = await Presale.new(tokenInstance.address, start, deadEnd, deadEnd);

    //         await tokenInstance.transfer(presaleInstance.address, '300000000000000000000000000');

    //         const two_eth = web3.utils.toWei('2', "ether");
    //         const two_ethBN = new BN(two_eth);
    //         let DatagenBalanceExpect = new BN;
    //         DatagenBalanceExpect = DatagenBalanceExpect.add(two_ethBN.mul(price));
    //         await web3.eth.sendTransaction({from: accounts[1], to: presaleInstance.address, value: two_eth, gas: 6721975});

    //         await time.increase('10000');
    //         presaleInstance.getDataGen({from: accounts[1]});

    //         actualBalance = await tokenInstance.balanceOf(accounts[1]);

    //         actualBalance.toString().should.equal(DatagenBalanceExpect.toString());
    //     });
    // });
})