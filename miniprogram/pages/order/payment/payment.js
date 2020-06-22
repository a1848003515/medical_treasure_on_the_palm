// miniprogram/pages/order/payment/payment.js
const app=getApp()
const db=wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceTotal:'',
    menuList:[],
    region: ['所在地区'],
    consignee:'',
    phone:'',
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key: 'menuList',
      success: function(res) {
        that.setData({
          menuList:res.data.menu,
          priceTotal:res.data.priceTotal
        })
      },
    })
    wx.getStorage({
      key: 'address',
      success: function(res) {
        that.setData({
          consignee:res.data.consignee,
          phone:res.data.phone,
          address:res.data.address,
          region:res.data.region
        })
      },
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
  handleGetName(e){
    if (e.detail.value) {
      this.setData({
        consignee: e.detail.value
      })
    }else{
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
    }else{
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
    
  },
  handleGetAddr(e) {
    if(e.detail.value){
      this.setData({
        address: e.detail.value
      })
    }
    else{
      wx.showToast({
        title: '请输入具体地址',
        icon:'none'
      })
    }
    
  },
  handlePay(){
    var obj={}
    obj.phone=this.data.phone
    obj.consignee = this.data.consignee
    obj.address = this.data.address
    obj.region = this.data.region
    var orders={}
    orders.menu=this.data.menuList
    orders.priceTotal=this.data.priceTotal
    wx.setStorage({
      key: 'address',
      data: obj,
    })
    if(this.data.priceTotal>0){
      db.collection('order').where({
        orderList: obj
      }).get().then((res) => {
        console.log(res)
        if (res.data.length == 0) {
          db.collection('order').add({
            data: {
              done: false,
              addressList: obj,
              time: new Date(),
              orderList: orders
            }
          })
        }
      })
      wx.removeStorage({
        key: 'menuList',
        success: function (res) {
          console.log('成功')
          wx.switchTab({
            url: '../../user/user',
          })
        },
      })
    }
    else {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    }
    
    
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