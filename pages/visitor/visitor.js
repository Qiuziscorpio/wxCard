// pages/visitor/visitor.js
var app = getApp()
Page({
  data: {
    customData: {},
    getCustomData: {
      'url': 'Card/GetCustomList',
      'data': {
        'page': 1
      }
    },
    collectCardData: {
      'url': 'Card/CollCard',
      'data': {
        'id': ''
      }
    }
  },
  //下拉刷新数据
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      'getCustomData.data.page': 1
    })
    app.postData(that.data.getCustomData, function (res) {
      that.setData({
        customData: res.data
      })
      wx.stopPullDownRefresh()
    })
  },
  //上拉加载分页数据
  onReachBottom: function () {
    var that = this
    that.getCustomList(that, ++that.data.getCustomData.data.page)
  },
  //获取访客列表数据
  getCustomList: function (that, page) {
    that.setData({
      'getCustomData.data.page': page
    })
    app.postData(that.data.getCustomData, function (res) {
      if (res.data.length === 0) {
        wx.showToast({
          title: '没有更多内容了',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        that.setData({
          customData: res.data
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 800)
      }
    })
  },
  //收藏名片
  collectCard: function (e) {
    var that = this
    that.setData({
      'collectCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collectCardData, function (res) {
      that.getCustomList(that, 1)
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.getCustomList(that, 1)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this
    that.getCustomList(that, 1)
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})