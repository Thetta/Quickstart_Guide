pragma solidity ^0.4.24;
import "./Bakery.sol";


contract CakeByer {
	function buySomeCakeInternal(Bakery _bakery) internal { 
		_bakery.buySomeCake(msg.sender);
	}
}