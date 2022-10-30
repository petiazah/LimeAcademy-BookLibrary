// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";


contract BookLibrary is Ownable {
    
    struct Book {
        string name;
        uint availableCopies;
        uint ownerCount;
        mapping(uint => address) ownersHistory;
    }

    uint public bookCount = 0;

    mapping(string => bool) private isPresent;
    mapping(address => mapping(uint => bool)) private isAlreadyIssued;
    mapping(uint => Book) public BookDatabase;

  

    function addBook(string memory _name, uint _copies)
        external
        onlyOwner 
    {
        require(!isPresent[_name]);
        isPresent[_name] = true;
        bookCount++;
        Book storage book = BookDatabase[bookCount];
        book.name = _name;
        book.availableCopies = _copies;
    }

    function addBookCopies(uint _bookId, uint _copies)
        external
        onlyOwner
    {
        require(_copies > 0);
        Book storage book = BookDatabase[_bookId];
        book.availableCopies = book.availableCopies +_copies;
    }
   
    function borrowBook(uint _id) external {
        require(!isAlreadyIssued[msg.sender][_id]);
        isAlreadyIssued[msg.sender][_id] = true;
        Book storage book = BookDatabase[_id];
        require(book.availableCopies-1 >= 0);
        book.availableCopies--;
        book.ownersHistory[book.ownerCount] = msg.sender;
        book.ownerCount++;
    }

    function returnBook(uint _id) external {
        require(isAlreadyIssued[msg.sender][_id]);
        Book storage book = BookDatabase[_id];
        book.availableCopies++;
        isAlreadyIssued[msg.sender][_id] = false;
    }

     function getAvailableBooks() external view returns (uint[] memory) {
        uint bookIndex = 0;
        for (uint index = 1; index <= bookCount; index++) {
            if (BookDatabase[index].availableCopies > 0) {
                bookIndex++;
            }
        }
        uint[] memory result = new uint[](bookIndex);
        bookIndex = 0;
        for (uint index = 1; index <= bookCount; index++) {
            if (BookDatabase[index].availableCopies > 0) {
                result[bookIndex] = index;
                bookIndex++;
            }
        }
        return result;
    }

     function getOwnerHistoryOfBook(uint _id)
        external
        view
        returns (address[] memory)
    {
        address[] memory result = new address[](BookDatabase[_id].ownerCount);
        for (uint index = 0; index < result.length; index++) {
            result[index] = BookDatabase[_id].ownersHistory[index];
        }
        return result;
    }


    function getBookDetail(uint256 _id)
        public
        view
        returns (string memory, uint256)
    {
        return (BookDatabase[_id].name, BookDatabase[_id].availableCopies);
    }
}
