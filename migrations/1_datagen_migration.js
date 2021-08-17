const DataGen = artifacts.require("./DataGen.sol");
const ReservedPool = artifacts.require("./ReservedPool.sol");
const CoFounderPool = artifacts.require("./CoFounderPool.sol");

//Need to change when the contract is being deployed.
const companyWallet = "0x2a9138bE66f7a2b1370C10c6B489A7a5354bB896";
const aWallet = "0xA072Bb9B76b2e695De35A170F15EAbDD3057771b";
const lWallet = "0x042232B0420c42d1B02D948b951c8466D9c21AD6";

module.exports = async function(deployer) {
  try {
    await deployer.deploy(DataGen);
    const transaction = await web3.eth.getTransaction(DataGen.transactionHash);
    const deployedBlock = await web3.eth.getBlock(transaction.blockNumber);
    const deployedTime = deployedBlock.timestamp;

    await deployer.deploy(ReservedPool, DataGen.address, companyWallet);
    await deployer.deploy(CoFounderPool, DataGen.address, aWallet, lWallet, deployedTime);
  } catch (error) {
    console.log(error);
  }
};
