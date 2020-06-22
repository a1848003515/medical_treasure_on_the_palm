// miniprogram/pages/order/payment/payment2.js
const app = getApp()
const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceTotal: '',
    menuList: [],
    region: ['所在地区'],
    consignee: '',
    phone: '',
    address: '',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('order').where({_id:options.id}).get().then((res)=>{
      this.setData({
        menuList:res.data[0].orderList.menu,
        priceTotal: res.data[0].orderList.priceTotal,
        consignee: res.data[0].addressList.consignee,
        phone: res.data[0].addressList.phone,
        address: res.data[0].addressList.address,
        region: res.data[0].addressList.region,
        id:options.id
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
    })
  },
  handleGetName(e) {
    if (e.detail.value) {
      this.setData({
        consignee: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入收货人',
        icon: 'none'
      })
    }

  },
  handleGetPhone(e) {
    if (e.detail.value) {
      this.setData({
        phone: e.detail.value
      })
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }

  },
  handleGetAddr(e) {
    if (e.detail.value) {
      this.setData({
        address: e.detail.value
      })
    }
    else {
      wx.showToast({
        title: '请输入具体地址',
        icon: 'none'
      })
    }

  },
  handlePay() {
    var obj = {}
    obj.phone = this.data.phone
    obj.consignee = this.data.consignee
    obj.address = this.data.address
    obj.region = this.data.region
    var orders = {}
    orders.menu = this.data.menuList
    orders.priceTotal = this.data.priceTotal
    wx.setStorage({
      key: 'address',
      data: obj,
    })
          db.collection('order').doc(this.data.id).update({
            data: {
              done: false,
              addressList: obj,
              orderList: orders
            }
          }).then((res)=>{
            wx.switchTab({
              url: '../../user/user',
            })
          })


    // wx.requestPayment({
    //   timeStamp: new Date(),
    //   nonceStr: '',
    //   package: '',
    //   signType: 'MD5',
    //   paySign: '',
    //   success(res) { 
    //     console.log(res)
    //   },
    //   fail(res) {
    //     console.log(res)
    //    }
    // })
    }

})