import React, { useContext, useEffect, useState } from "react";

import { ExternalProvider } from "@ethersproject/providers";
import { walletContext } from "react-open-wallet";
import { ethers } from "ethers";

import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { abi } from "../../../../transactions/artifacts/contracts/Transactions.sol/Transactions.json";

import "./index.css";

interface Transaction {
  gif: string;
  from: string;
  amount: number;
  keyword: string;
  message: string;
  receiver: string;
  timestamp: number;
  date: string;
}

interface Contract {
  contract: ethers.Contract;
  signer: ethers.providers.JsonRpcSigner;
}

interface FormData {
  address: string;
  amount: number;
  message: string;
  keyword: string;
}

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    address: "",
    amount: 1,
    message: "",
    keyword: "",
  });

  const { account, getAccount } = useContext(walletContext);

  const [contract, setContract] = useState<Contract | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // AGREGAR DATOS
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = ev.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ENVIAR TRANSACCION
  const onSubmit = async (ev: React.FormEvent) => {
    // OBTENER CONTRATO
    ev.preventDefault();

    if (contract !== null) {
      const parsedAmount = ethers.utils.parseEther(formData.amount.toString());

      // ENVIAR A ETH
      await contract.signer.sendTransaction({
        from: account,
        to: formData.address,
        value: parsedAmount._hex,
        gasPrice: "0x5208",
      });

      // EJECUTAR SMART CONTRACT
      const addToBlockchain = await contract.contract.addToBlockchain(
        formData.address,
        parsedAmount,
        formData.message,
        formData.keyword
      );

      await addToBlockchain.wait();

      // ACTUALIZAR LISTA
      getTransactions();
    }
  };

  const getTransactions = async () => {
    // EJECUTAR SMART CONTRACT
    const transactions: Transaction[] =
      await contract?.contract.getTransactions();

    const getTransactions = transactions.map(async (transaction) => {
      try {
        return {
          // @ts-ignore
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
          from: transaction.from,
          keyword: transaction.keyword,
          message: transaction.message,
          receiver: transaction.receiver,
          // @ts-ignore
          timestamp: transaction.timestamp.toNumber(),
          date: new Date(
            // @ts-ignore
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString("en-GB"),
          gif:
            (
              await (
                await fetch(
                  `https://api.giphy.com/v1/gifs/search?api_key=yYNe0J7Ch3qptjuvJKtO0FACjoN103Rj&q=${transaction.keyword}`
                )
              ).json()
            ).data[0]?.images?.downsized?.url ??
            "https://media.giphy.com/media/H7wajFPnZGdRWaQeu0/giphy.gif",
        };
      } catch (err) {
        console.log(err);
      }
    });

    // RESOLVER
    const resolvedTransactions = await Promise.all(getTransactions);
    if (resolvedTransactions) {
      setTransactions(resolvedTransactions.filter(Boolean) as Transaction[]);
    }
  };

  useEffect(() => {
    // SIGNER GLOBAL
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as ExternalProvider
    );
    const signer = provider.getSigner();

    // OBTENER CONTRATO
    const transactionContract = new ethers.Contract(
      "0x8Bf3E05482FfD63f485C1DDE41BA3cd0be101107",
      abi,
      signer
    );

    setContract({ contract: transactionContract, signer });
  }, []);

  useEffect(() => {
    if (contract !== null && account?.length) {
      getTransactions();
    }
  }, [contract, account]);

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <div className="flex w-full justify-center items-center">
          <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
            <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
              <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
                Send Crypto <br /> Across The World
              </h1>
              <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                Explore the crypto world. Buy and sell cryptocurrencies easily
                on Krypto.
              </p>

              {account.length == 0 && (
                <button
                  type="button"
                  onClick={getAccount}
                  className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
                >
                  <p className="text-white text-base font-semibold">
                    Connect Wallet
                  </p>
                </button>
              )}

              <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
                  Reliability
                </div>
                <div className={companyCommonStyles}>Security</div>
                <div className={`sm:rounded-tr-2xl ${companyCommonStyles}`}>
                  Ethereum
                </div>
                <div className={`sm:rounded-bl-2xl ${companyCommonStyles}`}>
                  Web 3.0
                </div>
                <div className={companyCommonStyles}>Low Fees</div>
                <div className={`rounded-br-2xl ${companyCommonStyles}`}>
                  Blockchain
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
              <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
                <div className="flex justify-between flex-col w-full h-full">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                      <SiEthereum fontSize={21} color="#fff" />
                    </div>
                    <BsInfoCircle fontSize={17} color="#fff" />
                  </div>
                  <div>
                    <p className="text-white font-light text-sm">
                      {account.substring(0, 8)}...
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">
                      Ethereum
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  value={formData.address}
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  step={0.01}
                  name="amount"
                  id="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="message"
                  id="message"
                  placeholder="Message"
                  value={formData.message}
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="keyword"
                  id="keyword"
                  value={formData.keyword}
                  placeholder="Keyword"
                  className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
                  onChange={handleChange}
                />
                <div className="h-[1px] w-full bg-gray-400 my-2" />
                <button
                  type="button"
                  onClick={onSubmit}
                  className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                >
                  Send now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
        <div className="flex flex-col md:p-12 py-12 px-4">
          {account ? (
            <h3 className="text-white text-3xl text-center my-2">
              Latest Transactions
            </h3>
          ) : (
            <h3 className="text-white text-3xl text-center my-2">
              Connect your account to see the latest transactions
            </h3>
          )}

          <div className="flex flex-wrap justify-center items-center mt-10">
            {transactions
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((transaction, i) => (
                <div
                  className="bg-[#181918] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-md hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center w-full mt-3">
                    <div className="display-flex justify-start w-full mb-6 p-2">
                      <a
                        href={`https://ropsten.etherscan.io/address/${transaction.from}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <p className="text-white text-base">
                          From: {transaction.from.substring(0, 8)}...
                        </p>
                      </a>
                      <a
                        href={`https://ropsten.etherscan.io/address/${transaction.receiver}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <p className="text-white text-base">
                          To: {transaction.receiver.substring(0, 8)}...
                        </p>
                      </a>
                      <p className="text-white text-base">
                        Amount: {transaction.amount} ETH
                      </p>
                      {transaction.message && (
                        <>
                          <br />
                          <p className="text-white text-base">
                            Message: {transaction.message}
                          </p>
                          <p className="text-white text-base">
                            Keyword: {transaction.keyword}
                          </p>
                        </>
                      )}
                    </div>
                    <img
                      src={transaction.gif}
                      alt="nature"
                      className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
                    />
                    <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                      <p className="text-[#37c7da] font-bold">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface window {
    ethereum: unknown;
  }
}

export default App;
