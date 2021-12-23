// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AgreePlatform is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSent;

  address payable owner;

  uint256 listingPrice = 0.025 ether;

  constructor () {
    owner = payable(msg.sender);
  }

  struct JobItem {
    uint itemId;
    address jobContract;
    uint256 tokenId;
    address payable sender;
    address payable owner;
    bool sent;
    bool signedByOwner;
    uint256 dealineToSign;
    uint256 signingPrice;
  }

  mapping(uint256 => JobItem) private idToJobItem;

  event JobItemCreated (
    uint itemId,
    address jobContract,
    uint256 tokenId,
    address payable sender,
    address payable owner,
    bool sent,
    bool signedByOwner,
    uint256 dealineToSign,
    uint256 signingPrice
  );

  function createJobItem(
    address jobContract,
    uint256 tokenId,
    uint256 deadlineToSign,
    uint256 signingPrice
  ) public payable nonReentrant {
    require(deadlineToSign > block.timestamp, "Deadline must be in the future");
    require(signingPrice >= 1, "Signing price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToJobItem[itemId] = JobItem({
      itemId: itemId,
      jobContract: jobContract,
      tokenId: tokenId,
      sender: payable(msg.sender),
      owner: payable(address(0)),
      sent: true,
      signedByOwner: false,
      dealineToSign: deadlineToSign,
      signingPrice: signingPrice
    });

    // transfer to the platform to own the token
    IERC721(jobContract).transferFrom(msg.sender, address(this), tokenId);

    emit JobItemCreated(
      itemId,
      jobContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      true,
      false,
      deadlineToSign,
      signingPrice
    );
  }

  function signToConfirmReceival (address jobContract, uint256 itemId) public payable nonReentrant {
    uint256 deadlineToSign = idToJobItem[itemId].dealineToSign;
    uint tokenId = idToJobItem[itemId].tokenId;
    uint256 signingPrice = idToJobItem[itemId].signingPrice;

    require(block.timestamp > deadlineToSign, "Deadline for signing has passed for this job");
    require(msg.value == signingPrice, "Price must be equal to signing price");

    // transfer the amount to sender and job to owner
    idToJobItem[itemId].sender.transfer(msg.value);
    IERC721(jobContract).transferFrom(address(this), msg.sender, tokenId);
    idToJobItem[itemId].owner = payable(msg.sender);
    idToJobItem[itemId].signedByOwner = true;
    _itemsSent.increment();

    // pay the sender of the job
    payable(owner).transfer(signingPrice);

  }

}