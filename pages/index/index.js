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
    app.navTo('customInfo')
  },

  /**
   * 查看职位详情
   */
  viewPositionDetail: (e) => {
    app.navTo('positionDetail', {positionId: e.currentTarget.dataset.pid})
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
    let tempData = {
      isLoading: true
    } // 临时的页面数据对象，用于一次性的使用setData函数，提高性能
    var options = {}
    if (pageNo) options.data = { pageNo: pageNo }
    this.setData(tempData)
    http(app.apiName.indexList, options).then(res => {
      tempData.isLoading = false

      for (let item of res.data.content.data.page.result) {
        item.companyLogo = app.picHost + item.companyLogo
      }

      parseInt(res.data.content.data.page.start) + res.data.content.data.page.pageSize < res.data.content.data.page.totalCount ? tempData.showBtn = true : tempData.showBtn = false

      tempData.pageNo = res.data.content.data.page.pageNo

      pageNo ? tempData.positionList = this.data.positionList.concat(res.data.content.data.page.result) : tempData.positionList = res.data.content.data.page.result

      this.setData(tempData)
    })
  },
  onLoad: function () {
    this.loadData()
  }
})
