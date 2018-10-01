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
		x = 1; // write 1 to x
		_daoBase.issueTokens(_tokenAddress, msg.sender, 100); // issue 100 ERC20 tokens for caller
	}
}

contract CakeOrderingOrganizaion is CakeOrderingDapp, DaoClient {
	address public tokenAddress;
	bytes32 public constant BUY_SOME_CAKE = keccak256("buySomeCake");

	constructor(IDaoBase _daoBase, address _tokenAddress) public DaoClient(_daoBase){
		tokenAddress = _tokenAddress;
	}

	function buySomeCake() public isCanDo(BUY_SOME_CAKE) { 
		buySomeCakeInternal(daoBase, tokenAddress);
	}
}
