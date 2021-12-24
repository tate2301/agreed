import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

describe('AgreePlatform', function () {
  it('Should create and send job NFT', async () => {
    const Market = await ethers.getContractFactory('AgreePlatform');
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const AGREENFT = await ethers.getContractFactory('AGREE');
    const agreeNFT = await AGREENFT.deploy(marketAddress);
    await agreeNFT.deployed();
    const agreeNFTAddress = agreeNFT.address;

    let listingPrice: BigNumber | string = await market.getListingPrice();
    listingPrice = listingPrice.toString();
    const signingPrice = ethers.utils.parseUnits('0.01', 'ether');
    const dealineToSign = (
      (new Date().getTime() + 1000 * 60 * 60 * 24 * 7) /
      1000
    ).toFixed(0);

    await agreeNFT.createToken('https://example.com/aaa');
    const [_, receiverAddress] = await ethers.getSigners();

    await market.createJobItem(
      agreeNFTAddress,
      1,
      parseInt(dealineToSign),
      signingPrice,
      await receiverAddress.getAddress(),
      {
        value: listingPrice,
      }
    );

    await market
      .connect(receiverAddress)
      .signToConfirmReceival(agreeNFTAddress, 1, { value: signingPrice });

    const sentItems = await market.fetchMyCreatedJobs();
    expect(sentItems.length).to.equal(1);
  });
});
