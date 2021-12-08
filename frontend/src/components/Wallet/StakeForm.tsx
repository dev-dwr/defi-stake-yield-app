import React from "react"
import {Token} from "../Main"
import {useEthers, useNotifications, useTokenBalance} from "@usedapp/core";
import {formatUnits} from "@ethersproject/units"
import {Button, Input, CircularProgress, Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import {useStakeTokens} from "../../hooks/useStakeTokens"
import {utils} from "ethers"

interface StakeFormProps{
    token: Token
}
export const StakeForm = ({token}:StakeFormProps) => {

    const {address: tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)

    const formattedTokenBalance:number = tokenBalance ? parseFloat(formatUnits(tokenBalance,18)): 0
    const {notifications} = useNotifications()

    const [amount, setAmount] = React.useState<number | string | Array<number|string>>(0);

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = e.target.value === "" ? "" : Number(e.target.value)
        setAmount(newAmount)
    }

    const {approveAndStake, state: approveAndStakeErc20State} = useStakeTokens(tokenAddress)

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeErc20State.status === "Mining"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = React.useState(false)
    const [showStakeTokenSuccess, setShowStakeTokenSuccess] = React.useState(false)

    //if any of the notifications changes we want to  execute code below
    React.useEffect(() => {
        if(notifications.filter(
            notification =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length >0){
            console.log("Approved")
            setShowErc20ApprovalSuccess(true)
            setShowStakeTokenSuccess(false)
        }

        if(notifications.filter(
            notification =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake Tokens").length > 0){
            console.log("Token staked")
            setShowStakeTokenSuccess(true)
            setShowErc20ApprovalSuccess(false)
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess])

    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)
    }
    return(
        <>
            <div>
            <Input
            onChange = {handleInputChange}
            />
            <Button onClick={handleStakeSubmit} color="primary" size="large"
            disabled  = {isMining}
            >{isMining ? <CircularProgress size={26}/> : "Stake!!"}</Button>
            </div>
            <Snackbar
                open ={showErc20ApprovalSuccess}
                autoHideDuration={500}
                onClose={handleCloseSnack}
            >
            <Alert onClose={handleCloseSnack} severity = "success">ERC-2o token transfer approved! Now approve the second transaction</Alert>
            </Snackbar>

            <Snackbar
                open ={showStakeTokenSuccess}
                autoHideDuration={500}
                onClose={handleCloseSnack}
            >
            <Alert onClose={handleCloseSnack} severity = "success">Token Staked</Alert>
            </Snackbar>
            </>
    )
}