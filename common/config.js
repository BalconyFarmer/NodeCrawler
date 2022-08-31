
const config = {
    // corsAdress: 'http://101.34.131.94:8082', // 跨域白名单:线上前端地址
    // corsAdress: 'http://localhost:8081',
    corsAdress: '*',

    sqlAdress: 'localhost', // 数据库地址
    // sqlAdress: '101.34.131.94',
    USERNAME: "root",
    PASSWORD: "password",
    DATABASE: 'db_behance',
    JWTSecret: "kekewewei"

}

module.exports = {config}
