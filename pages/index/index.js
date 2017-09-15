//index.js
//获取应用实例
var http = require('../../utils/http.js')
const app = getApp()

Page({
  data: {
    positionList: []
  },
  //事件处理函数
  gotoCustomInfo: function() {
    wx.navigateTo({
      url: '../customInfo/customInfo'
    })
  },

  /**
   * 查看职位详情
   */
  viewPositionDetail: (e) => {
    wx.navigateTo({
      url: `../positionDetail/positionDetail?positionId=${e.currentTarget.dataset.pid}`,
    })
  },
  onLoad: function () {
    http(app.apiName.indexList).then(res => {
      for (let item of res.data.content.data.page.result) {
        item.companyLogo = app.picHost + item.companyLogo
      }
      this.setData({
        positionList: res.data.content.data.page.result
      })
    })
  }
})
