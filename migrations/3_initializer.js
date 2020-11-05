const { Wallet } = require('ethers')

// const UniswapV2Factory = artifacts.require('UniswapV2Factory')
const ERC20 = artifacts.require('ERC20')
const ERC20b = artifacts.require('ERC20b')

module.exports = async function(deployer, environment, accounts) {
  // const factoryInstance = await UniswapV2Factory.deployed()
  const ownerAddress = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC).address
  // sender needs to be same as owner
  // await factoryInstance.setFeeTo(ownerAddress)

  // goes to deployer. deploy 2 tokens
  await deployer.deploy(ERC20, '100000000000000000000', { from: ownerAddress, overwrite: false })
  await deployer.deploy(ERC20b, '100000000000000000000', { from: ownerAddress, overwrite: false })
}
