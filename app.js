//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this

    // wx.checkSession({
    //   success: function (a) {
    //     //session 未过期，并且在本生命周期一直有效
    //   },
    //   fail: function () {
    //     //登录态过期 重新登录
    //     wx.login({
    //       success: function (body) {
    //         if (body.code) {
    //           wx.request({
    //             url: 'https://api.weixin.qq.com/sns/jscode2session'
    //             + '?appid=wx35cf5d6b4146b9cf&'
    //             + 'secret=13df11be71d7c686adaa093c33fef3ba&'
    //             + 'js_code=' + body.code
    //             + '&grant_type=authorization_code',
    //             data: {
    //             },
    //             success: function (body) {
    //               wx.getUserInfo({
    //                 success: function (res) {
    //                   wx.setStorageSync('userInfo', res.userInfo)
    //                   var data = {
    //                     'iv': res.iv,//wx.getUserInfo接口返回那里的iv
    //                     'rawData': res.rawData, //wx.getUserInfo接口返回那里的iv
    //                     'signature': res.signature,// wx.getUserInfo接口返回那里的signature
    //                     'encryptedData': res.encryptedData,  //wx.getUserInfo接口返回那里的encryptedData
    //                     'session_key': body.data.session_key //wx.login接口下面 “code 换取 session_key” 获得
    //                   }

    //                   that.getLoginData(data, function (res2) {
    //                     wx.setStorageSync('token', res2.data.token)
    //                     wx.setStorageSync('loginSuccessData', res2.data)
    //                   })
    //                 }
    //               })
    //             }
    //           })
    //         } else {
    //           console.log('登录失败')
    //         }
    //       }
    //     })
    //   }
    // })
  },

  getLogiCallback: function (val, callback) {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      callback()
    } else {
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

                    that.getLoginData(data, function (res2) {
                      wx.setStorageSync('token', res2.data.token)
                      wx.setStorageSync('loginSuccessData', res2.data)
                      callback(res2.data.token)
                    })
                  },
                  fail: function (res){
                    wx.showModal({
                      title: '警告',
                      showCancel:true,
                      cancelText:'不授权',
                      confirmText:'授权',
                      content: '若不授权微信登陆，则无法使用蚁管家名片功能；点击重新获取授权，则可重新使用；若点击不授权，后期还使用小程序，需在微信【发现】——【小程序】——删掉【蚁管家名片】，重新搜索授权登陆，方可使用。',
                      success: function (res) {
                        if (res.confirm) {
                          wx.openSetting({
                            success:function(res){
                              if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
                                that.getLogiCallback('',      function(){
                                  callback('')
                                })
                              }
                            }
                          })
                        } else if (res.cancel) {
                        }
                      }
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
    }

  },
  getLoginData: function (data, callback) {
    var url = 'https://api.91ygj.com/vCard/VCardUser/Login'
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      },
      fail: function (res) {
        console.log('请求出错')
      }
    })
  },
  getData: function (data, callback) {
    var url = 'https://api.91ygj.com/vCard/' + data
    var token = wx.getStorageSync('token')
    wx.request({
      url: url,
      data: {},
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      },
      fail: function (res) {
        console.log('请求出错')
      }
    })
  },
  postData: function (data, callback) {
    var url = 'https://api.91ygj.com/vCard/' + data.url
    var token = wx.getStorageSync('token')
    wx.request({
      url: url,
      method: 'POST',
      data: data.data,
      header: {
        'token': token,
        'content-type': 'application/json'
      },
      success: function (res) {
        callback(res.data)
      },
      fail: function (res) {
        console.log('请求出错')
      }
    })
  },
})