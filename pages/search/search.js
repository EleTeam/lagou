// pages/search/search.js
var http = require('../../utils/http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header: {
      title: '拉勾网',
      leftIcon: false,
      rightIcon: false
     },
    keyword: '',
    page: {},
    positionList: [],
    isLoading: false, // 请求状态
    showCity: false,
    city: '全国',
    cities: []
  },

  /**
   * 点击键盘enter键或者完成的事件
   *
   * @param {any} e
   */
  confirmSearch(e) {
    this.search(e.detail)
  },

  /**
   * 点击搜索图标的事件
   *
   */
  iconSearch() {
    var self = this
    wx.createSelectorQuery().select('.input').fields({ properties: ['value'] }, function (args) {
      self.search(args)
    }).exec()
  },

  /**
   * 搜索功能
   *
   * @param {any} e
   */
  search(e) {
    if(!e.value) return
    this.data.keyword = e.value
    let data = {
      city: this.data.city,
      positionName: this.data.keyword
    }
    http(app.apiName.search, { data }).then(res => {
      let tempData = {}
      tempData.page = res.content.data.page
      res.content.data.page.result.forEach(function(item) {
        item.companyLogo = app.picHost + item.companyLogo
      });
      tempData.positionList = tempData.page.result
      this.setData(tempData)
    })
  },

  /**
   * 加载更多搜索结果
   *
   */
  loadMore(){
    if(this.data.isLoading) return
    let tempData = {
      isLoading: true
    }
    let data = {
      city: this.data.city,
      positionName: this.data.keyword,
      pageNo: this.data.page.pageNo + 1
    }
    this.setData(tempData)
    http(app.apiName.search, { data }).then(res => {
      tempData.isLoading = false
      res.content.data.page.result.forEach(function(item) {
        item.companyLogo = app.picHost + item.companyLogo
      });
      res.content.data.page.result = this.data.positionList.concat(res.content.data.page.result)
      tempData.page = res.content.data.page
      tempData.positionList = tempData.page.result
      this.setData(tempData)
    })
  },

  /**
   * 显示城市列表更换选择城市
   *
   */
  changeCity: function () {
    this.setData({
      showCity: true
    })
  },

  /**
   * 切换搜索城市
   *
   * @param {any} e 事件对象
   */
  selectCity: function (e) {
    let tempData = {}
    tempData.city = e.currentTarget.dataset.cityName
    tempData.showCity = false
    if (!tempData.city) return
    this.setData(tempData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载城市列表
    http(app.apiName.cities).then(res => {
      let tempData = {}
      tempData.cities = []
      if (res.content.custom != 'null') {
        tempData.city = res.content.custom
      }
      let cityList = JSON.parse(res.content.cities)
      for (let item of cityList) {
        item.cityGroup = []
        let count = Math.ceil(item.cityList.length / 3)
        for (let i = 0; i < count; i++) {
          let cities = item.cityList.slice(3 * i, 3 * (i + 1))
          while (cities.length < 3) { // 为了保持3列的布局，增加空字符串填满数组
            cities.push('')
          }
          item.cityGroup.push(cities)
        }
        delete item.cityList
      }
      tempData.cities = cityList
      this.setData(tempData)
    })
  }
})
