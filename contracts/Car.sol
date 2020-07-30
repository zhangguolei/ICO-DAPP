pragma solidity ^0.4.22;

contract Car {
    string public brand;
    
    constructor(string ibrand) public {
        brand = ibrand;
    }
    
    function getBrand() public view returns (string) {
        return brand;
    }
    
    function setBrand(string _brand) public {
        brand = _brand;
    }
    
}