// require("dotenv").config({ path: "./config/dev.env" })
const units = require("ethereumjs-units")
const { getTransactions } = require("./network_info")

const getRB = async () => {
    const data = await getTransactions("txlist", process.env.RB_OPERATOR_ADDRESS)
    const successTX = data.filter (el => el.isError=== "0")
    const fromAddr = successTX.map(el => el.from)
    const fromAddrAll = [... new Set(fromAddr)] 
    return fromAddrAll
}

const getYourRB = async (address) => {
    const data = await getTransactions("txlist", process.env.RB_OPERATOR_ADDRESS)
    const successTX = data.filter (el => el.isError=== "0")
    const yrTransactions = successTX.filter(el => el.from === address)
    const txHashes = yrTransactions.map(el => el.hash)
    return txHashes
}

const getKEEP = async () => {
    let sum = 0
    const data = await getTransactions("tokentx", process.env.KEEP_STAKE_ADDRESS)
    data.forEach(el => { 
        el.to != process.env.KEEP_STAKE_ADDRESS ? sum -= parseInt(units.convert(el.value,"wei","eth"), 10) : sum += parseInt(units.convert(el.value,"wei","eth"), 10)
    })
    return(sum)
}

module.exports = { getRB, getYourRB, getKEEP }
