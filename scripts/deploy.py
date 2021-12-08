from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, network, config
from web3 import Web3
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(front_end_update=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    tx = dapp_token.transfer(token_farm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account})
    tx.wait(1)

    # dapp_token, weth_token, fau_token/dai
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed")
    }

    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)
    if update_front_end:
        update_front_end()

    return token_farm, dapp_token  # by returning we can use this method in our test


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        add_token_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_token_tx.wait(1)

        # dict_of_allowed_tokens[token].address, bug?
        set_price_feed_tx = token_farm.setPriceFeedContract(token.address, dict_of_allowed_tokens[token].address,
                                                            {"from": account})
        set_price_feed_tx.wait(1)


def update_front_end():
    # send the build folder
    copy_folders_to_frontend("./build", "./frontend/src/chain-info")
    # sending the front end our config in JSON format
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated")


def copy_folders_to_frontend(source, destination):
    # if build folder exists in frontend -> delete it
    if os.path.exists(destination):
        shutil.rmtree(destination)
    shutil.copytree(source, destination)


def main():
    # when we deploy on kovan or rinkeby we will update our front_end, we wont update when we will deploy it on development
    deploy_token_farm_and_dapp_token(front_end_update=True)
