// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AGRMODULE is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  
  // address of the agree platform
  address contractAddress;

  constructor(address platformAddress) ERC721("AGRMODULE", "AGRM") {
    contractAddress = platformAddress;
  }

  function createToken(string memory tokenURI) public returns (uint) {
    _tokenIds.increment();
      uint256 tokenId = _tokenIds.current();
    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);

    // gives platform approval to transact this token between users
    setApprovalForAll(contractAddress, true);

    return tokenId;
  }
}
