import React from "react"
import {Token} from "../Main"
import {useEthers, useTokenBalance} from "@usedapp/core";
import {formatUnits} from "@ethersproject/units"
import {BalanceMsg} from "./BalanceMsg";

interface WalletBalanceProps{
    token: Token
}

export const WalletBalance = ({token}: WalletBalanceProps) => {
    const {image, address, name} = token

    const {account} = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    return(
        <BalanceMsg
            amount = {formattedTokenBalance}
            label = {`Your un-stake ${name} balance`}
            tokenImgSrc = {image}
        />
    )
}
