"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreate2Address = void 0;
const dev_utils_1 = require("@0x/dev-utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const chai_1 = __importDefault(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const ethers_1 = require("ethers");
const utils_1 = require("ethers/utils");
require("mocha");
// import { convertToProtocolPercentage, generateEthersWrappers, IMultipleEthersWrappers } from '../src/utils'
const UniswapV2Factory_json_1 = __importDefault(require("../build0/UniswapV2Factory.json"));
const UniswapV2Pair_json_1 = __importDefault(require("../build0/UniswapV2Pair.json"));
const UniswapV2Factory_json_2 = __importDefault(require("../build0/UniswapV2Factory.json"));
const UniswapV2Factory_json_3 = __importDefault(require("../build0/UniswapV2Factory.json"));
// import truffleContract from '@truffle/contract'
// const truffleContract = require('@truffle/contract')
// const UniswapV2Factory = truffleContract(uniswapFactory)
const UniswapV2Factory2 = artifacts.require('UniswapV2Factory');
// const ERC20 = artifacts.require('ERC20')
// const ERC20b = artifacts.require('ERC20b')
const { expect } = chai_1.default;
chai_1.default.use(chai_as_promised_1.default);
contract('UniswapV2Factory', (accounts) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new ethers_1.providers.Web3Provider(web3.currentProvider);
    const TX_DEFAULTS = { gasLimit: 4712388 };
    const web3wrapper = new web3_wrapper_1.Web3Wrapper(web3.currentProvider);
    const blockchainLifecycle = new dev_utils_1.BlockchainLifecycle(web3wrapper);
    const OWNER = accounts[0];
    const OWNER_SIGNER = provider.getSigner(OWNER);
    const MEMBER = accounts[1];
    //   let affiliateRegistryWrappers: IMultipleEthersWrappers
    //   const provider = new providers.JsonRpcProvider(process.env.PROVIDER_URL)
    const wallet = ethers_1.Wallet.fromMnemonic(process.env.OWNER_MNEMONIC).connect(provider);
    //   const network = await ethersProvider.getNetwork()
    //   return jsonArtifact.networks[network.chainId].address
    //   const contractAddress = await getAddress(artifact, provider)
    const contractAddress = '0xb36a2919D799D7519D805c4b59fB62FDd6a6A16e'; //UniswapV2Factory.address
    const erc20Address = '0xb36a2919D799D7519D805c4b59fB62FDd6a6A16e'; //UniswapV2Factory.address
    const erc20bAddress = '0xb36a2919D799D7519D805c4b59fB62FDd6a6A16e'; //UniswapV2Factory.address
    //   const signer = provider.getSigner(OWNER)
    //   const wrappedContract = new Contract(contractAddress, UniswapV2Factory.abi, signer)
    let factoryWrapper;
    let erc20Wrapper;
    let erc20bWrapper;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield blockchainLifecycle.startAsync();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield blockchainLifecycle.revertAsync();
    }));
    // before(async () => {
    //   await blockchainLifecycle.startAsync()
    // })
    // after(async () => {
    //   await blockchainLifecycle.revertAsync()
    // })
    before('set up wrapper', () => __awaiter(void 0, void 0, void 0, function* () {
        // this will actually be deployed again..
        factoryWrapper = new ethers_1.Contract(contractAddress, UniswapV2Factory_json_1.default.abi, OWNER_SIGNER);
        erc20Wrapper = new ethers_1.Contract(erc20Address, UniswapV2Factory_json_2.default.abi, OWNER_SIGNER);
        erc20bWrapper = new ethers_1.Contract(erc20bAddress, UniswapV2Factory_json_3.default.abi, OWNER_SIGNER);
    }));
    describe('Factory', () => __awaiter(void 0, void 0, void 0, function* () {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield blockchainLifecycle.startAsync();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield blockchainLifecycle.revertAsync();
        }));
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            yield blockchainLifecycle.startAsync();
        }));
        after(() => __awaiter(void 0, void 0, void 0, function* () {
            yield blockchainLifecycle.revertAsync();
        }));
        // it('should get feeTo', async () => {
        //   let feeTo = await factoryWrapper.feeTo()
        //   console.log('feeTo', feeTo)
        //   //   let totalSupply = await erc20Wrapper.totalSupply()
        //   //   console.log('totalSupply', totalSupply)
        //   expect(feeTo).to.equal(OWNER)
        // })
        it('should get feeTo', () => __awaiter(void 0, void 0, void 0, function* () {
            let feeToSetter = yield factoryWrapper.feeToSetter();
            console.log('feeToSetter', feeToSetter);
            expect(feeToSetter).to.equal(OWNER);
        }));
        it('should get allPairsLength', () => __awaiter(void 0, void 0, void 0, function* () {
            let allPairsLength = yield factoryWrapper.allPairsLength();
            console.log('allPairsLength', allPairsLength.toString());
            expect(allPairsLength.toString()).to.equal('0');
        }));
        // it('should get allPairs', async () => {
        //   let allPairs = await wrappedContract.allPairs(0)
        //   console.log('allPairs(0)', allPairs)
        //   expect(OWNER).to.equal(OWNER)
        // })
        // create pair.
        // need weth9, 2 erc20s.
        it('should create a pair', () => __awaiter(void 0, void 0, void 0, function* () {
            let tokenA = erc20Address;
            let tokenB = erc20bAddress;
            console.log('tokenA', tokenA);
            console.log('tokenB', tokenB);
            console.log('contractAddress', contractAddress);
            console.log('factoryWrapper.address', factoryWrapper.address);
            //   console.log('factoryWrapper.byte', uniswapFactory.evm.bytecode.object) // correct
            const uniBytecode = `0x${UniswapV2Pair_json_1.default.evm.bytecode.object}`;
            const create2Address = getCreate2Address(contractAddress, [tokenA, tokenB], uniBytecode);
            console.log('create2Address', create2Address);
            yield factoryWrapper.createPair(tokenA, tokenB);
            let pairAddress = yield factoryWrapper.getPair(tokenA, tokenB);
            console.log('getPair addr A+B', pairAddress);
            // const bytecode = `0x${wrappedContract.bytecode.object}`
            //   const bytecode = UniswapV2Factory.bytecode
            //   console.log('bytecode', bytecode)
            let allPairs = yield factoryWrapper.allPairs(0);
            console.log('allPairs(0)', allPairs);
            //   -0x701C2909382652633C673962EF8Ea3125c9808aC
            expect(allPairs).to.equal(allPairs);
        }));
        // it('should not allow setting affiliate with zero address', async () => {
        //   const tx = affiliateRegistryWrappers[OWNER].setAffiliate(MEMBER, AddressZero, TX_DEFAULTS)
        //   await expect(tx).to.be.rejectedWith(Error, 'AFFILIATE_ZERO_ADDRESS')
        // })
        // it('should not allow setting affiliate if not system admin', async () => {
        //   const tx = affiliateRegistryWrappers[MEMBER].setAffiliate(MEMBER, AFFILIATE, TX_DEFAULTS)
        //   await expect(tx).to.be.rejectedWith(Error, 'NOT_SYSTEM_PARAM_ADMIN')
        // })
    }));
}));
function getCreate2Address(factoryAddress, [tokenA, tokenB], bytecode) {
    const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
    const create2Inputs = [
        '0xff',
        factoryAddress,
        utils_1.keccak256(utils_1.solidityPack(['address', 'address'], [token0, token1])),
        utils_1.keccak256(bytecode)
    ];
    const sanitizedInputs = `0x${create2Inputs.map(i => i.slice(2)).join('')}`;
    return utils_1.getAddress(`0x${utils_1.keccak256(sanitizedInputs).slice(-40)}`);
}
exports.getCreate2Address = getCreate2Address;
