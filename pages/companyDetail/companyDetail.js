// pages/companyDetail/companyDetail.js
const http = require('../../utils/http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyInfo: '',
    companyShortName: '',
    companyId: '',
    companyLogo: '',
    companyAddress: '',
    selectedIndex: 0, // 默认选中的职位类型
    currentData: {}, // 当前展示的列表数据
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http(app.apiName.companyDetail.replace('companyId', options.companyId)).then(res => {
      console.log(res)
      let tempData = {}
      // 公司信息
      tempData.companyInfo = res.data.content.companyInfo
      tempData.companyShortName = res.data.content.companyShortName
      tempData.companyId = res.data.content.companyId
      tempData.companyAddress = res.data.content.companyAddress
      // 处理公司logo
      tempData.companyLogo = res.data.content.companyLogo
      console.log(tempData.companyLogo.length)
      tempData.companyLogo = 'https:' + tempData.companyLogo.substring(tempData.companyLogo.indexOf("//"), tempData.companyLogo.length - 1)

      let pageMap = JSON.parse(res.data.content.pageMap)
      tempData.dataList = []
      tempData.selectedIndex = -1
      let count = 0 // 索引
      for (let [k, v] of Object.entries(pageMap)) {
        if(tempData.selectedIndex == -1 && v.totalCount != 0) {
          tempData.selectedIndex = count
          tempData.currentData = {
            key: k,
            value: v
          };
          (v.totalCount < v.pageSize * v.pageNo || v.totalCount == v.pageSize * v.pageNo) ? tempData.currentData.hasMore = false : tempData.currentData.hasMore = true
        }
        tempData.dataList.push({
          key: k,
          value: v
        })
        count++
      }

      this.setData(tempData)
    })
  }
})
