const hre = require('hardhat')
const ethers = hre.ethers;

async function deployBookLibrary(args) {
  await hre.run('compile'); // We are compiling the contracts using subtask
  
  const [deployer] = await ethers.getSigners(); // We are getting the deployer

  console.log('Deploying contracts with the account:', deployer.address); // We are printing the address of the deployer
  console.log('Account balance:', (await deployer.getBalance()).toString()); // We are printing the account balance

  const BookLibrary = await ethers.getContractFactory("BookLibrary");
  const bookLibrary = await BookLibrary.deploy();
  await bookLibrary.deployed();
  console.log("BookLibrary deployed to:", bookLibrary.address);
  console.log('BookLibrary Contract address: ', bookLibrary.address);
  await hre.run("verify:verify", {
    address: bookLibrary.address,
  
  });

}

deployBookLibrary()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); // Calling the function to deploy the contract 

module.exports = deployBookLibrary;
