# About
Full stack defi staking application for yield farming, borrowing and lending.
In this app we can:
* stakeTokens: add any approved token to the farming contract for yield farming, collateral.
* unStakeTokens: removes tokens from the contract
* getRecipientTotalValue: get the total value that users have supplied based on calculation from ChainLink price feed
## Prerequisites
* Nodejs
* npm
* python

## Installation
1. Install Brownie, if you haven't already. Here is a simple way to install brownie.
````bash
pip install --user pipx
pipx ensurepath
# restart your terminal
pipx install eth-brownie
````

2. Install Ganache-Cli
````bash
npm install -g ganache-cli
````

3. If you want to be able to deploy to testnets, do the following.
* Set your WEB3_INFURA_PROJECT_ID, and PRIVATE_KEY environment variables.
You can get a WEB3_INFURA_PROJECT_ID by getting a free trial of Infura. At the moment, it does need to be infura with brownie. You can find your PRIVATE_KEY from your ethereum wallet like metamask.
* You'll also need testnet rinkeby or Kovan ETH and LINK. You can get LINK and ETH into your wallet by using the rinkeby faucets located https://docs.chain.link/docs/link-token-contracts/#rinkeby.
You'll also want an Etherscan API Key to verify your smart contracts.
* You can add your environment variables to the .env file:
````
export WEB3_INFURA_PROJECT_ID=<PROJECT_ID>
export PRIVATE_KEY=<PRIVATE_KEY>
export ETHERSCAN_TOKEN=<YOUR_TOKEN>
````

## Usage
This will deploy the contracts, depoly some mock Chainlink contracts for you to interact with.
````
brownie run scripts/deploy.py
````

Deploy to the Kovan
````
brownie run scripts/deploy.py --network kovan
````
## Frontend
````
yarn install
yarn start
````
