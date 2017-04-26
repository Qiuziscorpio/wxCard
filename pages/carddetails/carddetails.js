// pages/carddetails/carddetails.js
//获取应用实例
var app = getApp()

Page({
  data: {
    mobile: '',
    getData: {},
    cardDetailsData: {},
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
    }
  },
    //拨打电话
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
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
  undockCard: function () {
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
          app.postData(that.data.othersCardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
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
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({
      'cardDetails.data.id': options.id,
      'othersCardDetails.data.id': options.id
    })
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
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this
    app.postData(that.data.getData, function (res) {
      that.setData({
        cardDetailsData: res.data,
        mobile: wx.getStorageSync('loginSuccessData').mobile
      })
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})