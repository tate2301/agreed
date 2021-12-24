// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract AgreePlatform is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSent;
  Counters.Counter private _itemsSigned;

  address payable owner;

  uint listingPrice = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  function getListingPrice() public view returns (uint) {
    return listingPrice;
  }

  function getBlockTime() public view returns (uint) {
    return block.timestamp;
  }

  struct JobItem {
    uint256 itemId;
    address jobContract;
    uint256 tokenId;
    address payable sender;
    address payable owner;
    address payable receiver;
    bool sent;
    bool signedByOwner;
    uint256 dealineToSign;
    uint256 signingPrice;
  }

  mapping(uint256 => JobItem) private idToJobItem;

  event JobItemCreated(
    uint256 itemId,
    address jobContract,
    uint256 tokenId,
    address payable sender,
    address payable owner,
    address payable receiver,
    bool sent,
    bool signedByOwner,
    uint256 dealineToSign,
    uint256 signingPrice
  );

  function createJobItem(
    address jobContract,
    uint256 tokenId,
    uint256 deadlineToSign,
    uint256 signingPrice,
    address receiver
  ) public payable nonReentrant {
    require(deadlineToSign > block.timestamp, "Deadline must be in the future");
    require(signingPrice >= 1, "Signing price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");
    require(receiver != address(0), "Receiver must be set");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToJobItem[itemId] = JobItem({
      itemId: itemId,
      jobContract: jobContract,
      tokenId: tokenId,
      sender: payable(msg.sender),
      receiver: payable(receiver),
      owner: payable(address(0)),
      sent: true,
      signedByOwner: false,
      dealineToSign: deadlineToSign,
      signingPrice: signingPrice
    });

    // transfer to the platform to own the token
    IERC721(jobContract).transferFrom(msg.sender, address(this), tokenId);
    _itemsSent.increment();

    emit JobItemCreated(
      itemId,
      jobContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      payable(receiver),
      true,
      false,
      deadlineToSign,
      signingPrice
    );
  }

  function signToConfirmReceival(address jobContract, uint256 itemId)
    public
    payable
    nonReentrant
  {
    uint256 deadlineToSign = idToJobItem[itemId].dealineToSign;
    uint256 tokenId = idToJobItem[itemId].tokenId;
    uint256 signingPrice = idToJobItem[itemId].signingPrice;

    require(
      deadlineToSign > block.timestamp,
      "Deadline for signing has passed for this job"
    );
  
    require(msg.value == signingPrice, "Price must be equal to signing price");

    // transfer the amount to sender and job to owner
    idToJobItem[itemId].sender.transfer(msg.value);
    IERC721(jobContract).transferFrom(address(this), msg.sender, tokenId);
    idToJobItem[itemId].owner = payable(msg.sender);
    idToJobItem[itemId].signedByOwner = true;
    _itemsSigned.increment();

    // pay the sender of the job
    payable(owner).transfer(signingPrice);
  }

  function fetchUnsignedJobs() public view returns (JobItem[] memory) {
    uint256 itemCount = _itemsSent.current();
    uint256 unsignedItems = _itemsSigned.current() - _itemsSigned.current();
    uint256 currentIndex = 0;

    JobItem[] memory unsigned_items = new JobItem[](unsignedItems);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToJobItem[i + 1].signedByOwner == false) {
        uint256 currentId = idToJobItem[i + 1].itemId;
        JobItem storage currentItem = idToJobItem[currentId];
        unsigned_items[currentIndex] = currentItem;
        currentIndex++;
      }
    }

    return unsigned_items;
  }

  function fetchUnsentJobs() public view returns (JobItem[] memory) {
    uint256 itemCount = _itemsSent.current();
    uint256 unsentItemsCount = _itemsSent.current() - _itemsSent.current();
    uint256 currentIndex = 0;

    JobItem[] memory unsent_items = new JobItem[](unsentItemsCount);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToJobItem[i + 1].sent == false) {
        uint256 currentId = idToJobItem[i + 1].itemId;
        JobItem storage currentItem = idToJobItem[currentId];
        unsent_items[currentIndex] = currentItem;
        currentIndex++;
      }
    }
    return unsent_items;
  }

  function fetchMyOwnedJobs() public view returns (JobItem[] memory) {
    uint256 totalItemCount = _itemsSent.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToJobItem[i + 1].owner == address(msg.sender)) {
        itemCount++;
      }
    }

    JobItem[] memory myItems = new JobItem[](itemCount);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToJobItem[i + 1].owner == msg.sender) {
        uint256 currentId = idToJobItem[i + 1].itemId;
        JobItem storage currentItem = idToJobItem[currentId];
        myItems[currentIndex] = currentItem;
        currentIndex++;
      }
    }
    return myItems;
  }

  function fetchMyCreatedJobs() public view returns (JobItem[] memory) {
    uint256 totalItemCount = _itemsSent.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToJobItem[i + 1].sender == address(msg.sender)) {
        itemCount++;
      }
    }

    JobItem[] memory myItems = new JobItem[](itemCount);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToJobItem[i + 1].sender == msg.sender) {
        uint256 currentId = idToJobItem[i + 1].itemId;
        JobItem storage currentItem = idToJobItem[currentId];
        myItems[currentIndex] = currentItem;
        currentIndex++;
      }
    }
    return myItems;
  }

  function fetchMyPendingJobs() public view returns (JobItem[] memory) {
    uint256 totalItemCount = _itemsSent.current();
    uint256 itemCount = 0;
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToJobItem[i + 1].receiver == address(msg.sender)) {
        itemCount++;
      }
    }

    JobItem[] memory myItems = new JobItem[](itemCount);
    for (uint256 i = 0; i < itemCount; i++) {
      if (idToJobItem[i + 1].receiver == msg.sender) {
        if(idToJobItem[i + 1].signedByOwner == false) {
          uint256 currentId = idToJobItem[i + 1].itemId;
          JobItem storage currentItem = idToJobItem[currentId];
          myItems[currentIndex] = currentItem;
          currentIndex++;
        }
      }
    }
    return myItems;
  }
}
