import "@nomiclabs/hardhat-ethers";

const hre = require("hardhat");
const BookLibrary = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json')
const goerliURL: string = process.env.RPC_GOERLI_URL!;
if (!goerliURL) {
  throw new Error("Please set your GOERLI url in a .env file");
}
const infuraApiKey: string = process.env.INFURA_API_KEY!;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}
const goerliKey: string  = process.env.GOERLI_API_KEY!;
if (!goerliURL) {
  throw new Error("Please set your GOERLI key in a .env file");
}
const goerliContractAddress: string  = process.env.GOERLI_DEPLOY_ADDRESS!;
if (!goerliContractAddress) {
  throw new Error("Please set your Contract Address in a .env file");
}

const consoleLog: boolean = false;


const run = async function() {

    async function logging(id: number, action: string) {
        if(consoleLog){ 
            var { 0: bookName } = await bookLibraryContract.getBookDetail(id);
            var { 1: copies } = await bookLibraryContract.getBookDetail(id);
            console.log(bookName);
            console.log(action, copies.toString());
        }
       
    }

    const provider = new hre.ethers.providers.InfuraProvider("goerli", infuraApiKey)
    //const latestBlock = await provider.getBlock("latest")
    // console.log(latestBlock.hash)

    const wallet = new hre.ethers.Wallet(goerliKey, provider);
    const balance = await wallet.getBalance();
    // console.log(balance.toString())
   
    const bookLibraryContract = new hre.ethers.Contract(goerliContractAddress, BookLibrary.abi, wallet)
    // console.log(bookLibraryContract)


    ///Creates a book
    const createBook =  await bookLibraryContract.addBook("New ages", 2);
    var tX = await createBook.wait();
    if (tX.status != 1) {
        console.log("Transaction was not successful")
        return 
    }
  
   
    
    /// Get available books
    const availableBookBNArray = await bookLibraryContract.getAvailableBooks();
    const avlBook = availableBookBNArray.map((item: { toNumber: () => any; }) => item.toNumber());

    avlBook.forEach(async (id: number) => {
        await logging(id, "Available books: ");
    });

    /// Borrow a book
    
    const borrolBookId = avlBook[0];
    const borrowBook = await bookLibraryContract.borrowBook(borrolBookId);
    var tX = await borrowBook.wait();
    if (tX.status != 1) {
       // console.log("Successful borrowed book")
        return 
    }
  

    await logging(borrolBookId, "Available book after borrow: ");

    ///// Return a book
    const returnBook = await bookLibraryContract.returnBook(borrolBookId);
    var tX = await returnBook.wait();
    if (tX.status != 1) {
        console.log("Successful returned book")
        return 
    }

    await logging(borrolBookId, "Available books after return");

    
}

run()

