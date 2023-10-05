// Function that calls add_notification function in smart contract

const hre = require("hardhat");
const path = require("path");
const { Signer, Wallet } = require("ethers");
const dapp_data = require("../dapp/dapp-data.json");
const wallets = require("../wallets-example.json");

// Converts private key to a signer
async function key_to_signer(priv) {
    const provider = hre.ethers.provider;
    const signer_wallet = new Wallet(priv);
    const signer = signer_wallet.connect(provider);
    return signer;
  }
  
const contract_name = "CalculateAlpha";

async function main() {  
    // Gets smart contract ABI
    const Contract = await ethers.getContractFactory(contract_name);
    // Attatches contract address for IRL location
    const dapp = await Contract.attach(dapp_data.dapp_address);

    // Input values
    // var s_matrix = [
    //     [1, 0.25, 0.05],
    //     [0.33, 1, 0.03],
    //     [0.53, 0.28, 1]
    // ]

    var s_matrix = [
        [1, 0.25613333, 0.05081417],
        [0.33729138, 1, 0.03541658],
        [0.52717319, 0.27902039, 1]
    ]

    const multiplier = Math.pow(10,14);

    var b = [multiplier, multiplier, multiplier];

    //alpha = [0.31327176, 0.31492591, 0.37180233]

    
    for (let x = 0; x < s_matrix.length; x++) {
        for (let y = 0; y < s_matrix.length; y++) {
            s_matrix[x][y] = Math.round(s_matrix[x][y] * multiplier);            
        }
    }

    tx_params = {
        gasLimit: 1000000 
    }

    tx1 = await dapp.connect(await key_to_signer(wallets["a"]["private"]))._compute_alpha(s_matrix, b, tx_params);
    console.log(tx1);
    // out = []
    // for (let x = 0; x < tx.length; x++) {
    //     out.push(parseInt(tx[x]));
    // }
    // console.log(out);

    // var out = []
    // for (let y = 0; y < tx.length; y++) {
    //     var temp = [];
    //     for (let x = 0; x < tx.length; x++) {
    //         temp.push(parseInt(tx[x][y])/multiplier);
    //     }
    //     out.push(temp);
    // }

    // console.log(out);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
