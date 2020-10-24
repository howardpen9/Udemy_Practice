const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'exact hybrid virus occur price wink dentist spread avoid rug hand curious',
    'https://ropsten.infura.io/v3/c07f35d00a6744d59c8c29d0df6dff9d',
    2,  // Second account : Index 
    1
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    console.log('Attempting to deploy from account:', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hi, there deploy!']})
        .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};

deploy();
