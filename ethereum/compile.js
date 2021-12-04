const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const hotelPath = path.resolve(__dirname, 'contracts', 'Hotel.sol');
const source = fs.readFileSync(hotelPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Hotel.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
fs.ensureDirSync(buildPath);

fs.outputJsonSync(
    path.resolve(buildPath, 'Hotel.json'),
    output.contracts['Hotel.sol']['Hotel']
);
