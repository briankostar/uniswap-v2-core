const { Wallet } = require('ethers')

// const UniswapV2ERC20 = artifacts.require('UniswapV2ERC20')
const UniswapV2Factory = artifacts.require('UniswapV2Factory')
// const UniswapV2Pair = artifacts.require('UniswapV2Pair')

module.exports = function(deployer, environment, accounts) {
  const ownerAddress = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC).address
  // deployer.deploy(UniswapV2ERC20)
  // deployer.deploy(UniswapV2Pair)
  deployer.deploy(UniswapV2Factory, ownerAddress)
}
