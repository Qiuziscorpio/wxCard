// pages/mycard/mycard.js
//获取应用实例
var app = getApp()
Page({
  data: {
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国' },
    ],
    cardDataUrl: 'Card/GetAllCard',
    cardData: []
  },
  getCardData: function () {
    //获取我的名片数据
    var that = this
    app.getData(that.data.cardDataUrl, function (res) {
      if (res.data.length == 0) {
        wx.showModal({
          title: '请创建名片',
          showCancel: false,
          content: '至少创建一张名片才能正常使用哦~',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../createcard/createcard?id=0'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
      that.setData({
        cardData: res.data
      })
    })
  },
  openCreatecard: function () {
    var that = this
    if (wx.getStorageSync('loginSuccessData').mobVerify) {
      wx.navigateTo({
        url: '../createcard/createcard?id=0'
      })
    } else {
      wx.showModal({
        title: '请验证手机',
        showCancel: false,
        content: '请先验证手机号码~',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../phoneverify/phoneverify'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  radioChange: function (e) {
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.login({
      success: function (body) {
        if (body.code) {

          wx.request({
            url: "https://api.91ygj.com/vCard/Card/jscode2session?code=" + body.code,
            data: {
            },
            success: function (body) {
              wx.getUserInfo({
                success: function (res) {
                  wx.setStorageSync('userInfo', res.userInfo)
                  var data = {
                    'iv': res.iv,//wx.getUserInfo接口返回那里的iv
                    'rawData': res.rawData, //wx.getUserInfo接口返回那里的iv
                    'signature': res.signature,// wx.getUserInfo接口返回那里的signature
                    'encryptedData': res.encryptedData,  //wx.getUserInfo接口返回那里的encryptedData
                    'session_key': body.data.session_key //wx.login接口下面 “code 换取 session_key” 获得
                  }

                  app.getLoginData(data, function (res2) {
                    wx.setStorageSync('token', res2.data.token)
                    wx.setStorageSync('loginSuccessData', res2.data)
                    that.getCardData();
                  })
                }
              })
            }
          })
        } else {
          console.log('登录失败')
        }
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this
    if (wx.getStorageSync('token')) {
      that.getCardData()
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})