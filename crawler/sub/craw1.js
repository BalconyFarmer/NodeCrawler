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

    let indexArr = [
        0,
        // 2,
        // 3,
        // 4
    ]
    let item = 0
    // indexArr.forEach(item => {
    let type = ""
    switch (item) {
        case 0:
            type = "0※ 学习专区 ※"
            break
        case 2:
            type = "2※ 海水生物讨论区※"
            break
        case 3:
            type = "3※ 海缸展示及研讨区※"
            break
        case 4:
            type = "4※ 器材讨论区※"
            break
    }
    let a = $('.fl_tb').eq(item).html()
    let new22 = cheerio.load(a, {
        xmlMode: true,
        ignoreWhitespace: true,
        lowerCaseTags: true
    })

    let _arr = []
    new22('tr').each(async function (i, elem) {
        let _a1 = cheerio.load($(this).html(), {
            xmlMode: true,
            ignoreWhitespace: true,
            lowerCaseTags: true
        })
        _arr.push(_a1)
    })

    for (let i = 0; i < _arr.length; i++) {
        // 打开新标签,获取最后评论时间和内容
        if (_arr[i]('.fl_by a').attr('href')) {
            let page2 = await browser.newPage();
            await page2.setDefaultNavigationTimeout(0); // 不限制灯带时间
            await page2.goto('https://www.cmfish.com/bbs/' + _arr[i]('.fl_by a').attr('href'));
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
                time: time || 0,
                href: 'https://www.cmfish.com/bbs/' + _arr[i]('.fl_by a').attr('href'),
                title: lastContent,
                type: type
            }
            styduArr.push(data)
            // console.log(data, "data")
        }

    }

    return styduArr
}

module.exports = {run1};
