pragma solidity ^0.4.22;
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract CakeOrderingDapp is Ownable {
	MintableToken public cakeToken;
	uint public x = 0;

	constructor() {
		cakeToken = new MintableToken();
	}

   function buySomeCake() public onlyOwner { 
		// Писать 1 в переменную X
		x = 1;

		// Начислять 100 ERC20 токенов вызывающему
		cakeToken.mint(msg.sender, 100);
	}
}
