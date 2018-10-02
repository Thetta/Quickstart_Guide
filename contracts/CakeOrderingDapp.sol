pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

import "@thetta/core/contracts/DaoClient.sol";
import "@thetta/core/contracts/DaoBase.sol";
import "@thetta/core/contracts/IDaoBase.sol";

contract Bakery {
	event cakeProduced();
	uint public cakesOrdered = 0;
	mapping (address=>bool) public isCakeProducedForAddress;

	function buySomeCake(address _cakeEater) public{
		emit cakeProduced();
		cakesOrdered = cakesOrdered + 1; // increase cakesOrdered var
		isCakeProducedForAddress[_cakeEater] = true;
	}
}

contract CakeOrderingDapp {
	constructor() {
	}

	function buySomeCakeInternal(Bakery _bakery) internal { 
		_bakery.buySomeCake(msg.sender);
	}
}

contract CakeOrderingOrganizaion is CakeOrderingDapp, DaoClient {
	bytes32 public constant BUY_SOME_CAKE = keccak256("buySomeCake");

	constructor(Bakery _bakery, DaoBase _daoBase) public DaoClient(_daoBase){
		bakery = _bakery;
	}

	function buySomeCake() public isCanDo(BUY_SOME_CAKE) { 
		buySomeCakeInternal(bakery);
	}

	function setPermissions(DaoBase _daoBase, address _boss, address _user) public {
		// Add some address (user or contract) to Employee group
		_daoBase.addGroupMember("Managers", _boss); 

		// This will allow any address that is a member of "Managers" group 
		// to execute "issueTokens" method:
		_daoBase.allowActionByAnyMemberOfGroup(BUY_SOME_CAKE, "Managers");
		        
		// To allow specific address to execute action without any voting:
		_daoBase.allowActionByAddress(BUY_SOME_CAKE, _user);
	}	
}
