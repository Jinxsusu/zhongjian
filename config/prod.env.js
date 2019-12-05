'use strict'

/**
 * 生产环境
 */
module.exports = {
  NODE_ENV: '"production"',
  ServerUrl:'"http://****:7080/jrtech"', //后端服务路径：注意是http://
  WebDomain:'"/jrtechapp/"', // 网站虚拟目录，从域名后的第一个“/”开始到最后一个“/”为止
  WebCDNUrl:'"/jrtechapp/181211/"',// 网站本地js路径,修改为当前两位年两位月两位日
  AppName:'"中建一局"',// 网站名称
  AppShortName:'"cscec1b"',// 网站点击折叠后显示名称
  assetsPublicPath:"'./jrtechapp'",// webpack  assetsPublicPath配置，网站虚拟目录，从域名后的第一个“/”开始到最后一个“/”为止
}
