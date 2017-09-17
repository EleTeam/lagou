//index.js
//获取应用实例
var http = require('../../utils/http.js')
const app = getApp()

Page({
  data: {
    pageNo: 1,
    showBtn: false, // 默认不显示加载更多按钮
    isLoading: false, // 请求状态
    positionList: []
  },
  //事件处理函数
  gotoCustomInfo: function () {
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

  /**
   * 加载更多
   *
   */
  loadMore() {
    this.loadData(this.data.pageNo + 1)
  },
  /**
   * 通用请求数据函数
   *
   * @param {Number} pageNo 自定义的页码请求
   */
  loadData(pageNo) {
    var options = {}
    if (pageNo) options.data = { pageNo: pageNo }
    this.setData({ isLoading: true })
    http(app.apiName.indexList, options).then(res => {
      this.setData({ isLoading: false })
      for (let item of res.data.content.data.page.result) {
        item.companyLogo = app.picHost + item.companyLogo
      }
      if (parseInt(res.data.content.data.page.start) + res.data.content.data.page.pageSize < res.data.content.data.page.totalCount) {
        this.setData({ showBtn: true })
      } else {
        this.setData({ showBtn: false })
      }
      this.setData({ pageNo: res.data.content.data.page.pageNo })
      if (pageNo) {
        this.setData({
          positionList: this.data.positionList.concat(res.data.content.data.page.result)
        })
      } else {
        this.setData({
          positionList: res.data.content.data.page.result
        })
      }
    })
  },
  onLoad: function () {
    this.loadData()
  }
})
