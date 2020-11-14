const { Wallet } = require('ethers')

const json = require('../build0/UniswapV2Factory.json')
const contract = require('@truffle/contract')
const UniswapV2Factory = contract(json)
UniswapV2Factory.setProvider(this.web3._provider)

module.exports = async function(deployer, environment, accounts) {
  const ownerAddress = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC).address
  await deployer.deploy(ack, ownerAddress, { from: ownerAddress, overwrite: false })
}
