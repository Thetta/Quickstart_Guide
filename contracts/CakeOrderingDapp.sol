pragma solidity ^0.4.22;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

import "@thetta/core/contracts/DaoClient.sol";
import "@thetta/core/contracts/DaoBase.sol";

contract CakeOrderingDapp {
	uint public x = 0;

	constructor() {
	}

   function buySomeCakeInternal(IDaoBase _daoBase, address _tokenAddress) internal { 
		// Писать 1 в переменную X
		x = 1;

		// Начислять 100 ERC20 токенов вызывающему
		_daoBase.issueTokens(_tokenAddress, msg.sender, 100);
	}
}

contract CakeOrderingOrganizaion is CakeOrderingDapp, DaoClient {
	address tokenAddress;
	bytes32 public constant BUY_SOME_CAKE = keccak256("buySomeCake");

	constructor(IDaoBase _daoBase, address _tokenAddress) public DaoClient(_daoBase){
		tokenAddress = _tokenAddress;
	}

   function buySomeCake() public isCanDo(BUY_SOME_CAKE) { 
		buySomeCakeInternal(daoBase, tokenAddress);
	}
}
