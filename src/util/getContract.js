import Web3 from 'web3'
import {address, ABI} from './constants/Contract'

let getContract = new Promise(function (resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider)
  let Contract = web3.eth.contract(ABI)
  let ContractInstance = Contract.at(address)
  // dicegameContractInstance = () => dicegameContractInstance
  resolve(ContractInstance)
})

export default getContract
