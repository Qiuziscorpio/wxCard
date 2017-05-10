// pages/createcard/createcard.js
//获取应用实例
var app = getApp()

Page({
  data: {
    iseng: true,
    ischinese: true,
    isen: false,
    cardData: {
      "url": "",
      'data': {
        'id': '',
        'name': '',
        'title': '',
        'mobile': '',
        'companyName': '',
        'more': '',
        'mobileVerify': false,
        'avatarUrl': '',
        'isDefault': false,
        'email': '',
        'address': '',
        'loglat': '',
        'language': ''
      }
    },
    enCardData: {
      "url": "",
      'data': {
        'id': '',
        'name': '',
        'title': '',
        'mobile': '',
        'companyName': '',
        'mobileVerify': false,
        'more': '',
        'avatarUrl': '',
        'isDefault': false,
        'email': '',
        'address': '',
        'loglat': '',
        'language': ''
      }
    }
  },
  cardDataName: function (e) {
    this.setData({
      'cardData.data.name': e.detail.value
    })
  },
  cardDataTitle: function (e) {
    this.setData({
      'cardData.data.title': e.detail.value
    })
  },
  cardDataMobile: function (e) {
    this.setData({
      'cardData.data.mobile': e.detail.value
    })
  },
  cardDataCompanyName: function (e) {
    this.setData({
      'cardData.data.companyName': e.detail.value
    })
  },
  cardDataMore: function (e) {
    this.setData({
      'cardData.data.more': e.detail.value
    })
  },
  cardDataEmail: function (e) {
    this.setData({
      'cardData.data.email': e.detail.value
    })
  },
  enCardDataName: function (e) {
    this.setData({
      'enCardData.data.name': e.detail.value
    })
  },
  enCardDataTitle: function (e) {
    this.setData({
      'enCardData.data.title': e.detail.value
    })
  },
  enCardDataMobile: function (e) {
    this.setData({
      'enCardData.data.mobile': e.detail.value
    })
  },
  enCardDataCompanyName: function (e) {
    this.setData({
      'enCardData.data.companyName': e.detail.value
    })
  },
  enCardDataMore: function (e) {
    this.setData({
      'enCardData.data.more': e.detail.value
    })
  },
  enCardDataEmail: function (e) {
    this.setData({
      'enCardData.data.email': e.detail.value
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    if (options.id === "0") {
      that.setData({
        iseng: true,
        'cardData.data.id': '',
        'cardData.data.mobile': wx.getStorageSync('loginSuccessData').mobile,
        'cardData.data.mobileVerify': wx.getStorageSync('loginSuccessData').mobVerify,
        'cardData.data.avatarUrl': wx.getStorageSync('userInfo').avatarUrl,
        'cardData.data.name': wx.getStorageSync('userInfo').nickName,

      })
      wx.setNavigationBarTitle({
        title: '创建名片'
      })
    } else {
      that.setData({
        iseng: false,
        'cardData.data.id': options.id,
        'cardData.data.mobile': wx.getStorageSync('loginSuccessData').mobile,
        'cardData.data.mobileVerify': wx.getStorageSync('loginSuccessData').mobVerify,
        'cardData.data.avatarUrl': wx.getStorageSync('userInfo').avatarUrl,
        'cardData.data.name': wx.getStorageSync('userInfo').nickName,

      })
      wx.setNavigationBarTitle({
        title: '编辑名片'
      })

      var editDataCard = {
        'url': 'Card/GetCard',
        'data': {
          'id': options.id
        }
      }
      app.postData(editDataCard, function (res) {
        if (res.data.language === 1) {
          that.setData({
            ischinese: false,
            isen: true,
            'enCardData.data': res.data
          })
          return
        } else if (res.data.language === 0) {
          that.setData({
            'cardData.data': res.data,
          })
          return
        }
      })
    }
  },
  toVerifyCode: function () {
    wx.navigateTo({
      url: '../phoneverify/phoneverify'
    })
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
  },
  tabEng: function () {
    var that = this

    if (that.data.isen) {
      wx.setStorageSync('enCardData', that.data.enCardData)
      if (wx.getStorageSync('cardData')) {
        return that.setData({
          ischinese: true,
          isen: false,
          cardData: wx.getStorageSync('cardData')
        })
      } else {
        return that.setData({
          ischinese: true,
          isen: false,
          cardData: that.data.cardData
        })
      }
    }
    if (that.data.ischinese) {
      wx.setStorageSync('cardData', that.data.cardData)

      if (wx.getStorageSync('enCardData')) {
        return that.setData({
          ischinese: false,
          isen: true,
          enCardData: wx.getStorageSync('enCardData')
        })
      } else {
        return that.setData({
          ischinese: false,
          isen: true,
          enCardData: that.data.enCardData
        })
      }
    }
  },
  openAddress: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'cardData.data.address': res.address,
          'cardData.data.loglat': res.latitude + ',' + res.longitude
        })
        that.setData({
          'enCardData.data.address': res.address,
          'enCardData.data.loglat': res.latitude + ',' + res.longitude
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    if (e.detail.value.name === '' || e.detail.value.mobile === '') {
      if (e.detail.value.name === '') {
        wx.showToast({
          title: '姓名必填',
          image: '../../images/error.png',
          duration: 2000
        })
      }
      if (e.detail.value.mobile === '') {
        wx.showToast({
          title: '手机必填',
          image: '../../images/error.png',
          duration: 2000
        })
      }
    } else {

      var data = {
        'url': 'Card/SaveCard',
        'data': {
          'id': that.data.cardData.data.id,
          'name': e.detail.value.name,
          'title': e.detail.value.title,
          'mobile': e.detail.value.mobile,
          'companyName': e.detail.value.companyName,
          'more': e.detail.value.more,
          // 'avatarUrl': that.data.cardData.data.avatarUrl,
          // 'isDefaurl': false,
          'email': e.detail.value.email,
          'address': e.detail.value.address,
          'loglat': that.data.cardData.data.loglat,
          'language': 0
        }
      }
      if (e.detail.value.email != '') {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(e.detail.value.email)) {
          wx.showToast({
            title: '邮箱错误',
            image: '../../images/error.png',
            duration: 2000
          })
        } else {

          app.postData(data, function (res) {
            if (res.code === 200) {
              var loginSuccessData = {
                'token': wx.getStorageSync('loginSuccessData').token,
                'mobile': e.detail.value.mobile,
                'mobVerify': wx.getStorageSync('loginSuccessData').mobVerify
              }
              wx.setStorageSync('loginSuccessData', loginSuccessData)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }

      } else {
        app.postData(data, function (res) {
          if (res.code === 200) {
            var loginSuccessData = {
              'token': wx.getStorageSync('loginSuccessData').token,
              'mobile': e.detail.value.mobile,
              'mobVerify': wx.getStorageSync('loginSuccessData').mobVerify
            }
            wx.setStorageSync('loginSuccessData', loginSuccessData)
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },
  enformSubmit: function (e) {
    var that = this
    if (e.detail.value.name === '' || e.detail.value.mobile === '') {
      if (e.detail.value.name === '') {
        wx.showToast({
          title: 'name required',
          image: '../../images/error.png',
          duration: 2000
        })
      }
      if (e.detail.value.mobile === '') {
        wx.showToast({
          title: 'mobile required',
          image: '../../images/error.png',
          duration: 2000
        })
      }
    } else {
      var data = {
        'url': 'Card/SaveCard',
        'data': {
          'id': that.data.cardData.data.id,
          'name': e.detail.value.name,
          'title': e.detail.value.title,
          'mobile': e.detail.value.mobile,
          'companyName': e.detail.value.companyName,
          'more': e.detail.value.more,
          // 'avatarUrl': that.data.cardData.data.avatarUrl,
          // 'isDefaurl': false,
          'email': e.detail.value.email,
          'address': e.detail.value.address,
          'loglat': that.data.enCardData.data.loglat,
          'language': 1
        }
      }
      if (e.detail.value.email != '') {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(e.detail.value.email)) {
          wx.showToast({
            title: 'Email Error',
            image: '../../images/error.png',
            duration: 2000
          })
        } else {
          app.postData(data, function (res) {
            if (res.code === 200) {
              var loginSuccessData = {
                'token': wx.getStorageSync('loginSuccessData').token,
                'mobile': e.detail.value.mobile,
                'mobVerify': wx.getStorageSync('loginSuccessData').mobVerify
              }
              wx.setStorageSync('loginSuccessData', loginSuccessData)
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      } else {
        app.postData(data, function (res) {
          if (res.code === 200) {
            var loginSuccessData = {
              'token': wx.getStorageSync('loginSuccessData').token,
              'mobile': e.detail.value.mobile,
              'mobVerify': wx.getStorageSync('loginSuccessData').mobVerify
            }
            wx.setStorageSync('loginSuccessData', loginSuccessData)
            wx.navigateBack({
              delta: 1
            })
          }
        })

      }















    }
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})