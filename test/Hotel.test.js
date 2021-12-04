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

    it('can book a room', async () => {
        const room = await hotel.methods.bookRoom(0).call({ from: accounts[0] });
        await hotel.methods.bookRoom(0).send({ from: accounts[0] });

        assert.equal(1, room[0]); // room number is 1
        assert.equal(80084422859880547211683076133703299733277748156566366325829078699459944778998, room[1]); // room key
        
        const room1 = await hotel.methods.getRoom(0).call();

        assert.equal(true, room1[3]); // room is occupied
        assert(0 < room1[4]); // starting time is not 0
    });

    it('can checkout of a room', async () => {
        await hotel.methods.bookRoom(0).send({ from: accounts[0] });
        await hotel.methods.checkout(0).send({ from: accounts[0] });

        const room = await hotel.methods.getRoom(0).call();

        assert(0 < room.start);
        assert(0 < room.end);
    });

    it('can pay', async () => {
        await hotel.methods.bookRoom(0).send({ from: accounts[0] });
        await hotel.methods.checkout(0).send({ from: accounts[0] });
        await hotel.methods.pay(0).send({ from: accounts[0] });

        const room = await hotel.methods.getRoom(0).call();
        
        assert.strictEqual(false, room.occupied);
        assert.equal(0, room.start);
        assert.equal(0, room.end);
        assert.equal(0, room.owing);
    });

    it('can only allow owner to withdraw', async () => {
        await hotel.methods.bookRoom(0).send({ from: accounts[0] });
        await hotel.methods.checkout(0).send({ from: accounts[0] });
        await hotel.methods.pay(0).send({ from: accounts[0] });

        try {
            await hotel.methods.withdraw().send({ from: accounts[1] });
            assert(false);
        } catch (err) {
            assert(err);
        }

        await hotel.methods.withdraw().send({ from: accounts[0] });
        assert(true);
    });
});
