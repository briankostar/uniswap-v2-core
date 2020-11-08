import { providers, Contract, Wallet } from 'ethers'
import {
    BigNumber,
    bigNumberify,
    getAddress,
    keccak256,
    defaultAbiCoder,
    toUtf8Bytes,
    solidityPack
  } from 'ethers/utils'
import getRevertReason from 'eth-revert-reason'

// import UniswapV2Pair from '../build0/UniswapV2Pair.json'

async function main() {
  console.log('running')
//   const artifact = await import(`../build/contracts/UniswapV2Factory.json`)
  const IUniswapV2Pair = await import(`../build/contracts/IUniswapV2Pair.json`)

  const UniswapV2Factory = await import(`../build0/UniswapV2Factory.json`)
  const UniswapV2Pair = await import(`../build0/UniswapV2Pair.json`)
  const ERC20 = await import(`../build0/ERC20.json`)
  const ERC20b = await import(`../build0/ERC20b.json`)

  const factoryAddress = '0xbc3cBf3a409168154Ab4485DA6132Bc48b70F834'
  const erc20Address = '0xf3a6f23E271F06181b0e44895ae916e264522379'
  const erc20bAddress = '0x094999bE4D3AB3f81D2B0036418121A7a3486820' 

  const provider = new providers.JsonRpcProvider(process.env.PROVIDER_URL)
//   const provider = new providers.JsonRpcProvider('http://localhost:8545/')

  const wallet = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC!).connect(provider)
  const owner = '0x8fBE57f7b1017e74da6B23819C85824a5969a232'
//   const contractAddress = await getAddress(artifact, provider)
  const factoryContract = new Contract(factoryAddress, UniswapV2Factory.abi, wallet)
  const erc20Contract = new Contract(erc20Address, ERC20.abi, wallet)
  const erc20bContract = new Contract(erc20bAddress, ERC20b.abi, wallet)

  console.log('Factory address:', factoryAddress)
  console.log('erc20Address:', erc20Address)
  console.log('erc20bAddress:', erc20bAddress)

  let feeTo = await factoryContract.feeTo()
  console.log('feeTo', feeTo)
  let feeToSetter = await factoryContract.feeToSetter()
  console.log('feeToSetter', feeToSetter)

  let allPairsLength = await factoryContract.allPairsLength()
  console.log('allPairsLength', allPairsLength.toString())

  let allPairs = await factoryContract.allPairs(0)
  console.log('allPairs(0)', allPairs)

//   let getPair = await factoryContract.getPair(
//     erc20Address,
//     erc20bAddress
//   )
//   console.log('getPair', getPair)

  const pairAddress = '0x849cE15A40eeC7F91460196782331459B9579378'
  const pair = new Contract(pairAddress, JSON.stringify(IUniswapV2Pair.abi), provider).connect(wallet)

  const token0 = await pair.token0()
  const token1 = await pair.token1()
  console.log('token0', token0)
  console.log('token1', token1)
  const totalSupply = await pair.totalSupply()
  console.log('totalSupply', totalSupply.toString())
  const balanceOf = await pair.balanceOf(owner)
  console.log('balanceOf', balanceOf.toString())
  
  // have to get some WETH first
//   let receipt = await wrappedContract.createPair(
//     // '0xc778417E063141139Fce010982780140Aa0cD5Ab', // canonical weth
//     '0x99b5ce3886DADdc8aDF86e3B9eC022d79bd04203', // ast
//     '0x9E123042a63A59c4C7c3993942bE0dAd80077117', // dct
//     // '0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658', //random riinkeby DAI
//     { gasLimit: 5000000 }
//   )


// const uniBytecode = `0x${UniswapV2Pair.evm.bytecode.object}`
// const create2Address = getCreate2Address(factoryAddress, [erc20Address, erc20bAddress], uniBytecode)
// console.log('create2Address', create2Address);

//   let receipt = await factoryContract.createPair(
//     erc20Address, erc20bAddress,
//     { gasLimit: 5000000 }
//   )

//   receipt
//     .wait()
//     .then(async (a: any) => {
//       console.log('receipt sucess!', a)
//       console.log('a', a.events[0].args);
      

//   let getPair = await factoryContract.getPair(
//     erc20Address,
//     erc20bAddress
//   )
//   console.log('getPair', getPair)

//     let allPairs = await factoryContract.allPairs(0)
//   console.log('allPairs(0)', allPairs)
//     })
//     .catch(async (err: any) => {
//       console.log('receipt err', err)
//       const reason = await getRevertReason(receipt.hash, 'development')
//       console.log('reason', reason)
//     })

  // await new Promise((resolve, reject) => {
  //   provider.waitForTransaction(receipt.hash!, 5).then(receipt => {
  //     console.log('DONE!!')

  //     resolve(receipt)
  //   })
  // })
}

// export async function getAddress(jsonArtifact: any, ethersProvider: any): Promise<string> {
//   const network = await ethersProvider.getNetwork()
//   return jsonArtifact.networks[network.chainId].address
// }


export function getCreate2Address(
    factoryAddress: string,
    [tokenA, tokenB]: [string, string],
    bytecode: string
  ): string {
    const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA]
    const create2Inputs = [
      '0xff',
      factoryAddress,
      keccak256(solidityPack(['address', 'address'], [token0, token1])),
      keccak256(bytecode)
    ]
    const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`
    return getAddress(`0x${keccak256(sanitizedInputs).slice(-40)}`)
  }

main()
  .then(suc => {
    console.log('finished!')
  })
  .catch(err => {
    console.log('err', err)
  })
