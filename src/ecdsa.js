// require("dotenv").config({ path: "./config/dev.env" })
const { getTransactions } = require("./network_info")

const getECDSA = async () => {
    const data = await getTransactions("txlist", process.env.ECDSA_OPERATOR_ADDRESS)
    const successTX = data.filter (el => el.isError=== "0")
    const fromAddr = successTX.map(el => el.from)
    const fromAddrAll = [... new Set(fromAddr)]
    return fromAddrAll
}

const getYourECDSA = async (address) => {
    const data = await getTransactions("txlist", process.env.ECDSA_OPERATOR_ADDRESS)
    const successTX = data.filter (el => el.isError=== "0")
    const yrTransactions = successTX.filter(el => el.from === address)
    const txHashes = yrTransactions.map(el => el.hash)
    return txHashes
}

module.exports = { getECDSA, getYourECDSA }