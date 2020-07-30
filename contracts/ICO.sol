pragma solidity ^0.4.22;

/**
 * @title SafeMath
 * @dev Unsigned math operations with safety checks that revert on error modified
 */
 
library SafeMath {
    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint a, uint b) internal pure returns (uint) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }
 
        uint c = a * b;
        require(c / a == b);
 
        return c;
    }
 
    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint a, uint b) internal pure returns (uint) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
 
        return c;
    }
 
    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint a, uint b) internal pure returns (uint) {
        require(b <= a);
        uint c = a - b;
 
        return c;
    }
 
    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a);
 
        return c;
    }
 
    /**
     * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint a, uint b) internal pure returns (uint) {
        require(b != 0);
        return a % b;
    }
}

contract ICOList {
    address[] ICOS;
    
    function createICO(uint _goalAmount, uint _minAmount, uint _maxAmount, string _des) public {
        ICO ico = new ICO(msg.sender, _goalAmount, _minAmount, _maxAmount, _des);
        ICOS.push(ico);
    }
    
    function getICOPro(uint _index) public view returns (address) {
        require(_index>=0);
        require(_index<=ICOS.length-1);
        
        return ICOS[_index];
    }
    
    function getAllICOPros() public view returns(address[]) {
        return ICOS;
    }
}

contract ICO{
    
    using SafeMath for uint;
    
    struct Payment {
        string description;
        //address[] voters;
        mapping(address => bool) voters;
        uint voterCount;
        bool isComplete;
        uint amount;
        address receiver;
    }
    
    address public owner;
    uint public goalAmount;
    Payment[] public payments;
    // address[] public investers;
    mapping(address => uint) investers;
    uint investerCount;
    uint public minAmount;
    uint public maxAmount;
    string public description;
    
    constructor(address _owner, uint _goalAmount, uint _minAmount, uint _maxAmount, string _des) public {
        owner = _owner;
        goalAmount = _goalAmount;
        minAmount = _minAmount;
        maxAmount = _maxAmount;
        description = _des;
    }
    
    function invest() public payable {
        require(msg.value>=minAmount);
        require(msg.value<=maxAmount);
        //require(address(this).balance+msg.value<goalAmount);
        
        uint tempVal = 0;
        tempVal += address(this).balance.add(msg.value);
        require(tempVal<=goalAmount);
        
        investers[msg.sender] = msg.value;
        investerCount += 1;
    }
    
    function payment(string _des, address _receiver, uint _amount) public {
        require(msg.sender == owner);
        
        Payment memory tempPayment = Payment({
            description: _des,
            // voters: new address[](0),
            voterCount:0,
            isComplete: false,
            amount: _amount,
            receiver: _receiver
        });
        
        payments.push(tempPayment);
    }
    
    function votePayment(uint index) public {
        require(index>=0);
        require(index<=payments.length-1);
        // bool isValid = false;
        // bool isVoted = false;
        // for(uint i=0; i<investers.length; i++){
        //     if(investers[i]==msg.sender){
        //         isValid = true;
        //         break;
        //     }
        // }
        // require(isValid==true);
        
        require(investers[msg.sender]>0);
        
        // for(uint j=0; j<payments[index].voters.length; j++){
        //     if(payments[index].voters[j] == msg.sender){
        //         isValid = true;
        //         break;
        //     }
        // }
        // require(isVoted==false);
        // payments[index].voters.push(msg.sender);
        
        require(payments[index].voters[msg.sender]==false);
        payments[index].voters[msg.sender] = true;
        payments[index].voterCount += 1;
    }
    
    function payToReceiver(uint _index) public {
        require(msg.sender == owner);
        
        Payment storage tempPayment = payments[_index];
        
        require(address(this).balance >= tempPayment.amount);
        require(_index>=0);
        require(_index<=payments.length-1);
        require(tempPayment.isComplete==false);
        require(tempPayment.voterCount >= (investerCount/2));
        
        tempPayment.receiver.transfer(tempPayment.amount);
        tempPayment.isComplete = true;
    }
}