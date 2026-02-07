const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const contract = await CertificateRegistry.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CertificateRegistry deployed to:", address);

  // Save contract address and ABI for backend use
  const artifactPath = path.join(__dirname, "..", "..", "backend", "config", "contractData.json");
  const artifact = require(path.join(__dirname, "..", "artifacts", "contracts", "CertificateRegistry.sol", "CertificateRegistry.json"));

  const contractData = {
    address: address,
    abi: artifact.abi,
  };

  fs.mkdirSync(path.dirname(artifactPath), { recursive: true });
  fs.writeFileSync(artifactPath, JSON.stringify(contractData, null, 2));
  console.log("Contract data saved to backend/config/contractData.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
