//stakeTokens
//unStakeTokens
//issueTokens
//addAllowedTokens
//getEthValue
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


//100ETH 1:1 for very 1ETH we give 1 DappToken
// 50 ETH and 50 DAI staked, and we want to give a reward of 1 Dapp per 1 dai
contract TokenFarm is Ownable{

    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    address[] public allowedTokens;
    address[] public stakers;
    mapping(address => uint256) public uniqueTokenStaked; //how many tokens each address have
    IERC20 public dappToken;
    mapping(address => address) public tokenPriceFeedMapping;

    constructor(address _dappTokenAddress) public{
        dappToken = IERC20(_dappTokenAddress);
    }

    //set price feed associated with token
    function setPriceFeedContract(address _token, address _priceFeed) public onlyOwner{
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner{
        for(uint256 stakersIndex=0; stakersIndex < stakers.length; stakersIndex++){
            //send recipient token reward
            //based on their total value locked
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getRecipientTotalValue(recipient);
            dappToken.transfer(recipient, userTotalValue);

        }
    }
    function getRecipientTotalValue(address _recipient) public view returns(uint256){
        uint256 totalValue = 0;
        require(uniqueTokenStaked[_recipient] > 0, "No tokens staked!");
        for(uint256 allowedTokensIndex = 0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++){
            totalValue = totalValue + getRecipientSingleTokenValue(_recipient, allowedTokens[allowedTokensIndex]);
        }
        return totalValue;
    }

    function getRecipientSingleTokenValue(address _recipient, address _token) public view returns(uint256){
        // 1 ETH -> 2000 USD this will return 2000
        // 200 DAI -> 200 USD it will return 200
        if(uniqueTokenStaked[_recipient] <=0){
            return 0;
        }
        //price of token * staking balance[token][user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        //10 000_000_000_000_000_000 ETH
        //ETH/USD -> 10000000000
        //10 * 100 = 1000
        return (stakingBalance[_token][_recipient] *price / 10**decimals);
    }
    function getTokenValue(address _token) public view returns(uint256, uint256){
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
        (, int256 price,,,) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());

        return (uint256(price), uint256(decimals));
    }

    function unStakeTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0 , "Staking balance cannot be 0");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokenStaked[msg.sender] = uniqueTokenStaked[msg.sender] -1;

    }

    function stakeTokens(uint256 _amount, address _token) public{
        require(_amount > 0, "Amount must be greater than 0");
        require(isTokenAllowed(_token), "Token is not allowed");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token); //how many unique tokens user has
        stakingBalance[_token][msg.sender] = stakingBalance[_token][msg.sender] + _amount;
        if(uniqueTokenStaked[msg.sender] == 1 ){
            stakers.push(msg.sender);
        }
    }

    //only this contract can call this function
    function updateUniqueTokensStaked(address _user, address _token) internal{
        if(stakingBalance[_token][_user] <= 0){
            uniqueTokenStaked[_user] = uniqueTokenStaked[_user] +1;
        }
    }

    function addAllowedTokens(address _token) public onlyOwner{
        allowedTokens.push(_token);
    }
    function isTokenAllowed(address _token) public returns(bool){
        for(uint256 allowedTokensIndex=0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++){
            if(allowedTokens[allowedTokensIndex] == _token){
                return true;
            }
        }
        return false;
    }
}