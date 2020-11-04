import { providers, Contract, Wallet, utils } from 'ethers'
import getRevertReason from 'eth-revert-reason'

async function main() {
  console.log('running')
  const artifact = await import(`../build/contracts/UniswapV2Factory.json`)
  const IUniswapV2Pair = await import(`../build/contracts/IUniswapV2Pair.json`)

  const provider = new providers.JsonRpcProvider(process.env.PROVIDER_URL)

  const wallet = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC!).connect(provider)
  const contractAddress = await getAddress(artifact, provider)
  const wrappedContract = new Contract(contractAddress, artifact.abi, wallet)

  console.log('Factory address:', contractAddress)

  let feeTo = await wrappedContract.feeTo()
  console.log('feeTo', feeTo)
  let feeToSetter = await wrappedContract.feeToSetter()
  console.log('feeToSetter', feeToSetter)

  let allPairsLength = await wrappedContract.allPairsLength()
  console.log('allPairsLength', allPairsLength.toString())

  let allPairs = await wrappedContract.allPairs(0)
  console.log('allPairs(0)', allPairs)

  let getPair = await wrappedContract.getPair(
    '0x99b5ce3886DADdc8aDF86e3B9eC022d79bd04203',
    '0xc778417E063141139Fce010982780140Aa0cD5Ab'
  )
  console.log('getPair', getPair)

  const pairAddress = '0xB03D823D59C3d5C57a2aB39547f8C43bcdC965B5'
  const pair = new Contract(pairAddress, JSON.stringify(IUniswapV2Pair.abi), provider).connect(wallet)

  const token0 = await pair.token0()
  const token1 = await pair.token1()
  console.log('token0', token0)
  console.log('token1', token1)

  // have to get some WETH first
  let receipt = await wrappedContract.createPair(
    // '0xc778417E063141139Fce010982780140Aa0cD5Ab', // canonical weth
    '0x99b5ce3886DADdc8aDF86e3B9eC022d79bd04203', // ast
    '0x9E123042a63A59c4C7c3993942bE0dAd80077117', // dct
    // '0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658', //random riinkeby DAI
    { gasLimit: 5000000 }
  )

  receipt
    .wait()
    .then((a: any) => {
      console.log('receipt sucess!', a)
    })
    .catch(async (err: any) => {
      console.log('receipt err', err)
      const reason = await getRevertReason(receipt.hash, 'rinkeby')
      console.log('reason', reason)
    })

  // await new Promise((resolve, reject) => {
  //   provider.waitForTransaction(receipt.hash!, 5).then(receipt => {
  //     console.log('DONE!!')

  //     resolve(receipt)
  //   })
  // })
}

export async function getAddress(jsonArtifact: any, ethersProvider: any): Promise<string> {
  const network = await ethersProvider.getNetwork()
  return jsonArtifact.networks[network.chainId].address
}

main()
  .then(suc => {
    console.log('finished!')
  })
  .catch(err => {
    console.log('err', err)
  })
