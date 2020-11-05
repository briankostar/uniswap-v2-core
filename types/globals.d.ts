/* tslint:disable */

import Web3 from "web3";

interface Artifacts {
  require(name: string): Web3.ContractInstance;
}

declare global {
  function contract(name: string, test: any): void;
  var artifacts: Artifacts;
  var web3: Web3;
}
