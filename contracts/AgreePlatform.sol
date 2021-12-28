// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract AgreePlatform is ReentrancyGuard, AccessControl {
  using Counters for Counters.Counter;

  // Initialize module counts. Depends on students
  Counters.Counter private _moduleIds;
  Counters.Counter private _modulesApproved;
  Counters.Counter private _modulesProposed;

  // Initialize degree counts. Depends on students
  Counters.Counter private _degreeIds;
  Counters.Counter private _degreesApproved;
  Counters.Counter private _degreesProposed;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  mapping(uint256 => StudentDegree) private idToDegree;
  mapping(uint256 => StudentModule) private idToModule;

  address payable private owner;

  uint private listingPrice = 0.000000000000000025 ether;

  constructor() {
    owner = payable(msg.sender);
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(MINTER_ROLE, msg.sender);
  }

  function getListingPrice() public view returns (uint) {
    return listingPrice;
  }

  struct StudentModule {
    uint256 itemId;
    uint256 tokenId;
    uint _score;
    address payable owner;
    address payable authority;
  }

  struct StudentDegree {
    uint256 itemId;
    uint256 tokenId;
    address payable owner;
    address payable authority;
    address payable receiver;
  }

  // module is minted and transferred from platform to student
  event StudentModuleApproved (
    uint256 indexed itemId,
    uint256 indexed tokenId,
    address indexed receiver
  );

  // Degree is minted and platform owns the degree 
  // On approval degree is transferred from platform to student address
  event StudentDegreeCreated (
    uint256 itemId,
    uint256 tokenId,
    address payable owner,
    address payable receiver
  );

  // Mint the degree and transfer ownership to platform
  function mintDegree(
    address degreeContractAddress,
    uint256 tokenId,
    address receiver
  ) public returns (StudentDegree memory) {
    StudentDegree memory degree = StudentDegree({
      itemId: _degreeIds.current(),
      tokenId: tokenId,
      owner: payable(0),
      authority: payable(msg.sender),
      receiver: payable(receiver)
    });

    idToDegree[_degreeIds.current()] = degree;

    // Transfer ownership to platform
    IERC721(degreeContractAddress).safeTransferFrom(msg.sender, address(this), tokenId);
    _degreesProposed.increment();
    _degreeIds.increment();

    emit StudentDegreeCreated(degree.itemId, degree.tokenId, degree.owner, degree.authority);
    return degree;

  }

  // Approve the degree by setting owner and transferring ownership to owner
  function approveDegree(
    address degreeContractAddress,
    uint itemId
  ) public returns (StudentDegree memory) {
    require(itemId >= 0, "TokenId must be a valid tokenId");
    
    StudentDegree memory degree = idToDegree[itemId];
    degree.owner = degree.receiver;

    // Transfer ownership to student
    IERC721(degreeContractAddress).safeTransferFrom(address(this), degree.receiver, degree.tokenId);
    _degreesApproved.increment();
    _degreeIds.increment();

    return degree;
  }


  // Mint the module and transfer ownership to student
  function mintAndApproveModule(
    address moduleContractAddress,
    address receiver,
    uint256 tokenId,
    uint _score
    ) public returns (StudentModule memory) {
    StudentModule memory module = StudentModule(
      _moduleIds.current(),
      tokenId,
      _score,
      payable(receiver),
      payable(msg.sender)
    );

    idToModule[_moduleIds.current()] = module;

    IERC721(moduleContractAddress).safeTransferFrom(payable(msg.sender), payable(receiver), module.tokenId);
    _moduleIds.increment();
    _modulesApproved.increment();

    emit StudentModuleApproved(
      module.itemId,
      module.tokenId,
      module.authority
    );

    return module;
  }

}
