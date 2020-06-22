// miniprogram/pages/medication/medication.js

const db=wx.cloud.database()
const app=getApp()
const _=db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    i:0,
    medicationList: [],
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var list = []
    db.collection('medication').where({
      touser: app.userInfo._openId
    }).field({
      _id: true
    }).get().then((res) => {
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {
          list = list.concat([res.data[i]._id])
      }
      this.setData({
        medicationList: list
      })
    })


    
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
  onMyEvent(ev) {
    console.log(ev.detail)
    this.setData({
      medicationList: []
    }, () => {
      this.setData({
        medicationList: ev.detail
      })
    })
  },
  handleAdd() {
    var i = this.data.i
    if (this.data.medicationList.length< 5) {
      this.setData({
        list: this.data.list.concat([i++]),
        i: i
      })
    } else {
      wx.showToast({
        title: '最多添加5个方案',
        icon: 'none'
      })
    }
    console.log(this.data.list)
  },


})