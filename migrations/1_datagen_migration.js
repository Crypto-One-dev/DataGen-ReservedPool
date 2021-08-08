const DataGen = artifacts.require("./DataGen.sol");
const ReservedPool = artifacts.require("./ReservedPool.sol");

//Need to change when the contract is being deployed.
const companyWallet = "0x2a9138bE66f7a2b1370C10c6B489A7a5354bB896";

module.exports = async function(deployer) {
  try {
    await deployer.deploy(DataGen);
    const transaction = await web3.eth.getTransaction(DataGen.transactionHash);
    const deployedBlock = await web3.eth.getBlock(transaction.blockNumber);
    const deployedTime = deployedBlock.timestamp;

    await deployer.deploy(ReservedPool, DataGen.address, companyWallet, deployedTime);
  } catch (error) {
    console.log(error);
  }
};
