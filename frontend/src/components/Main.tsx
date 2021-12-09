import {useEthers} from "@usedapp/core";
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import {constants} from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import dai from "../dai.png"
import eth from "../eth.png"
import {Wallet} from "./Wallet/Wallet"

import {makeStyles, Typography, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import React from "react";
import {TokenFarmContract} from "./TokenFarm/TokenFarmContract";


const useStyles = makeStyles(theme => ({
    title: {
        color: theme.palette.common.black,
        textAlign: "center",
        padding: theme.spacing(4)

    }
}))


export type Token = {
    image: string,
    address: string,
    name: string
}

export const Main = () => {
    // show token values from the wallet
    //get the address of different tokens
    //get the balance of the users wallet
    //send brownie-config to our src folder
    //send the build folder
    const classes = useStyles()

    const {chainId, error} = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"

    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    const [showNetworkError, setShowNetworkError] = React.useState(false)

    const handleCloseNetworkError = (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return
        }
        showNetworkError && setShowNetworkError(false)
    }
    React.useEffect(() => {
        if (error && error.name === "UnsupportedChainIdError") {
            !showNetworkError && setShowNetworkError(true)
        } else {
            showNetworkError && setShowNetworkError(false)
        }
    }, [error, showNetworkError])
    return (
        <>
            <Typography
                variant="h2"
                component="h1"
                classes={{
                    root: classes.title,
                }}
            >
                Dapp Token Farm
            </Typography>
            <Wallet supportedTokens={supportedTokens}/>
            <TokenFarmContract supportedTokens={supportedTokens}/>
            <Snackbar
                open={showNetworkError}
                autoHideDuration={5000}
                onClose={handleCloseNetworkError}
            >
                <Alert onClose={handleCloseNetworkError} severity="warning">
                    You gotta connect to the Kovan or Rinkeby network!
                </Alert>
            </Snackbar>
        </>
    )
}