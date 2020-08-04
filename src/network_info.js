// require("dotenv").config({ path: "./config/dev.env" })
const axios = require("axios")
const units = require("ethereumjs-units")
const url = process.env.ETHERSCAN_TESTNET_API_URL
const api = process.env.ETHERSCAN_API

// Function to get transactions
const getTransactions = async (action, address) => {
    try {
        const txList1 = await axios(`${url}?module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${api}`)

        if (!txList1.data.result[9999]) {

            return txList1.data.result
        } else {
            const middleBlock = txList1.data.result[9999].blockNumber
            const txList2 = await axios(`${url}?module=account&action=${action}&address=${address}&startblock=${middleBlock}&endblock=99999999&sort=asc&apikey=${api}`)

            return [...txList1.data.result, ...txList2.data.result]
        }
    } catch (err) {
        console.log(err)
    }
}

// Function to get balance
const getBalance = async () => {
    try {
        const balanceRaw = await axios(`${url}?module=account&action=balance&address=${process.env.ETH_BOND_ADDRESS}&tag=latest&apikey=${api}`)
        const balance = units.convert(balanceRaw.data.result,"wei","eth")
        return balance
    } catch (err) {
        console.log(err)
    }
}

module.exports = { getTransactions, getBalance }