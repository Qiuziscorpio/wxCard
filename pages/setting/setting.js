// pages/setting/setting.js
var app = getApp()

Page({
  data: {
    ischecked: false
  },
  //开启自动扫码自动交换名片 
  switch1Change: function (e) {
    var that = this
    var data = {
      'url': 'Card/SetAutoChange',
      'data': {
        'isAutoChange': e.detail.value
      }
    }
    app.postData(data, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          that.setData({
            ischecked: e.detail.value
          })
        }
      })
    })
  },
  getMySetting: function (that) {
    var data = 'Card/GetMySetting'
    app.getData(data, function (res) {
      that.setData({
        ischecked: res.data.isAutoChange
      })
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getMySetting(this)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})