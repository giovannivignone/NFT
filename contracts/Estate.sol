pragma solidity ^0.5.0;
import "./ERC721Full.sol";

contract Estate is ERC721Full{
    uint256 public propertycounter;
    constructor () ERC721Full ("Property","ESTATES") public{
        propertycounter = 0;
    }
    function list_home(string memory tokenURI) public returns (uint256){
        uint256 House = propertycounter;
        _mint(msg.sender, House);
        _setTokenURI(House, tokenURI);
        propertycounter += 1;
        return House;
    }
}
