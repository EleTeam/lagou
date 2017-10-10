//app.js
App({
  onLaunch: function () {
  },
  globalData: {
  },
  isLogin: false,
  navTo(routerName, qeury) {
    let routes = {
      index: "../index/index",
      search: "../search/search",
      mine: "../mine/mine",
      customInfo: "../customInfo/customInfo",
      customDetail: "../customDetail/customDetail",
      resume: "../resume/resume",
      collection: "../collection/collection",
      deliver: "../deliver/deliver",
      deliverDetail: "../deliverDetail/deliverDetail",
      positionDetail: "../positionDetail/positionDetail",
      companyDetail: "../companyDetail/companyDetail",
      interview: "../interview/interview",
      login: "../login/login"
    }

    let options = {}

    if (routes[routerName]) {
      options.url = routes[routerName]
    } else {
      wx.redirectTo({
        url: routes.index
      })
      return
    }


    if (qeury) {
      let arr = []
      for (let item of Object.keys(qeury)) {
        arr.push(item + '=' + qeury[item])
      }
      options.url += '?' + arr.join('&')
    }

    wx.navigateTo(options)
  },
  picHost: 'https://static.lagou.com/',
  apiName: { // 所有接口名称
    indexList: 'index/list', // 首页列表
    positionDetail: 'position/positionId', // 职位详情
    companyDetail: 'company/companyId', // 公司招聘信息
    cities: 'cities', // 地址
  }
})
