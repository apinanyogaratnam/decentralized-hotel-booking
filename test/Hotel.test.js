const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../ethereum/build/Hotel.json');

let accounts;
let hotel;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    hotel = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
        arguments: [],
      })
      .send({ from: accounts[0], gas: '1000000' });
});

describe('Hotel', () => {
    it('deploys a contract', () => {
        assert.ok(hotel.options.address);
    });
});
