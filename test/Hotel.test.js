const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));

const { abi, evm } = require('../ethereum/build/Hotel.json');

let accounts;
let hotel;

const typeOfRoom = ['Single', 'Double', 'Suite'];

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    hotel = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
        arguments: [],
      })
      .send({ from: accounts[0], gas: '10000000' });
});

describe('Hotel', () => {
    it('deploys a contract', () => {
        assert.ok(hotel.options.address);
    });

    it('can get a room', async () => {
        const room1 = await hotel.methods.getRoom(0).call();
        
        assert.equal(20000000000000000, room1[0]); // room price is 20000000000000000 wei
        assert.equal(0, room1[1]); // room type is single
        assert.equal(1, room1[2]); // room number is 1
        assert.equal(false, room1[3]); // room is not occupied
        assert.equal(0, room1[4]); // starting time is 0
        assert.equal(0, room1[5]); // ending time is 0
        assert.equal(0, room1[6]); // owing of room is 0
    });
});
