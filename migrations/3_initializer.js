const { Wallet } = require('ethers')

const UniswapV2Factory = artifacts.require('UniswapV2Factory')

module.exports = async function(deployer, environment, accounts) {
  const factoryInstance = await UniswapV2Factory.deployed()
  const ownerAddress = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC).address
  await factoryInstance.setFeeTo(ownerAddress)
}
