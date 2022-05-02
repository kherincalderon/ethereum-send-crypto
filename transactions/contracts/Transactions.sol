// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCounter;

    event Transfer(
        address from,
        address receiver,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    struct Transaction {
        address from;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    Transaction[] transactions;

    // EMITIR TRANSACCION
    function addToBlockchain(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        transactionCounter += 1;
        transactions.push(
            Transaction(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );
        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }

    // OBTENER EL CONTADOR
    function getTransactionCounter() public view returns (uint256) {
        return transactionCounter;
    }

    // OBTENER TODAS LAS TRANSACCION
    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}
