pragma solidity ^0.4.24;

import "@thetta/core/contracts/DaoBase.sol";

import "./CakeOrderingOrganizaion.sol";
import "./CakeByer.sol";
import "./Bakery.sol";


contract Deployer {
	DaoBase public daoBase;
	Bakery public bakery;
	CakeOrderingOrganizaion public cakeOrderingDAO;

	function deploy(DaoBase _daoBase, address _boss, address _user2, address _user3){
		daoBase = _daoBase;
		bakery = new Bakery();
		cakeOrderingDAO = new CakeOrderingOrganizaion(bakery, daoBase);
		// set permissions
		daoBase.allowActionByAddress(daoBase.MANAGE_GROUPS(), cakeOrderingDAO);
		cakeOrderingDAO.setPermissions(_boss, _user3);
		daoBase.allowActionByAddress(daoBase.ISSUE_TOKENS(), cakeOrderingDAO);
		daoBase.allowActionByAddress(cakeOrderingDAO.BUY_SOME_CAKE(), _boss);
		daoBase.allowActionByAddress(cakeOrderingDAO.BUY_SOME_CAKE(), _user2);
		daoBase.allowActionByAddress(daoBase.ISSUE_TOKENS(), cakeOrderingDAO);
	}
}