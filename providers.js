const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports.getRinkebyProvider = function() {
  return new HDWalletProvider(process.env.OWNER_MNEMONIC, process.env.PROVIDER_URL)
}

module.exports.getMumbaiProvider = function() {
  return new HDWalletProvider(process.env.OWNER_MNEMONIC, 'https://rpc-mumbai.matic.today')
}
