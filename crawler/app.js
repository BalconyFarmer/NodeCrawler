const puppeteer = require('puppeteer');
var cheerio = require('cheerio')
var moment = require('moment')
const {initSequelize} = require("../app.js")

const mode = true // true 循环模式 false 开发调试模式

// 延时器
let timeout = function (delay) {
    // console.log('延迟函数：', `延迟 ${delay} 毫秒`)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (error) {
                reject(error)
            }
        }, delay);
    })
}

async function run() {
    const browser = await puppeteer.launch({
        headless: true, //这里我设置成false主要是为了让大家看到效果，设置为true就不会打开浏览器
        slowMo: 200 // slow down by 250ms
    });

    try {
        let page = await browser.newPage();
        await page.goto("https://www.cmfish.com/bbs/index.php");
        let content = await page.content();

        // 1- 在线会员数据
        await timeout(500);
        let $ = cheerio.load(content);
        let see = $('.xs1').children().eq(0).text()
        console.log("在线会员数据:", see,)

        // 2- ※ 学习专区 ※
        let styduArr = []
        let a = $('.fl_tb').eq(0).html()
        let new22 = cheerio.load(a, {
            xmlMode: true,
            ignoreWhitespace: true,
            lowerCaseTags: true
        })
        new22('tr').each(async function (i, elem) {
            let _a1 = cheerio.load($(this).html(), {
                xmlMode: true,
                ignoreWhitespace: true,
                lowerCaseTags: true
            })

            // 打开新标签,获取最后评论时间和内容
            if (_a1('.fl_by a').attr('href')) {
                let page2 = await browser.newPage();
                await page2.goto('https://www.cmfish.com/bbs/' + _a1('.fl_by a').attr('href'));
                let content2 = await page2.content();
                await timeout(500);
                let $2 = cheerio.load(content2, {
                    xmlMode: false,
                    ignoreWhitespace: false,
                    lowerCaseTags: false
                });
                let allLength = $2("#postlist").children().length
                let html2 = $2("#postlist").children().eq(allLength - 2).html()
                let content2_1 = await cheerio.load(html2);
                content2_1(".t_f").text()
                content2_1(".t_f .quote").remove()
                let lastContent = content2_1(".t_f").text()
                let time = content2_1(".pti .authi span").attr("title")
                let data = {
                    time: time,
                    href: 'https://www.cmfish.com/bbs/' + _a1('.fl_by a').attr('href'),
                    title: lastContent,
                    type: "学习专区"
                }
                if (data.time && data.title) {
                    styduArr.push(data)
                    // console.log(111)
                }
            }
        })

        await timeout(5000);
        console.log(222)


        // console.log(styduArr, "++++++++++++++")


        // 2- ※ 海水生物讨论区※
        /*        let new33 = cheerio.load($('.fl_tb').eq(2).html(), {
                    xmlMode: true,
                    ignoreWhitespace: true,
                    lowerCaseTags: true
                })
                new33('tr').each(async function (i, elem) {
                    let _a1 = cheerio.load($(this).html(), {
                        xmlMode: true,
                        ignoreWhitespace: true,
                        lowerCaseTags: true
                    })
                    let data = {
                        time: _a1('cite span').attr('title'),
                        title: _a1('.fl_by a').text(),
                        type: "海水生物讨论区"

                    }
                    if (data.time && data.title) {
                        styduArr.push(data)
                    }
                })*/

        // 2- ※ 海缸展示及研讨区※
        /*        let new44 = cheerio.load($('.fl_tb').eq(3).html(), {
                    xmlMode: true,
                    ignoreWhitespace: true,
                    lowerCaseTags: true
                })
                new44('tr').each(async function (i, elem) {
                    let _a1 = cheerio.load($(this).html(), {
                        xmlMode: true,
                        ignoreWhitespace: true,
                        lowerCaseTags: true
                    })
                    let data = {
                        time: _a1('cite span').attr('title'),
                        title: _a1('.fl_by a').text(),
                        type: "海缸展示及研讨区"

                    }
                    if (data.time && data.title) {
                        styduArr.push(data)
                    }
                })*/

        // 2- ※ 器材讨论区※
        /*        let new55 = cheerio.load($('.fl_tb').eq(4).html(), {
                    xmlMode: true,
                    ignoreWhitespace: true,
                    lowerCaseTags: true
                })
                new55('tr').each(async function (i, elem) {
                    let _a1 = cheerio.load($(this).html(), {
                        xmlMode: true,
                        ignoreWhitespace: true,
                        lowerCaseTags: true
                    })
                    let data = {
                        time: _a1('cite span').attr('title'),
                        title: _a1('.fl_by a').text(),
                        type: "器材讨论区"

                    }
                    if (data.time && data.title) {
                        styduArr.push(data)
                    }
                })*/

        styduArr.forEach(item => {
            item.indexTime = moment(item.time).unix();
        })
        styduArr.sort(function (a, b) {
            return b.indexTime - a.indexTime
        });
        console.log(styduArr, "++++++++++++++")

        const postData = {
            contents: styduArr[0].title,
            onlineNumber: see,
            time: styduArr[0].time,
            href: styduArr[0].href
        }
        const result = await initSequelize.saveCrawler(postData)

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
                await timeout(2000);
            }
        })()
    } else {
        (async () => {
            await run()
        })()
    }
}

module.exports = {startCrawler};




