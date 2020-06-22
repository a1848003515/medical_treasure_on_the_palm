// miniprogram/pages/index/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointId: '',
    content: '',
    list: [],
    city: '',
    region: ['全国', '全国', '请选择地区'],
    customItem: '全国'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      pointId: options.pointId
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  handleGet(e) {
    this.setData({
      content: e.detail.value
    })
  },
  handlePost() {
    var that = this
    wx.showToast({
      title: '正在搜索...',
    })
    if (this.data.pointId == 'Hospital') {
      wx.request({
        url: 'https://route.showapi.com/87-60', //仅为示例，并非真实的接口地址
        data: {
          showapi_appid: '200214',
          showapi_sign: '69f7ea7769f140f795ac4bfbea88c041',
          hosName: that.data.content
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            list: res.data.showapi_res_body.hospitalList
          })
        }
      })
    } else if (this.data.pointId == 'Pharmacy') {
      if (that.data.city=='全国全国'){
        wx:wx.showToast({
          title: '请输入具体地址',
          icon: 'none',
        })
      }
      else{
        wx.request({
          url: 'https://route.showapi.com/52-26', //仅为示例，并非真实的接口地址
          data: {
            showapi_appid: '200214',
            showapi_sign: '69f7ea7769f140f795ac4bfbea88c041',
            page_size: 20,
            // page_num:10,
            q: that.data.content,
            region: that.data.city
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            that.setData({
              list: res.data.showapi_res_body.results
            })
          }
        })
      }

      
    } else if (this.data.pointId == 'Drugs'){
      wx.request({
        url: 'https://route.showapi.com/93-97', //仅为示例，并非真实的接口地址
        data: {
          showapi_appid: '200214',
          showapi_sign: '69f7ea7769f140f795ac4bfbea88c041',
          keyword: that.data.content,
          limit: 10
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            list: res.data.showapi_res_body.drugList
          })
        }
      })
    } else if (this.data.pointId == 'Health'){
      wx.request({
        url: 'https://route.showapi.com/96-109', //仅为示例，并非真实的接口地址
        data: {
          showapi_appid: '200214',
          showapi_sign: '69f7ea7769f140f795ac4bfbea88c041',
          keyword: that.data.content,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            list: res.data.showapi_res_body.pagebean.contentlist
          })
        }
      })
    }else{
      wx.request({
        url: 'https://route.showapi.com/546-2', //仅为示例，并非真实的接口地址
        data: {
          showapi_appid: '200214',
          showapi_sign: '69f7ea7769f140f795ac4bfbea88c041',
          key: that.data.content,
          page:1
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            list: res.data.showapi_res_body.pagebean.contentlist
          })
        }
    })
    }

  },
  handleToHospital(e) {
    var value = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/hospital/hospital?hosName=' + value,
    })
  },

  handleToDrug(e) {
    var value = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/drugs/drugs?drugId=' + value,
    })
  },

  handleToHealth(e){
    var value = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/health/health?healthId=' + value,
    })
  },
  handleToKnow(e){
    var value = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../details/know/know?knowId=' + value,
    })
  },



  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var city = e.detail.value[1] + e.detail.value[2]
    console.log(city)
    this.setData({
      region: e.detail.value,
      city: city
    })
  },
  handleTo(e) {
    var name = e.currentTarget.dataset.name;
    var lng = e.currentTarget.dataset.lng;
    var lat = e.currentTarget.dataset.lat;
    var addr = e.currentTarget.dataset.addr;
    wx.getLocation({ //获取当前经纬度
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function(res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: lat, //要去的纬度-地址
          longitude: lng, //要去的经度-地址
          name: name,
          address: addr
        })
      },
      fail: function(err) {
        console.log(1)
        wx.showToast({
          title: '请打开',
          icon: 'none'
        })
      }
    });

  }
})