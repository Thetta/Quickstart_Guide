pragma solidity ^0.4.24;

import "@thetta/core/contracts/DaoBase.sol";

import "./CakeOrderingOrganizaion.sol";
import "./CakeByer.sol";
import "./Bakery.sol";


contract Deployer {
	DaoBase public daoBase;
	Bakery public bakery;
	CakeOrderingOrganizaion public cakeOrderingOrganizaion;

	function deploy(DaoBase _daoBase, address _friend1, address _friend2, address _friend3) public{
		daoBase = _daoBase;
		bakery = new Bakery();
		cakeOrderingOrganizaion = new CakeOrderingOrganizaion(bakery, daoBase);
		setPermissions(_friend1, _friend2, _friend3);
	}

	function setPermissions(address _friend1, address _friend2, address _friend3) public {
		// Add some address (user or contract) to Friends group
		daoBase.addGroupMember("Friends", _friend1);
		daoBase.addGroupMember("Friends", _friend2);

		// This will allow any address that is a member of "Friends" group 
		// to execute "buySomeCake" method:
		daoBase.allowActionByAnyMemberOfGroup(cakeOrderingOrganizaion.BUY_SOME_CAKE(), "Friends");

		// To allow specific address to execute action without any voting:
		daoBase.allowActionByAddress(cakeOrderingOrganizaion.BUY_SOME_CAKE(), _friend3);
	}
}