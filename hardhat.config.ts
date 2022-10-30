import type { HardhatUserConfig } from "hardhat/config";
import { subtask, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import "hardhat-gas-reporter"



const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const infuraApiKey: string = process.env.INFURA_API_KEY!;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const etherScanApiKey: string = process.env.ETHERSCAN_API_KEY!;
if (!etherScanApiKey) {
  throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
}

const goerliURL: string = process.env.RPC_GOERLI_URL!;
if (!goerliURL) {
  throw new Error("Please set your GOERLI url in a .env file");
}

const sepoliaURL: string = process.env.RPC_SEPOLIA_URL!;
if (!goerliURL) {
  throw new Error("Please set your Sepolia url in a .env file");
}

const goerliKey: string  = process.env.GOERLI_API_KEY!;
if (!goerliURL) {
  throw new Error("Please set your GOERLI key in a .env file");
}


const config: HardhatUserConfig  = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
  },
  defaultNetwork: "localhost",
  networks: {
   
    goerli: {
      url: goerliURL + infuraApiKey,
      accounts: [goerliKey],
      chainId: 5,
    },
    sepolia: {
      url: sepoliaURL + infuraApiKey,
      accounts: [goerliKey],
      chainId: 11155111,
    },
  
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at <https://etherscan.io/>
    apiKey: etherScanApiKey
  },
  
 
  
}

export default config;



task("deploy-testnets", "Deploys contract on a provided network")
    .setAction(async (taskArguments, hre, runSuper) => {
        const deployBookLibrary = require("./scripts/deploy");

        await deployBookLibrary(taskArguments);
        await hre.run('print', { message: "Done!" })
    });

subtask("print", "Prints a message")
    .addParam("message", "The message to print")
    .setAction(async (taskArgs) => {
      console.log(taskArgs.message);
    });

task("deploy-goerli", "Deploys contract on a provided network")
.addParam("privateKey", "Please provide the private key")
.setAction(async ({privateKey}) => {
    const deployBookLibrary = require("./scripts/deploy-with-param");
    await deployBookLibrary(privateKey);
});





