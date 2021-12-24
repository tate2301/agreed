// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from 'hardhat';

async function main() {
  const AgreePlatform = await ethers.getContractFactory('AgreePlatform');
  const agreePlatform = await AgreePlatform.deploy();

  await agreePlatform.deployed();
  console.log('AgreePlatform deployed to:', agreePlatform.address);

  const AgreeNFT = await ethers.getContractFactory('AGREE');
  const agreeNFT = await AgreeNFT.deploy(agreePlatform.address);

  await agreeNFT.deployed();
  console.log('AgreeNFT deployed to:', agreeNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
