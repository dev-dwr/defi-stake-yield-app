from brownie import accounts, network, config, MockV3Aggregator, MockDAI, MockWETH, Contract, MockV3Aggregator
import eth_utils

LOCAL_BLOCKCHAIN_ENV = ["development", "ganache", "mainnet-fork"]
INITIAL_PRICE_FEED_VALUE = 2000000000000000000000
DECIMALS = 18

contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": MockDAI,
    "weth_token": MockWETH,
}


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if network.show_active() in LOCAL_BLOCKCHAIN_ENV:
        return accounts[0]

    return accounts.add(config["wallets"]["from_key"])


def get_contract(contract_name):
    """
       This function will either:
           - Get an address from the config
           - Or deploy a Mock to use for a network that doesn't have the contract
       Args:
           contract_name (string): This is the name of the contract that we will get
           from the config or deploy
       Returns:
           brownie.network.contract.ProjectContract: This is the most recently deployed
           Contract of the type specified by a dictionary. This could either be a mock
           or a 'real' contract on a live network.
       """
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENV:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_PRICE_FEED_VALUE):
    """
        Use this script if you want to deploy mocks to a testnet
    """
    print(f"The active network is {network.show_active()}")
    print("Deploying mocks...")
    account = get_account()
    print("Deploying Mock Price Feed...")
    mock_price_feed = MockV3Aggregator.deploy(decimals, initial_value, {"from": account})
    print(f"Price feed deployed to {mock_price_feed.address}")
    print("Deploying Mock DAI...")
    mock_dai = MockDAI.deploy({"from": account})
    print(f"Deployed to {mock_dai.address}")
    print("Deploying Mock WETH...")
    mock_weth = MockWETH.deploy({"from": account})
    print(f"Deployed to {mock_weth.address}")
    print("All done!")
