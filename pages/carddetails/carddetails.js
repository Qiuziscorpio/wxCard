// pages/carddetails/carddetails.js
//获取应用实例
var app = getApp()

Page({
  data: {
    mobile: '',
    getData: {},
    isshare: false,
    isviewImage: true,
    econds: 3,
    cardDetailsData: {},
    removeCollCard: {
      'url': 'Card/removeCollCard',
      'data': {
        'id': ''
      }
    },
    GetOthersCard2: {
      'url': 'https://api.91ygj.com/vCard/Card/GetOthersCard2',
      'data': {
        'id': ''
      }
    },
    CardShareData: {
      'url': 'Card/GetCardShared',
      'data': {
        'id': ''
      }
    },
    cardDetails: {
      'url': 'Card/GetCard',
      'data': {
        'id': ''
      }
    },
    othersCardDetails: {
      'url': 'Card/GetOthersCard',
      'data': {
        'id': ''
      }
    },
    collCardData: {
      'url': 'Card/CollCard',
      'data': {
        'id': ''
      }
    },
    GetCardQRCode: {
      'url': 'Card/GetCardQRCode',
      'data': {
        'id': ''
      }
    }
  },
  //打开地图
  openAddress: function (e) {
    wx.getLocation({
      //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = parseFloat(e.target.dataset.loglat.split(",")[0])
        var longitude = parseFloat(e.target.dataset.loglat.split(",")[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: e.target.dataset.name,
          address: e.target.dataset.name,
          scale: 28,
          complete: function (res) {
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: '您好,这是我的名片,请惠存。',
      path: 'pages/carddetails/carddetails?id=' + that.data.cardDetails.data.id + '&share=1',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  //拨打电话
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },
  countdown: function (that) {
    var second = that.data.econds
    var timer
    if (second == 0) {
      clearTimeout(timer);
      that.setData({
        econds: 3,
        isviewImage: true
      });
      return;
    }
    timer = setTimeout(function () {
      that.setData({
        econds: second - 1,
        isviewImage: false
      });
      that.countdown(that);
    }, 1000)
  },
  //获取二维码地址
  getCode: function (e) {
    var that = this
    that.setData({
      'GetCardQRCode.data.id': e.currentTarget.dataset.id
    })
    app.postData(that.data.GetCardQRCode, function (res) {
      wx.previewImage({
        current: res.data + '?' + Math.random(),
        urls: [res.data + '?' + Math.random()],
        success: function () {
          that.countdown(that);
        }
      })
    })
  },
  //删除单张名片
  removeCard: function (e) {
    var data = {
      'url': 'Card/RemoveCard',
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  //编辑单张名片
  editCard: function (e) {
    wx.navigateTo({
      url: '../createcard/createcard?id=' + e.target.dataset.id
    })
  },
  //设置单张默认名片
  setCardDefault: function (e) {
    var that = this
    var data = {
      'url': 'Card/SetCardDefault',
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          app.postData(that.data.cardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //打开我的名片
  openMycard: function () {
    wx.switchTab({
      url: '../mycard/mycard'
    })
  },
  //移除收藏的名片
  undockCard: function (e) {
    var that = this
    that.setData({
      'removeCollCard.data.id': e.target.dataset.id
    })
    app.postData(that.data.removeCollCard, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          app.postData(that.data.othersCardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //收藏他人名片夹
  addCard: function (e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          // wx.switchTab({
          //   url: '../mycard/mycard'
          // })
          app.postData(that.data.othersCardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //收藏他人名片夹 并且打开名片小程序
  addCardOpen: function (e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          wx.switchTab({
            url: '../cardcase/cardcase'
          })
        }
      })
    })
  },
  openShare: function (e) {
    var that = this
    that.setData({
      'CardShareData.data.id': e.target.dataset.id
    })
    app.postData(that.data.CardShareData, function (res) {
      wx.previewImage({
        current: res.data + '?' + Math.random(), // 当前显示图片的http链接
        urls: [res.data + '?' + Math.random()] // 需要预览的图片http链接列表
      })
      that.setData({
        isviewImage: true
      })
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    if (options.q) {
      var src = decodeURIComponent(options.q)

      console.log(options.q)
      src.match(/id=(\S*)&share=1/)[1]
      that.setData({
        'cardDetails.data.id': src.match(/id=(\S*)&share=1/)[1],
        'othersCardDetails.data.id': src.match(/id=(\S*)&share=1/)[1],
        'GetOthersCard2.data.id': src.match(/id=(\S*)&share=1/)[1]
      })
      app.getLogiCallback('', function () {
        wx.request({
          url: that.data.GetOthersCard2.url,
          method: 'POST',
          data: that.data.GetOthersCard2.data,
          header: {
            'token': wx.getStorageSync('loginSuccessData').token,
            'content-type': 'application/json'
          },
          success: function (res) {
            that.setData({
              isshare: true,
              cardDetailsData: res.data.data,
              mobile: wx.getStorageSync('loginSuccessData').mobile
            })
          },
          fail: function (res) {
            console.log('请求出错')
          }
        })
      })
    } else {
      that.setData({
        'cardDetails.data.id': options.id,
        'othersCardDetails.data.id': options.id,
        'GetOthersCard2.data.id': options.id
      })
      if (options.share) {
        app.getLogiCallback('', function () {
          wx.request({
            url: that.data.GetOthersCard2.url,
            method: 'POST',
            data: that.data.GetOthersCard2.data,
            header: {
              'token': wx.getStorageSync('loginSuccessData').token,
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                isshare: true,
                cardDetailsData: res.data.data,
                mobile: wx.getStorageSync('loginSuccessData').mobile
              })
            },
            fail: function (res) {
              console.log('请求出错')
            }
          })
        })
      } else {
        if (options.type) {
          that.setData({
            getData: that.data.othersCardDetails,
          })
        } else {
          that.setData({
            getData: that.data.cardDetails,
          })
        }
        app.postData(that.data.getData, function (res) {
          that.setData({
            cardDetailsData: res.data,
            mobile: wx.getStorageSync('loginSuccessData').mobile
          })

          wx.setNavigationBarTitle({
            title: res.data.name
          })
        })
      }
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (wx.getStorageSync('token')) {
      var that = this
      app.postData(that.data.getData, function (res) {
        that.setData({
          cardDetailsData: res.data,
          mobile: wx.getStorageSync('loginSuccessData').mobile
        })
      })
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})