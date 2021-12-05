import web3 from './web3';
import Hotel from './build/Hotel.json';

const instance = new web3.eth.Contract(
    Hotel.abi,
    '0x6936cE1aBD283bf0789BfCb4dA4Bf530B3788AB2'
);

export default instance;
