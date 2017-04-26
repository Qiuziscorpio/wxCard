// pages/map/map.js


var QQMapWX = require('../../js/qqmap-wx-jssdk.js');
// 实例化腾讯地图API核心类
var demo = new QQMapWX({
  key: 'VXWBZ-GQWC4-RCSU6-XOGJV-FLLHV-DXFIL' // 必填 QIUGUANGMIAO KEY
});

Page({
  data: {
    city: "",
    isiconsousu: true,
    activeAddress: false,
    inputVal: "",
    markers: [{
      iconPath: "/resources/others.png",
      id: 0,
      latitude: 23,
      longitude: 113,
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
      },
      clickable: true
    }],
    pois: []
  },
  regionchange(e) {
    var that = this
    console.log(e.type)
    if (e.type == 'end') {
      that.getLngLat()
    }
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //逆地址解析(坐标位置描述)
  reverseGeocoder: function (latitude, longitude) {
    var that = this
    demo.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      get_poi: 1,
      success: function (res) {
        that.setData({
          pois: res.result.pois,
          city: res.result.address_component.city
        })
      },
      fail: function (res) {
        // console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  //操作搜索输入框聚焦
  handlFocus: function () {
    var that = this
    that.setData({
      isiconsousu: false
    })
  },
  //获取搜索关键字
  getInputVal: function (e) {
    var that = this
    that.setData({
      inputVal: e.detail.value
    })
    console.log("获取了输入键盘")
  },
  //点击搜索确定之后 获取搜索关键字后数据
  getSearchData: function () {
    var that = this
    if (that.data.inputVal === '') {
      that.setData({
        isiconsousu: true
      })
    }
    console.log(that.data.city, 'city')
    demo.getSuggestion({
      keyword: that.data.inputVal,
      region: that.data.city,
      region_fix: 1,
      success: function (res) {
        that.setData({
          pois: res.data,
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  //地图拖拽 附近地址实时更新
  getLngLat: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          markers: [
            {
              iconPath: "/resources/others.png",
              id: 0,
              latitude: res.latitude,
              longitude: res.longitude
            }
          ],
        })
        that.reverseGeocoder(res.latitude, res.longitude)
      }
    })
  },
  //定位当前地址
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        //当前地址定位
        that.setData({
          markers: [
            {
              iconPath: "/resources/others.png",
              id: 0,
              latitude: latitude,
              longitude: longitude
            }
          ],
          polyline: [{
            points: [{
              longitude: longitude,
              latitude: longitude
            }, {
              longitude: longitude,
              latitude: longitude
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
          }],
        })
        that.reverseGeocoder(latitude, longitude)
      }
    })
  },
  //选择地址
  selectAddress: function (e) {
    var that=this
    e.currentTarget.dataset.activeAddress=true
    console.log(e.currentTarget.dataset.activeAddress )
  },
  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    var that = this
    that.getLocation()
  }
})