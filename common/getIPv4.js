const os = require("os");
//获取本机ip

function getIpAddress() {
    /**os.networkInterfaces() 返回一个对象，该对象包含已分配了网络地址的网络接口 */
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}

module.exports = {getIpAddress}
