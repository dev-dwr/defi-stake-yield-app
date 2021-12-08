import React, {useState} from "react"
import {Token} from "../Main"
import {Box, makeStyles} from "@material-ui/core"
import {TabContext, TabList, TabPanel} from "@material-ui/lab"
import {Tab} from "@material-ui/core"

import {WalletBalance} from "./WalletBalance";
import {StakeForm} from "./StakeForm";

interface WalletProps{
    supportedTokens: Array<Token>
}

const useStyles = makeStyles(theme => ({
    tabContent:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box:{
        borderRadius: "25px"
    },
}))

export const Wallet = ({supportedTokens}: WalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);

    const classes = useStyles()

    const handleChange = (e:React.ChangeEvent<{}>, newValue:string) =>{
        setSelectedTokenIndex(parseInt(newValue))
    }

    return(
        <Box>
            <h1>Your wallet!</h1>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return(
                                <Tab label={token.name} value={index.toString()} key={index}/>
                            )
                        })}

                    </TabList>
                    {supportedTokens.map((token, index) =>{
                        return(
                            <TabPanel value={index.toString()} key={index}>
                                <div className={classes.tabContent}>

                                    <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                                    <StakeForm token={supportedTokens[selectedTokenIndex]}/>
                                </div>
                            </TabPanel>
                        )
                    })}
                </TabContext>
            </Box>
        </Box>

    )
}