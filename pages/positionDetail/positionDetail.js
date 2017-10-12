// pages/positionDetail/positionDetail.js
var http = require('../../utils/http')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false, // 请求状态
    positionName: '', // 职位名称
    haveCollect: '', // 是否已收藏
    salary: '', // 薪水
    positionAddress: '', // 地址
    jobNature: '', // 职位类型
    workYear: '', // 工作年龄
    education: '', // 文化要求
    advantage: '', // 职位诱惑
    companyLogo: '', // 公司logo
    companyId: '', // 公司ID
    companyShortName: '', // 公司名称
    companyInfo: '', // 公司简介信息
    positionDesc: '', // 职位描述
    page: '', // 评价相关信息
  },

  /**
   * 查看公司详细招聘信息
   */
  viewCompanyDetail: (e) => {
    app.navTo('companyDetail', { companyId: e.currentTarget.dataset.cid })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tempData = {
      isLoading: true
    } // 临时的页面数据对象，用于一次性的使用setData函数，提高性能
    wx.showLoading({ title: '数据加载中...' })
    this.setData(tempData)
    http(app.apiName.positionDetail.replace('positionId', options.positionId)).then(res => {
      tempData.isLoading = false
      wx.hideToast()

      tempData.positionName = res.content.positionName
      tempData.haveCollect = res.content.haveCollect
      tempData.salary = res.content.salary
      tempData.positionAddress = res.content.positionAddress
      tempData.jobNature = res.content.jobNature
      tempData.workYear = res.content.workYear
      tempData.education = res.content.education

      tempData.advantage = res.content.advantage
      tempData.companyShortName = res.content.companyShortName
      tempData.companyInfo = res.content.companyInfo
      tempData.companyId = res.content.companyId

      // 处理公司logo
      tempData.companyLogo = res.content.companyLogo
      tempData.companyLogo = 'https:' + tempData.companyLogo.substring(tempData.companyLogo.indexOf("//"), tempData.companyLogo.length)

      // 处理职位描述
      let descs = []
      tempData.positionDesc = res.content.positionDesc
      tempData.positionDesc.replace(/<p>(.*)<\/p>/ig, function () {
        let args = arguments
        let brRegExp = /^(<br>)/
        let brs = args[1].match(/<br>/ig)
        // 如果只有与一个P标签的情况，将会匹配出多个br标签
        // 也有可能存在只有一个p标签和一个br标签的情况
        if (brs != null) {
          if (brRegExp.test(args[1])) {
            return // 过滤换行符
          } else {
            descs = args[1].split(/<br>/)
            return
          }
        }
        descs.push(args[1])
      })
      tempData.positionDesc = descs

      // 处理评价列表
      tempData.page = JSON.parse(res.content.page)
      for (let item of tempData.page.result) {
        let time = new Date(item.createTime)
        item.createTime = `${time.getFullYear()}/${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}/${time.getDate() > 9 ? time.getDate() : '0' + time.getDate()}`
        item.companyScore = parseInt(item.companyScore)
        item.comprehensiveScore = parseInt(item.comprehensiveScore)
        item.describeScore = parseInt(item.describeScore)
        item.interviewerScore = parseInt(item.interviewerScore)
      }
      this.setData(tempData)
    })
  }
})
