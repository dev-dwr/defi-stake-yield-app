import { useContractCall, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"

export const useStakingBalance = (tokenAddress:string): BigNumber | undefined => {
    const {account, chainId} = useEthers()

    const {abi} = TokenFarm

    const tokenFarmContractAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero

    const tokenFarmInterface = new utils.Interface(abi)

    //Nullish coalescing operator(??)
    const [stakingBalance] = useContractCall({
        abi: tokenFarmInterface,
        address: tokenFarmContractAddress,
        method: "stakingBalance",
        args: [tokenAddress, account]
    }) ?? []

    return stakingBalance
}