import "@nomiclabs/hardhat-ethers";

const hre = require("hardhat");
const BookLibrary = require('../artifacts/contracts/BookLibrary.sol/BookLibrary.json')



const run = async function() {


    const provider = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/")
    const latestBlock = await provider.getBlock("latest")
    //console.log(latestBlock.hash)

    /// Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
    ///Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

    // BookLibrary deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
    // BookLibrary Contract address:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

    const wallet = new hre.ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    const balance = await wallet.getBalance();
    //console.log(balance.toString())
    // console.log(hre.ethers.utils.formatEther(balance, 18))

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const bookLibraryContract = new hre.ethers.Contract(contractAddress, BookLibrary.abi, wallet)
    console.log(bookLibraryContract)

    // // const hasEnded = await electionContract.electionEnded()
    // // console.log("The election has ended:", hasEnded)

    // // const haveResultsForOhio = await electionContract.resultsSubmitted("Ohio")
    // // console.log("Have results for Ohio:", haveResultsForOhio)

    // const transactionOhio = await electionContract.submitStateResult(["Ohio", 250, 150, 24]);
    // const transactionReceipt = await transactionOhio.wait();
    // if (transactionReceipt.status != 1) { // 1 means success
    // console.log("Transaction was not successful")
    // return 
    // }

    ///Creates a book
    const createBook =  await bookLibraryContract.addBook("New ages", 2);
    var tX = await createBook.wait();
    if (tX.status != 1) {
        console.log("Transaction was not successful")
        return 
    }
    else{
        console.log("Successful book created")
    }
   
    async function logging(id: number) {
        var { 0: bookName } = await bookLibraryContract.getBookDetail(id);
        var { 1: copies } = await bookLibraryContract.getBookDetail(id);
        console.log(bookName);
        console.log("Available copies: ", copies.toString());
    }
    /// Get available books
    const availableBookBNArray = await bookLibraryContract.getAvailableBooks();
    const avlBook = availableBookBNArray.map((item: { toNumber: () => any; }) => item.toNumber());

    avlBook.forEach(async (id: number) => {
        await logging(id);
    });

    /// Borrow a book
    
    const borrolBookId = avlBook[0];
    const borrowBook = await bookLibraryContract.borrowBook(borrolBookId);
    var tX = await borrowBook.wait();
    if (tX.status != 1) {
        console.log("Successful borrowed book")
        return 
    }
  

    await logging(borrolBookId);

    ///// Return a book
    const returnBook = await bookLibraryContract.returnBook(borrolBookId);
    var tX = await returnBook.wait();
    if (tX.status != 1) {
        console.log("Successful returned book")
        return 
    }

    await logging(borrolBookId);

    
}



run()

