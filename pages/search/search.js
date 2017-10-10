// pages/search/search.js
var http = require('../../utils/http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCity: false,
    city: '全国',
    cities: []
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
    if(!tempData.city) return
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
