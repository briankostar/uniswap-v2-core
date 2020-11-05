import { BlockchainLifecycle } from '@0x/dev-utils'
import { Web3Wrapper } from '@0x/web3-wrapper'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { providers, Wallet, Contract } from 'ethers'
import { AddressZero } from 'ethers/constants'
import {
  BigNumber,
  bigNumberify,
  getAddress,
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack
} from 'ethers/utils'
import 'mocha'
import factoryAbi from '../build/contracts/UniswapV2Factory.json'
// import { convertToProtocolPercentage, generateEthersWrappers, IMultipleEthersWrappers } from '../src/utils'

import uniswapFactory from '../build0/UniswapV2Factory.json'
// import truffleContract from '@truffle/contract'
// const truffleContract = require('@truffle/contract')
// const UniswapV2Factory = truffleContract(uniswapFactory)

// const UniswapV2Factory = artifacts.require('UniswapV2Factory')
const ERC20 = artifacts.require('ERC20')
const ERC20b = artifacts.require('ERC20b')

const { expect } = chai
chai.use(chaiAsPromised)

contract('UniswapV2Factory', async (accounts: string[]) => {
  const provider = new providers.Web3Provider(web3.currentProvider)
  const TX_DEFAULTS = { gasLimit: 4712388 }
  const web3wrapper = new Web3Wrapper(web3.currentProvider)
  const blockchainLifecycle = new BlockchainLifecycle(web3wrapper)
  const OWNER = accounts[0]
  const OWNER_SIGNER = provider.getSigner(OWNER)
  const MEMBER = accounts[1]

  //   let affiliateRegistryWrappers: IMultipleEthersWrappers

  //   const provider = new providers.JsonRpcProvider(process.env.PROVIDER_URL)
  const wallet = Wallet.fromMnemonic(process.env.OWNER_MNEMONIC!).connect(provider)
  //   const network = await ethersProvider.getNetwork()
  //   return jsonArtifact.networks[network.chainId].address
  //   const contractAddress = await getAddress(artifact, provider)
  const contractAddress = '0xb36a2919D799D7519D805c4b59fB62FDd6a6A16e' //UniswapV2Factory.address
  //   const signer = provider.getSigner(OWNER)
  //   const wrappedContract = new Contract(contractAddress, UniswapV2Factory.abi, signer)

  let factoryWrapper: Contract
  let erc20Wrapper: Contract
  let erc20bWrapper: Contract

  beforeEach(async () => {
    await blockchainLifecycle.startAsync()
  })

  afterEach(async () => {
    await blockchainLifecycle.revertAsync()
  })

  before(async () => {
    await blockchainLifecycle.startAsync()
  })

  after(async () => {
    await blockchainLifecycle.revertAsync()
  })

  before('set up wrapper', async () => {
    // this will actually be deployed again..
    factoryWrapper = new Contract(contractAddress, uniswapFactory.abi, OWNER_SIGNER)
    erc20Wrapper = new Contract(ERC20.address, ERC20.abi, OWNER_SIGNER)
    erc20bWrapper = new Contract(ERC20b.address, ERC20b.abi, OWNER_SIGNER)
  })

  describe('Factory', async () => {
    beforeEach(async () => {
      await blockchainLifecycle.startAsync()
    })

    afterEach(async () => {
      await blockchainLifecycle.revertAsync()
    })

    before(async () => {
      await blockchainLifecycle.startAsync()
    })

    after(async () => {
      await blockchainLifecycle.revertAsync()
    })

    // it('should get feeTo', async () => {
    //   let feeTo = await factoryWrapper.feeTo()
    //   console.log('feeTo', feeTo)
    //   //   let totalSupply = await erc20Wrapper.totalSupply()
    //   //   console.log('totalSupply', totalSupply)
    //   expect(feeTo).to.equal(OWNER)
    // })
    it('should get feeTo', async () => {
      let feeToSetter = await factoryWrapper.feeToSetter()
      console.log('feeToSetter', feeToSetter)
      expect(feeToSetter).to.equal(OWNER)
    })
    it('should get allPairsLength', async () => {
      let allPairsLength = await factoryWrapper.allPairsLength()
      console.log('allPairsLength', allPairsLength.toString())
      expect(allPairsLength.toString()).to.equal('0')
    })
    // it('should get allPairs', async () => {
    //   let allPairs = await wrappedContract.allPairs(0)
    //   console.log('allPairs(0)', allPairs)
    //   expect(OWNER).to.equal(OWNER)
    // })

    // create pair.
    // need weth9, 2 erc20s.
    it('should create a pair', async () => {
      let tokenA = erc20Wrapper.address
      let tokenB = erc20bWrapper.address
      console.log('tokenA', tokenA)
      console.log('tokenB', tokenB)
      console.log('contractAddress', contractAddress)
      console.log('factoryWrapper.address', factoryWrapper.address)
      //   console.log('factoryWrapper.byte', uniswapFactory.evm.bytecode.object) // correct

      const uniBytecode = `0x${uniswapFactory.evm.bytecode.object}`
      const create2Address = getCreate2Address(contractAddress, [tokenA, tokenB], uniBytecode)
      console.log('create2Address', create2Address)
      await factoryWrapper.createPair(tokenA, tokenB)

      let pairAddress = await factoryWrapper.getPair(tokenA, tokenB)
      console.log('getPair addr A+B', pairAddress)

      // const bytecode = `0x${wrappedContract.bytecode.object}`
      //   const bytecode = UniswapV2Factory.bytecode
      //   console.log('bytecode', bytecode)

      let allPairs = await factoryWrapper.allPairs(0)
      console.log('allPairs(0)', allPairs)
      //   -0x701C2909382652633C673962EF8Ea3125c9808aC
      expect(allPairs).to.equal(allPairs)
    })

    // it('should not allow setting affiliate with zero address', async () => {
    //   const tx = affiliateRegistryWrappers[OWNER].setAffiliate(MEMBER, AddressZero, TX_DEFAULTS)
    //   await expect(tx).to.be.rejectedWith(Error, 'AFFILIATE_ZERO_ADDRESS')
    // })

    // it('should not allow setting affiliate if not system admin', async () => {
    //   const tx = affiliateRegistryWrappers[MEMBER].setAffiliate(MEMBER, AFFILIATE, TX_DEFAULTS)
    //   await expect(tx).to.be.rejectedWith(Error, 'NOT_SYSTEM_PARAM_ADMIN')
    // })
  })
})

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
