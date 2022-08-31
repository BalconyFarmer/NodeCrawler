var cheerio = require('cheerio')

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
        }, delay * 1000);
    })
}

/**
 * 0 2 3 4 四个模块分别抓取
 * @param browser
 * @param content
 * @returns {Promise<*[]>}
 */
async function run1(browser, content) {
    let styduArr = []
    let $ = cheerio.load(content);
    // let see = $('.xs1').children().eq(0).text()

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
            let time = content2_1(".pti .authi em span").attr("title")
            let data = {
                time: time,
                href: 'https://www.cmfish.com/bbs/' + _a1('.fl_by a').attr('href'),
                title: lastContent,
                type: "学习专区"
            }
            styduArr.push(data)
        }
    })
    await timeout(20)
    return styduArr
}

module.exports = {run1};