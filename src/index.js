// require("dotenv").config({ path: "./config/dev.env" })
const fs = require('fs')
const path = require('path')
const fileDir = path.join(__dirname, "../files")
const { getECDSA, getYourECDSA, getYourETH } = require("./ecdsa")
const { getRB, getYourRB, getStake, getSlash } = require("./rb")
const { getBalance } = require("./network_info")
// const token = process.env.TELEGRAM_API

// Create bot
const { Composer } = require("micro-bot")
const bot = new Composer
// const { Telegraf } = require('telegraf')
// const bot = new Telegraf(token)

// Create menu
bot.start((ctx) => ctx.reply("Welcome to Keep Network Telegram Bot! \n\nYou can select from available options:" +
    "\n/rb    To get some Random Beacon statistics \n/ecdsa    To get some ECDSA Statistics"))
bot.command("exit", (ctx) => ctx.reply("Welcome to Keep Network Telegram Bot! \n\nYou can select from available options:" +
    "\n/rb    To get some Random Beacon statistics \n/ecdsa    To get some ECDSA Statistics"))
bot.command("rb", (ctx) => ctx.reply("The options are as follows: \n\nRun rb 'your address' to get your ECDSA Node statistics \n OR" +
    "\n/rb_node_number    Cumulative number of Random Beacon Nodes" +
    // "\n/rb_node_number    Cumulative number of Random Beacon Nodes \n/rb_node_list    Full list of Random Beacon Nodes" +
    "\n\n/keep_stake    Total number of staked KEEP \n/keep_slash    Total number of slashed KEEP \n\n/exit    Return to main menu \n\nMORE OPTIONS TO COME!"))
bot.command("ecdsa", (ctx) => ctx.reply("The options are as follows: \n\nRun ecdsa 'your address' to get your ECDSA Node statistics \n OR" +
    "\n/ecdsa_node_number    Cumulative number of ECDSA Nodes" +
    // "\n/ecdsa_node_number    Cumulative number of ECDSA Nodes \n/ecdsa_node_list    Full list of ECDSA Nodes" +
    "\n\nRun eth 'your address' to get contribution of your node to ETH bonding pool\n OR \n/eth_bond    Total number of ETH available for bonding " + 
    "\n\n/exit    Return to main menu \n\nMORE OPTIONS TO COME!"))

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
// // Get a list of Random Beacon Nodes 
// bot.command("rb_node_list", async (ctx) => {
//     const resp = await getRB()
//     if (resp.length === 0) {
//         ctx.reply("No Random Beacon Nodes found")
//     } else {
//         const str = resp.join("\n")
//         fs.writeFile(`${fileDir}/rb.csv`, str, (err) => {
//             if (err) throw err
//         })
//     }
//     ctx.replyWithDocument({ source: `${fileDir}/rb.csv` })
// })
// // Get a list of ECDSA Nodes 
// bot.command("ecdsa_node_list", async (ctx) => {
//     const resp = await getECDSA()
//     if (resp.length === 0) {
//         ctx.reply("No ECDSA Nodes found")
//     } else {
//         const str = resp.join("\n")
//         fs.writeFile(`${fileDir}/ecdsa.csv`, str, (err) => {
//             if (err) throw err
//         })
//     }
//     ctx.replyWithDocument({ source: `${fileDir}/ecdsa.csv` })
// })
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
// Get amount of ETH yr node contributed to bonding pool
bot.hears(/eth (.+)/i, async (ctx) => {
    const resp = await getYourETH(ctx.match[1])
    ctx.reply(`${ctx.match[1]} contributed ${resp} ETH for bonding`)
})
// Get a total amount of staked KEEP 
bot.command("keep_stake", async (ctx) => {
    const resp = await getStake()
    ctx.reply(`Total amount of staked funds is ${resp} KEEP`)
})
// Get a total amount of slashed KEEP 
bot.command("keep_slash", async (ctx) => {
    const resp = await getSlash()
    ctx.reply(`Total amount of slashed funds is ${resp} KEEP`)
})

// Start bot
module.exports = bot
// bot.launch()