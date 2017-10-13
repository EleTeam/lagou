/*
 * @Author: guojingfeng
 * @Date: 2017-09-15 13:37:55
 * @Last Modified by: guojingfeng
 * @Last Modified time: 2017-10-13 13:30:18
 */
var baseUrl = 'http://localhost:3000/api/'

/**
 * 对微信网络请求的简易封装
 *
 * @param {any} apiName 接口地址对应名称
 * @param {any} options 微信请求支持的参数
 * @returns
 */
module.exports = function (apiName, options, callback) {
  return new Promise((resolve, reject) => {
    var config = {
      url: baseUrl + apiName,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        resolve(res.data)
      },
      fail: function () {
        // fail
        reject('fail')
      }
    }

    if (options) Object.assign(config, options)

    var requestTask = wx.request(config)

    callback && callback(requestTask)
  }).catch(err => console)
}
