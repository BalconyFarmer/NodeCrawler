const puppeteer = require('puppeteer');
var cheerio = require('cheerio')
var moment = require('moment')
const {initSequelize} = require("../app.js")
const {run1} = require('./sub/craw1')

const mode = true // true 循环模式 false 开发调试模式

async function run() {
    const browser = await puppeteer.launch({
        headless: mode, //这里我设置成false主要是为了让大家看到效果，设置为true就不会打开浏览器
        slowMo: 250, // slow down by 250ms
        // executablePath: '/usr/bin/chromium-browser', // 树莓派特供 https://chsamii.medium.com/puppeteer-on-raspbian-nodejs-3425ccea470e
        // args: ['--no-sandbox', '--disable-setuid-sandbox'] // 树莓派特供

    });

    try {
        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); // 不限制灯带时间

        await page.goto("https://www.cmfish.com/bbs/index.php");
        let content = await page.content();

        // 在线人数
        let $ = cheerio.load(content);
        let onlineNumber = $('.xs1').children().eq(0).text()
        // console.log(onlineNumber, "++++++++++++")

        // 2- ※ 学习专区 ※
        let styduArr = []
        const result1 = await run1(browser, content)
        // console.log(result1, "++++++++++++")

        result1.forEach(item => {
            styduArr.push(item)
        })

        if (result1.length > 0) {
            styduArr.forEach(item => {
                item.indexTime = moment(item.time).unix();
            })
            styduArr.sort(function (a, b) {
                return b.indexTime - a.indexTime
            });
            console.log(styduArr[0], "++++++++++++")

            let timeP = {
                time: styduArr[0].time
            }
            const resultP = await initSequelize.findCrawler(timeP)
            console.log("数据库查询结果", resultP.length)

            if (resultP.length <= 0) {
                const postData = {
                    contents: styduArr[0].title,
                    onlineNumber: onlineNumber,
                    time: styduArr[0].time,
                    href: styduArr[0].href,
                    type: styduArr[0].type,
                    indexTime: styduArr[0].indexTime,
                }
                const result = await initSequelize.saveCrawler(postData)
            }
        }


        if (mode) {
            await browser.close()
        }
    } catch (error) {
        console.log('错误信息：', error)
        if (mode) {
            await browser.close()
        }
    }
}

function startCrawler() {
    if (mode) {
        (async () => {
            let i = 1
            while (i > 0) {
                await run()
            }
        })()
    } else {
        (async () => {
            await run()
        })()
    }
}

module.exports = {startCrawler};






