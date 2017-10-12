// pages/companyDetail/companyDetail.js
const http = require('../../utils/http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false, // 请求状态
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
   * 职位类型切换
   *
   * @param {any} e 事件
   */
  changeType: function (e) {
    let index = e.currentTarget.dataset.index
    if (index == this.data.selectedIndex || this.data.dataList[index].value.totalCount == 0) return
    let currentData = this.data.dataList[index]
    ;(currentData.value.totalCount < currentData.value.pageSize * currentData.value.pageNo || currentData.value.totalCount == currentData.value.pageSize * currentData.value.pageNo) ? currentData.hasMore = false : currentData.hasMore = true
    this.setData({
      currentData,
      selectedIndex: index
    })
  },

  /**
   * 根据职位类型加载更多的数据
   *
   */
  loadMore: function (){
    let query = {
      data: {
        pageNo: this.data.currentData.value.pageNo + 1,
        companyId: this.data.companyId,
        positionFirstType: this.data.currentData.key
      }
    }
    let tempData = {
      isLoading: true
    }
    this.setData(tempData)
    http(app.apiName.companyDetail.replace('companyId', this.data.companyId), query).then(res => {
      tempData.isLoading = false
      // 复制内容
      tempData.currentData = this.data.currentData
      tempData.dataList = this.data.dataList
      // 添加新内容
      let toObj = tempData.dataList[this.data.selectedIndex]
      let fromObj = res.content.data.pageMap[tempData.currentData.key]
      toObj.value.result = toObj.value.result.concat(fromObj.result)
      toObj.value.pageNo = fromObj.pageNo
      toObj.value.pageSize = fromObj.pageSize
      toObj.value.start = fromObj.start
      toObj.value.totalCount = fromObj.totalCount

      // 设置当前列表
      tempData.currentData = toObj
      let v = tempData.currentData.value
      ;(v.totalCount < v.pageSize * v.pageNo || v.totalCount == v.pageSize * v.pageNo) ? tempData.currentData.hasMore = false : tempData.currentData.hasMore = true

      this.setData(tempData)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempData = {
      isLoading: true
    }
    wx.showLoading({ title: '数据加载中...' })
    this.setData(tempData)
    http(app.apiName.companyDetail.replace('companyId', options.companyId)).then(res => {
      tempData.isLoading = false
      wx.hideToast()

      // 公司信息
      tempData.companyInfo = res.content.companyInfo
      tempData.companyShortName = res.content.companyShortName
      tempData.companyId = res.content.companyId
      tempData.companyAddress = res.content.companyAddress
      // 处理公司logo
      tempData.companyLogo = res.content.companyLogo
      tempData.companyLogo = 'https:' + tempData.companyLogo.substring(tempData.companyLogo.indexOf("//"), tempData.companyLogo.length - 1)

      let pageMap = JSON.parse(res.content.pageMap)
      tempData.dataList = []
      tempData.selectedIndex = -1
      let count = 0 // 索引
      for (let [k, v] of Object.entries(pageMap)) {
        if (tempData.selectedIndex == -1 && v.totalCount != 0) {
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
