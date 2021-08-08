const DataGen = artifacts.require('./DataGen.sol');

const truffleAssert = require('truffle-assertions');

require('chai').should();

contract('DataGen', accounts => {

    beforeEach(async function() {
        this.token = await DataGen.new();
    });

    describe('Inizialise DataGen token attributes', function() {
        it('has the correct name', async function () {
            const name = await this.token.name();
            name.should.equal('DataGen');
        });
        it('has the correct symbol', async function () {
            const symbol = await this.token.symbol();
            symbol.should.equal('#DG');
        });
        it('has the correct decimals for display', async function () {
            const decimals = await this.token.decimals();
            decimals.toString().should.equal('20');
        });
        it('has the correct total supply', async function () {
            const totalSupply = await this.token.totalSupply();
            totalSupply.toString().should.equal('1500000000000000000000000000');
        });
        it('has the correct max supply', async function () {
            const maxSupply = await this.token.totalSupply();
            maxSupply.toString().should.equal('3000000000000000000000000000')
        });
    });
});