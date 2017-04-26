// pages/phoneverify/phoneverify.js
var app = getApp()

Page({
  data: {
    issubmit: true,
    isgetVerifyCode: true,
    econds: 60,
    verify: {
      'mobile': '',
      'code': '',
    }
  },
  //获取输入手机号码
  verifyDataMobile: function (e) {
    var that = this
    that.setData({
      'verify.mobile': e.detail.value
    })
    if (e.detail.value != '' && that.data.verify.code != '') {
      that.setData({
        issubmit: false
      })
    } else {
      that.setData({
        issubmit: true
      })
    }
  },
  //获取输入验证码
  verifyDataCode: function (e) {
    var that = this
    that.setData({
      'verify.code': e.detail.value
    })
    if (e.detail.value != '' && that.data.verify.mobile != '') {
      that.setData({
        issubmit: false
      })
    } else {
      that.setData({
        issubmit: true
      })
    }
  },
  //获取验证码
  getVerifyCode: function () {
    var that = this
    that.setData({
      isgetVerifyCode: false
    })
    var data = {
      'url': 'Card/VerifyMob1',
      'data': {
        'mobile': that.data.verify.mobile
      }
    }
    app.postData(data, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          that.countdown(that)
        }
      })
    })
  },
  countdown: function (that) {
    var second = that.data.econds
    var timer
    if (second == 0) {
      clearTimeout(timer);
      that.setData({
        econds: 60,
        isgetVerifyCode: true
      });
      return;
    }
    timer = setTimeout(function () {
      that.setData({
        econds: second - 1,
        isgetVerifyCode: false
      });
      that.countdown(that);
    }, 1000)

  },
  formSubmit: function (e) {
    var that = this
    var data = {
      'url': 'Card/VerifyMob2',
      'data': e.detail.value
    }
    app.postData(data, function (res) {
      if (res.code === 400) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
            var loginSuccessData = {
              'token': wx.getStorageSync('loginSuccessData').token,
              'mobVerify': true,
              'mobile': e.detail.value.mobile,
            }
            wx.setStorageSync('loginSuccessData', loginSuccessData)
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({
      'verify.mobile': wx.getStorageSync('loginSuccessData').mobile,
      'verify.mobVerify': wx.getStorageSync('loginSuccessData').mobVerify
    })
    if (wx.getStorageSync('loginSuccessData').mobVerify) {
      wx.setNavigationBarTitle({
        title: '更改手机号码'
      })
    }
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