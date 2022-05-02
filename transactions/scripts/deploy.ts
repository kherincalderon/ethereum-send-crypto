import { ethers } from "hardhat";

const deployTransaction = async () => {
  const Transactions = await ethers.getContractFactory("Transactions");
  const transaction = await Transactions.deploy();
  await transaction.deployed();

  console.log("Transaction deployed to:", transaction.address);
};

const deployLogin = async () => {
  const Login = await ethers.getContractFactory("Login");
  const login = await Login.deploy();
  await login.deployed();

  console.log("Login deployed to:", login.address);
};

const main = async () => {
  deployTransaction();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
