const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");


describe("BookLibrary", function () {   

  
    const bookName = "Once upon a time";
    const copies = 10;
    
    assertAsyncThrows = async function (promise) {
        try {
          await promise;
        } catch (_) {
          return;
        }
        assert.fail();
      };
      

    async function deployBookLibraryFixture() {
        const bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    
        const LibraryContract = await bookLibraryFactory.deploy();
    
        await LibraryContract.deployed();
    
        // Fixtures can return anything you consider useful for your tests
        return { bookLibraryFactory, LibraryContract, owner, addr1, addr2, addr3 };
      }
    
    it("Add book", async () => {

        const { LibraryContract, owner } = await loadFixture(deployBookLibraryFixture);
       
        await LibraryContract.connect(owner).addBook(bookName, copies);
        await LibraryContract.addBook(bookName + "1", copies);
        await LibraryContract.addBook(bookName + "2", copies);
        const counter = await LibraryContract.bookCount;
       
        assert(counter, 3); // NOBODY
      });

      it("Add book copies", async () => {

        const { LibraryContract, owner } = await loadFixture(deployBookLibraryFixture);
        await LibraryContract.connect(owner).addBook(bookName, 2);
        const availableBookBNArray = await LibraryContract.getAvailableBooks();
        const avlBook = availableBookBNArray.map((item) => item.toNumber());
        await LibraryContract.connect(owner).addBookCopies(avlBook[0], 3)
        const { 1: totalCount } = await LibraryContract.getBookDetail(avlBook[0]);
        assert.equal(totalCount.toNumber(), 5);
        
      });
    
    it("Borrow book", async () => {
        const { LibraryContract, owner, addr1, addr2,addr3 } = await loadFixture(deployBookLibraryFixture);
        await LibraryContract.connect(owner).addBook(bookName, 2);
        const availableBookBNArray = await LibraryContract.getAvailableBooks();
        const avlBook = availableBookBNArray.map((item) => item.toNumber());
        await LibraryContract.connect(addr1).borrowBook(avlBook[0]);
        await assertAsyncThrows(
          LibraryContract.connect(addr1).borrowBook(avlBook[0])
        );
        await LibraryContract.connect(addr2).borrowBook(avlBook[0]);
        const { 1: totalCount } = await LibraryContract.getBookDetail(avlBook[0]);
        assert.equal(totalCount.toNumber(), 0);
        await assertAsyncThrows(
          LibraryContract.connect(addr3).borrowBook(avlBook[0])
        );
      });
    

      it("Return book", async () => {
        const { LibraryContract, owner, addr1, addr2,addr3 } = await loadFixture(deployBookLibraryFixture);
        await LibraryContract.connect(owner).addBook(bookName, 2);
        const availableBookBNArray = await LibraryContract.getAvailableBooks();
        const avlBook = availableBookBNArray.map((item) => item.toNumber());
        await LibraryContract.connect(addr1).borrowBook(avlBook[0]);
        await LibraryContract.connect(addr2).borrowBook(avlBook[0]);
        const { 1: avlCopies } = await LibraryContract.getBookDetail(avlBook[0]);
        assert.equal(avlCopies.toNumber(), 0);
      
    
      });

      it("History of borrowers for a given book", async () => {
        const { LibraryContract, owner, addr1, addr2, addr3 } = await loadFixture(deployBookLibraryFixture);
        await LibraryContract.connect(owner).addBook(bookName, 2);
        const availableBookBNArray = await LibraryContract.getAvailableBooks();
        const avlBook = availableBookBNArray.map((item) => item.toNumber());
        await LibraryContract.connect(addr1).borrowBook(avlBook[0]);
    
        await LibraryContract.connect(addr2).borrowBook(avlBook[0]);
        const { 1: avlCopies } = await LibraryContract.getBookDetail(avlBook[0]);
        assert.equal(avlCopies.toNumber(), 0);
    
        await LibraryContract.connect(addr1).returnBook(avlBook[0]);
        await LibraryContract.connect(addr3).borrowBook(avlBook[0]);
    
        await LibraryContract.connect(addr2).returnBook(avlBook[0]);
        await LibraryContract.connect(addr3).returnBook(avlBook[0]);
        assert.equal(avlCopies.toNumber(), 0);
        const data = await LibraryContract.getOwnerHistoryOfBook(avlBook[0]);
        // console.log(data);
        const result = [addr1, addr2, addr3];
        // console.log(result);
        assert.equal(data.length, result.length);
        assert.equal(data[0], result[0].address);
        assert.equal(data[1], result[1].address);
        assert.equal(data[2], result[2].address);
      });

     

})

