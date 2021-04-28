pragma solidity ^0.6.0;
import "./Files/openzeppelin-solidity-master/contracts/token/ERC721/ERC721.sol";

contract EstateContract is ERC721{
    uint256 public propertycounter;
    constructor () ERC721Full ("Property","ESTATES") public{
        propertycounter = 0;
    }
    function list_home(string memory tokenURI) public returns (uint256){
        uint256 House = propertycounter;
        _safeMint(msg.sender, House);
        _setTokenURI(House, tokenURI);
        propertycounter += 1;
        return House;
    }
}
