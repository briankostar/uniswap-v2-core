const { Wallet } = require('ethers')

// const json = require('../build0/UniswapV2Factory.json')
// const contract = require('@truffle/contract')
// const UniswapV2Factory = contract(json)
// UniswapV2Factory.setProvider(this.web3._provider)

// const UniswapV2ERC20 = artifacts.require('UniswapV2ERC20')
const UniswapV2Factory = artifacts.require('UniswapV2Factory')
// const UniswapV2Factory = artifacts.require('../build0/UniswapV2Factory.json')
// const UniswapV2Pair = artifacts.require('UniswapV2Pair')


module.exports = async function(deployer, environment, accounts) {
  const ownerAddress = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC).address
  // deployer.deploy(UniswapV2ERC20)
  // deployer.deploy(UniswapV2Pair)
  await deployer.deploy(UniswapV2Factory, ownerAddress, { from: ownerAddress, overwrite: false })

  // await UniswapV2Factory.setFeeTo(ownerAddress)
  // await deployer.deploy(UniswapV2Factory, ownerAddress)
}

// const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
// const contract = require('@truffle/contract');
// const UniswapV2Factory = contract(json);

// UniswapV2Factory.setProvider(this.web3._provider);

// module.exports = function(_deployer, network, accounts) {
//   _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]})
// };
