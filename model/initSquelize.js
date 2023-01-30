const {Sequelize, Model, DataTypes} = require('sequelize')
const {config} = require('../common/config')

/**
 * 数据库操作类
 */
class initSquelize {
    constructor() {
        this.a = this.init()
    }

    async init() {
        // 链接数据库
        const sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
            host: config.sqlAdress,
            dialect: 'mysql',
            timezone: '+08:00', // 输入正确时间
            dialectOptions: {   // 输出正确时间
                charset: 'utf8mb4',
                dateStrings: true,
                typeCast: true
            },
        });

        try {
            await sequelize.authenticate();
            console.log('数据库连接成功');
        } catch (error) {
            console.error('数据库链接失败!!!!:', error);
            await sequelize.authenticate();

        }

        // 爬虫表
        this.CMFcrawler = sequelize.define('CMFcrawlers', {
            id: {
                type: DataTypes.INTEGER(),
                autoIncrement: true,
                primaryKey: true,
            },
            contents: DataTypes.STRING(),
            onlineNumber: DataTypes.INTEGER(),
            time: DataTypes.STRING(),
            href: DataTypes.STRING(),
            type: DataTypes.STRING(),
            indexTime: DataTypes.INTEGER(),
        }, {
            timestamps: false // 开启/关闭事件戳
        })

    }

    // 添加爬虫
    async saveCrawler(postData) {
        const result = await this.CMFcrawler.create({
            contents: postData.contents,
            onlineNumber: postData.onlineNumber,
            time: postData.time,
            href: postData.href,
            type: postData.type,
            indexTime: postData.indexTime,
        })
        return result
    }

    async findCrawler(postData) {
        const result = await this.CMFcrawler.findAll({
            where: {
                time: postData.time
            }
        })
        return result
    }


}

module.exports = {initSquelize}

