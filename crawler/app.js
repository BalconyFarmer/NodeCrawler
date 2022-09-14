const puppeteer = require('puppeteer');
var cheerio = require('cheerio')
var moment = require('moment')
const {initSequelize} = require("../app.js")
const {run1} = require('./sub/craw1')

const mode = true // true 循环模式 false 开发调试模式

async function run() {
    const browser = await puppeteer.launch({
        headless: mode, //这里我设置成false主要是为了让大家看到效果，设置为true就不会打开浏览器
        slowMo: 200, // slow down by 250ms
        // executablePath: '/usr/bin/chromium-browser', // 树莓派特供
        // args: ['--no-sandbox', '--disable-setuid-sandbox'] // 树莓派特供
    });

    try {
        let page = await browser.newPage();
        await page.goto("https://www.cmfish.com/bbs/index.php");
        let content = await page.content();

        // 在线人数
        let $ = cheerio.load(content);
        let onlineNumber = $('.xs1').children().eq(0).text()

        // 2- ※ 学习专区 ※
        let styduArr = []
        const result1 = await run1(browser, content)
        result1.forEach(item => {
            styduArr.push(item)
        })

        styduArr.forEach(item => {
            item.indexTime = moment(item.time).unix();
        })
        styduArr.sort(function (a, b) {
            return b.indexTime - a.indexTime
        });
        let timeP = {
            time: styduArr[0].time
        }
        const resultP = await initSequelize.findCrawler(timeP)
        console.log(styduArr[0], "++++++++++++")
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






