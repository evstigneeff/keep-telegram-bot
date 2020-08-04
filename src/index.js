// require("dotenv").config({ path: "./config/dev.env" })
const fs = require('fs')
const path = require('path')
const fileDir = path.join(__dirname, "../files")
const { getECDSA, getYourECDSA }  = require("./ecdsa")
const { getRB, getYourRB, getKEEP } = require("./rb")
const { getBalance } = require("./network_info")
const token = process.env.TELEGRAM_API

// Create bot
const { Telegraf } = require('telegraf')
const bot = new Telegraf(token)

// Create menu
bot.start((ctx) => ctx.reply("Welcome to Keep Network Telegram Bot! \n\nYou can select from available options:" +
    "\n/rb    To get some Random Beacon statistics \n/ecdsa    To get some ECDSA Statistics"))
bot.command("exit", (ctx) => ctx.reply("Welcome to Keep Network Telegram Bot! \n\nYou can select from available options:" +
    "\n/rb    To get some Random Beacon statistics \n/ecdsa    To get some ECDSA Statistics"))
bot.command("rb", (ctx) => ctx.reply("The options are as follows: \n\nRun rb 'your address' to get your ECDSA Node statistics \n OR" +
    "\n/rb_node_list    Cumulative list of Random Beacon Nodes\n/rb_node_number    Cumulative number of Random Beacon Nodes" +
    "\n/keep_stake    Amount of staked KEEP \n/exit    Return to main menu"))
bot.command("ecdsa", (ctx) => ctx.reply("The options are as follows: \n\nRun ecdsa 'your address' to get your ECDSA Node statistics \n OR" +
    "\n/ecdsa_node_list    Cumulative list of ECDSA Nodes \n/ecdsa_node_number    Cumulative number of ECDSA Nodes" +
    "\n/eth_bond    Amount of ETH available for bonding \n/exit    Return to main menu"))

// Get a number of Random Beacon Nodes 
bot.command("rb_node_number", async (ctx) => {
    const resp = await getRB()
    ctx.reply(resp.length)
})
// Get a number of ECDSA Nodes 
bot.command("ecdsa_node_number", async (ctx) => {
    const resp = await getECDSA()
    ctx.reply(resp.length)
})
// Get a list of Random Beacon Nodes 
bot.command("rb_node_list", async (ctx) => {
    const resp = await getRB()
    const writeStream = fs.createWriteStream(`${fileDir}/rb.csv`)
    writeStream.write("NODE \n")
    resp.forEach(el => {
        writeStream.write(el)
        writeStream.write("\n")
    })
    setTimeout(function () {
        ctx.replyWithDocument({ source: `${fileDir}/rb.csv` })
    }, 1000)
})
// Get a list of ECDSA Nodes 
bot.command("ecdsa_node_list", async (ctx) => {
    const resp = await getECDSA()
    const writeStream = fs.createWriteStream(`${fileDir}/ecdsa.csv`)
    writeStream.write("NODE \n")
    resp.forEach(el => {
        writeStream.write(el)
        writeStream.write("\n")
    })
    setTimeout(function () {
        ctx.replyWithDocument({ source: `${fileDir}/ecdsa.csv` })
    }, 1000)
})
// Get a list of transactions of your Random Beacon Node
bot.hears(/rb (.+)/i, async (ctx) => {
    const resp = await getYourRB(ctx.match[1])
    if (resp.length === 0) {
        ctx.reply("Transactions for this address not found")
    } else if (resp.length > 10) {
        const writeStream = fs.createWriteStream(`${fileDir}/rb_txs.csv`)
        writeStream.write("TRANSACTIONS \n")
        resp.forEach(el => {
            writeStream.write(`${process.env.ETHERSCAN_TESTNET_URL}/tx/${el}`)
            writeStream.write("\n")
        })
        ctx.reply("Too many transactions. See attached CSV file with a full list")
        ctx.replyWithDocument({ source: `${fileDir}/rb_txs.csv` })
    } else {
        resp.forEach(el => ctx.reply(`${process.env.ETHERSCAN_TESTNET_URL}/tx/${el}`))
    }  
})
// Get a list of transactions of your ECDSA Node 
bot.hears(/ecdsa (.+)/i, async (ctx) => {
    const resp = await getYourECDSA(ctx.match[1])
    if (resp.length === 0) {
        ctx.reply("Transactions for this address not found")
    } else if (resp.length > 10) {
        const docName = date.toISOString()
        const writeStream = fs.createWriteStream(`${fileDir}/ecdsa_txs.csv`)
        writeStream.write("TRANSACTIONS \n")
        resp.forEach(el => {
            writeStream.write(`${process.env.ETHERSCAN_TESTNET_URL}/tx/${el}`)
            writeStream.write("\n")
        })
        ctx.reply("Too many transactions. See attached CSV file with a full list")
        ctx.replyWithDocument({ source: `${fileDir}/ecdsa_txs.csv` })
    } else {
        resp.forEach(el => ctx.reply(`${process.env.ETHERSCAN_TESTNET_URL}/tx/${el}`))
    }  
})
// Get a total amount of ETH available for bonding 
bot.command("eth_bond", async (ctx) => {
    const resp = await getBalance()
    ctx.reply(`Total amount of funds available for bonding is ${resp} ETH`)
})
// Get a total amount of staked KEEP 
bot.command("keep_stake", async (ctx) => {
    const resp = await getKEEP()
    ctx.reply(`Total amount of staked funds is ${resp} KEEP`)
})

// Start bot
bot.launch()