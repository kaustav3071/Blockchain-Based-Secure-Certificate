const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

let contract = null;
let provider = null;
let wallet = null;

const getContract = () => {
  if (contract) return contract;

  const contractDataPath = path.join(__dirname, "contractData.json");

  if (!fs.existsSync(contractDataPath)) {
    console.error("Contract data not found. Deploy the smart contract first.");
    return null;
  }

  const contractData = JSON.parse(fs.readFileSync(contractDataPath, "utf-8"));

  provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
  contract = new ethers.Contract(contractData.address, contractData.abi, wallet);

  console.log("Blockchain contract connected at:", contractData.address);
  return contract;
};

// Reset cached contract (call after redeployment)
const resetContract = () => {
  contract = null;
  provider = null;
  wallet = null;
};

const getProvider = () => {
  if (!provider) {
    provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  }
  return provider;
};

module.exports = { getContract, getProvider, resetContract };
