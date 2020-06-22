//获取应用实例
var App = getApp();
var bmap = require('../../utils/bmap-wx.min.js');
var wxMarkerData = [];
var WxSearch = require('../../wxSearch/wxSearch.js');
var count = 10;
var total = 0;
var code = "2";
Page({
  data: {
    placeData: [],
    aslect: false,
    bslect: true,
    cslect: true,
    dslect: true,
    eslect: true,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    telephone: {},
    test: '',
    interval: 3000,
    duration: 1000,
    array: [{
      code: '1',
      id: 'icon_1',
      src: '../../images/near/hospital.png',
      text: '医院'
    }, {
      code: '2',
      id: 'icon_2',
      src: '../../images/near/pharmacy.png',
      text: '药店'
    },],
    dataArray: [],
  },

  //分类存储
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
    that.setData({
      index_id: e.markerId,
    })
    // console.log(e)
    // this.showSearchInfo(e);
  },
  openPage: function (a) {
    var e = a.currentTarget.dataset.url;
    // console.log(e)
    wx.reLaunch({
      url: e,
    });

  },
  onLoad: function (options) {
    var that = this;
    if (options.scene) {
      console.log("has scene");
      var scene = decodeURIComponent(options.scene);
      console.log("scene is ", scene);
      var arrPara = scene.split("&");
      var arr = [];
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        wx.setStorageSync(arr[0], arr[1]);
        console.log("setStorageSync:", arr[0], "=", arr[1]);
      }
    } else {
      console.log("no scene");
    }

    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 400, ['医院', '药店',]);
    WxSearch.initMindKeys(['大药房', '药店', '三甲医院', '医院',]);
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '0ElWa2xOAVNYoP2U8aDpaWmHCEpBY4Gh'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        dataArray: data.wxMarkerData
      });
    };

    // 发起POI检索请求 
    BMap.search({
      "query": "医院",
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../images/near/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/near/marker_yellow.png'
    });
  },

  //点击事件
  wxSearchFn: function (e) {
    var that = this;
    total = 0;
    code = e.currentTarget.dataset.code + "";
    var name = e.currentTarget.dataset.text + "";
    this.data.dataArray = [];

    WxSearch.wxSearchAddHisKey(that);

    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '0ElWa2xOAVNYoP2U8aDpaWmHCEpBY4Gh'
    });

    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData,
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        dataArray: data.wxMarkerData
      });
    };
    // 发起POI检索请求 
    BMap.search({
      query: name,
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../images/near/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/near/marker_yellow.png'
    });
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  showSearchInfo: function (data, i) {
    var that = this;
    var Otitle = data[i].title;
    var Oaddress = data[i].address;
    wx.getLocation({//获取当前经纬度
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: data[i].latitude,//要去的纬度-地址
          longitude: data[i].longitude,//要去的经度-地址
          name: Otitle,
          address: Oaddress
        });
      },
      fail:function(err){
        console.log(1)
        wx.showToast({
          title: '请打开',
          icon: 'none'
        })
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/marker_yellow.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/marker_red.png";
      }
      markers[j](data[j]);
    }
    that.setData({
      markers: markers
    });
  },
  goTolocate: function () {

  },
  onShareAppMessage: function (res) {
    //console.log("用户点击了确定", res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '美丽生活帮-看看周围有什么',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功

        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {
        // 转发失败
        console.log("用户点击了取消", res)
      }
    }
  },
  handleTo(e){
    var id = e.currentTarget.dataset.id;
    wx.getLocation({//获取当前经纬度
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: wxMarkerData[id].latitude,//要去的纬度-地址
          longitude: wxMarkerData[id].longitude,//要去的经度-地址
          name: wxMarkerData[id].title,
          address: wxMarkerData[id].address
        })
      },
      fail: function (err) {
        console.log(1)
        wx.showToast({
          title: '请打开',
          icon: 'none'
        })
      }
    });   
  }
})
