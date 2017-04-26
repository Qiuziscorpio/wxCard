// pages/cardcase/cardcase.js
var app = getApp()

Page({
  data: {
    lastX: 0,
    lastY: 0,
    text: "没有滑动",
    touchDot: 0,
    istouch: true,
    green: false,
    slideselecgroup: false,
    selectedgroup: [],
    selecgroup: [],
    setgroup: [],
    isselecgroup: true,
    ismovebtn: false,
    hidden: true,
    isaddgroupinput: true,
    nocancel: false,
    tip: '',
    buttonDisabled: false,
    modalHidden: true,
    show: false,
    isSearch: false,
    cardcasedata: {},
    currenttab: 0,
    userCardData: {
      'url': 'Card/GetCollectCard',
      'data': {
        'sortType': 1,
        'key': ''
      }
    },
    cardgroup: {
      'url': 'Card/GetGroups',
      'data': []
    },
    setGroup: {
      'url': 'Card/SetGroup',
      'data': {
        'gid': '',
        'cid': []
      }
    }
  },
  //切换tab
  swiperTab: function (e) {
    var that = this;
    if (that.data.currenttab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currenttab: e.target.dataset.current
      })
    }
  },
  //显示tab的内容
  handleSwiperItem: function (e) {
    var that = this;
    that.setData({
      currenttab: that.data.currenttab
    })
  },
  //拨打电话
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },
  //获取个人名片数据
  getUserCardData: function (that, sortType, key) {
    that.setData({
      ismovebtn: false,
      'userCardData.data.sortType': sortType,
      'userCardData.data.key': key
    })

    app.postData(that.data.userCardData, function (res) {
      that.setData({
        cardcasedata: res.data
      })
      if (sortType == 3) {
        that.data.cardcasedata.map(function (v, i) {
          v.checked = false
          v.items.map(function (v2, i2) {
            v2.checked = false
            v2.radio = false
          })
        })

        that.setData({
          cardcasedata: that.data.cardcasedata
        })
      }
    })
  },
  //显示搜索
  showSearch: function () {
    var that = this
    that.setData({
      isSearch: !that.data.isSearch
    })

  },
  //获取搜索数据
  getSearchData: function (e) {
    var that = this
    that.getUserCardData(that, that.data.userCardData.data.sortType, e.detail.value)
  },
  //切换排序类型
  selectSortType: function () {
    var that = this
    wx.showActionSheet({
      itemColor: '#757575',
      itemList: ['按时间排序', '按字母排序', '按公司排序', '按分组排序'],
      success: function (res) {
        if (typeof (res.tapIndex) != 'undefined') {
          that.setData({
            'userCardData.data.sortType': res.tapIndex
          })
          that.getUserCardData(that, res.tapIndex, '')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //显示选择分组
  showSelectGroup: function () {
    var that = this
    that.setData({
      isselecgroup: !that.data.isselecgroup
    })
  },
  //显示分组弹框
  showSelectGroupPop: function () {
    var that = this
    that.setData({
      hidden: !that.data.hidden
    })

    app.getData(that.data.cardgroup.url, function (res) {
      that.setData({
        'cardgroup.data': res.data
      })

      that.data.cardcasedata.map(function (v, i) {
        v.items.map(function (v1, i1) {
          if (v1.checked || v1.radio) {
            that.data.setgroup.push(v1.id)
            that.setData({
              'setGroup.data.cid': that.data.setgroup,
              'cardgroup.data': that.data.cardgroup.data
            })
          }
        })
      })
    })
  },
  //分组弹框 取消按钮
  cancel: function (e) {
    var that = this
    that.setData({
      hidden: !that.data.hidden,
      setgroup: [],
      green: false,
      isselecgroup: true
    })
    that.getUserCardData(that, 3, '')
  },
  //分组弹框 确定按钮
  confirm: function (e) {
    var that = this
    console.log(that.data.setGroup.data.gid, 'gid')
    if (that.data.setGroup.data.gid == '') {
      wx.showToast({
        title: '请选择组',
        icon: 'success',
        duration: 2000,
        complete: function () {
        }
      })
    } else {
      app.postData(that.data.setGroup, function (res) {
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 2000,
          complete: function () {
            that.setData({
              hidden: !that.data.hidden,
              setgroup: [],
              isselecgroup: true,
              green: false,

            })
            that.getUserCardData(that, 3, '')
          }
        })
      })
    }
  },
  //多选
  checkboxChange: function (e) {
    var that = this
    if (e.detail.value.length === 1) {
      that.data.cardcasedata[e.currentTarget.dataset.id].checked = true
      that.data.cardcasedata[e.currentTarget.dataset.id].items
        .map(function (v, i) {
          v.checked = true
        })
      that.setData({
        cardcasedata: that.data.cardcasedata,
        green: true
      })
    } else {
      that.data.cardcasedata[e.currentTarget.dataset.id].checked = false
      that.data.cardcasedata[e.currentTarget.dataset.id].items
        .map(function (v, i) {
          v.checked = false
        })
      that.setData({
        green: false,
        cardcasedata: that.data.cardcasedata
      })
    }

    that.data.cardcasedata.map(function (v, i) {
      v.items.map(function (v, i) {
        if (v.checked == true) {
          that.setData({
            green: true,
          })
        }
      })
    })

  },
  //单选
  checkboxChange2: function (e) {
    var that = this
    var a;
    var a1 = []
    var aitems = that.data.cardcasedata[e.currentTarget.dataset.index].items
    if (e.detail.value.length === 1) {
      that.data.cardcasedata.map(function (v, i) {
        v.items.map(function (v1, i1) {
          if (v1.id === e.currentTarget.dataset.id) {
            v1.checked = true
          }
        })
      })
      that.setData({
        green: true,
        cardcasedata: that.data.cardcasedata
      })
    } else {
      that.data.cardcasedata.map(function (v, i) {
        v.items.map(function (v1, i1) {
          if (v1.id === e.currentTarget.dataset.id) {
            v1.checked = false
          }
        })
      })
      that.setData({
        cardcasedata: that.data.cardcasedata
      })
    }

    that.data.cardcasedata.map(function (v, i) {
      v.items.map(function (v1, i1) {
        if (v1.checked || v1.radio) {
          a = v.items
        }
      })
    })
    aitems.map(function (v, i) {
      if (v.checked) {
        a1.push(v.checked)
      }
    })

    if (a1.length == aitems.length) {
      that.data.cardcasedata[e.currentTarget.dataset.index].checked = true
      that.setData({
        green: true,
        cardcasedata: that.data.cardcasedata
      })
    } else if (a1.length == 0 || a1.length < aitems.length) {
      that.data.cardcasedata[e.currentTarget.dataset.index].checked = false
      that.setData({
        cardcasedata: that.data.cardcasedata
      })
    }

    if (typeof (a) == 'undefined') {
      that.setData({
        green: false,
        cardcasedata: that.data.cardcasedata
      })
    }


  },
  //移动某个分组
  selectGroup: function (e) {
    var that = this
    that.data.cardgroup.data.map(function (v, i) {
      v.select = false
      if (v.id == e.currentTarget.dataset.id) {
        if (v.select) {
          v.select = false
        } else {
          v.select = true
        }
      }
    })
    that.setData({
      'setGroup.data.gid': e.currentTarget.dataset.id,
      'cardgroup.data': that.data.cardgroup.data
    })
  },
  //删除分组
  deleteGroup: function (e) {
    var that = this
    var data = {
      'url': 'Card/DeleteGroup',
      'data': {
        id: e.currentTarget.dataset.id
      }
    }
    app.postData(data, function (res) {
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        success: function (res) {
          if (res.confirm) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              complete: function () {
                app.getData(that.data.cardgroup.url, function (res2) {
                  that.setData({
                    'cardgroup.data': res2.data,
                  })
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  //添加分组
  addGroup: function () {

    var that = this
    that.setData({
      isaddgroupinput: !that.data.isaddgroupinput
    })
  },
  //获取 新增分组名称
  getDddGroupName: function (e) {
    var that = this
    if (e.detail.value != '') {
      var data = {
        'url': 'Card/SaveGroup',
        'data': {
          'id': '',
          'name': e.detail.value
        }
      }
      app.postData(data, function (res) {
        app.getData(that.data.cardgroup.url, function (res2) {
          that.setData({
            'cardgroup.data': res2.data,
            isaddgroupinput: !that.data.isaddgroupinput
          })
        })
      })
    } else {
      wx.showToast({
        title: '分组名不能为空',
        icon: 'success',
        duration: 2000,
        complete: function () {
          that.setData({
            isaddgroupinput: !that.data.isaddgroupinput
          })
        }
      })
    }
  },

  //滑动开始
  handleStart: function (e) {
    var that = this
    if (that.data.userCardData.data.sortType == 3 && that.data.isselecgroup) {
      if (e.currentTarget.dataset.name != '公司资源') {
        that.setData({
          touchDot: e.touches[0].pageX
        })
      }
    }

  },
  //滑动过程中
  handleMove: function (e) {
    var that = this
    if (that.data.userCardData.data.sortType == 3 && that.data.isselecgroup) {
      if (e.currentTarget.dataset.name != '公司资源') {
        var touchMove = e.touches[0].pageX
        if (touchMove > that.data.touchDot) {
          that.data.cardcasedata.map(function (v, i) {
            v.items.map(function (v2, i2) {
              if (v2.id === e.currentTarget.dataset.id) {
                v2.radio = false
              }
            })
          })
          that.setData({
            ismovebtn: false,
            cardcasedata: that.data.cardcasedata
          })
        }
        if (touchMove < that.data.touchDot) {
          that.data.cardcasedata.map(function (v, i) {
            v.items.map(function (v2, i2) {
              v2.radio = false
              if (v2.id === e.currentTarget.dataset.id) {
                v2.radio = true
              }
            })
          })
          that.setData({
            ismovebtn: true,
            cardcasedata: that.data.cardcasedata
          })
        }
      }
    }
  },
  handleSkip: function (e) {
    wx.navigateTo({
      url: '../carddetails/carddetails?id=' + e.currentTarget.dataset.id + '&type=1'
    })
  },
  //隐藏遮罩层
  hideMade: function () {
    var that = this
    that.data.cardcasedata.map(function (v, i) {
      v.items.map(function (v2, i2) {
        v2.radio = false
      })
    })
    that.setData({
      ismovebtn: false,
      cardcasedata: that.data.cardcasedata
    })
  },
  onLoad: function (e) {
    var that = this
    that.getUserCardData(that, 1, '')
  },
  onShow: function () {
    var that = this
    that.getUserCardData(that, that.data.userCardData.data.sortType, '')
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },

})