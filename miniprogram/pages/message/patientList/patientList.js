const db=wx.cloud.database()
const app= getApp()
const _=db.command


Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientList:[]
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
    var list=[]
    db.collection('register').where({
      doctorId: app.userInfo._id
    }).field({
      patientId: true
    }).get().then((res) => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].patientId){
         list=list.concat([res.data[i].patientId])
        }
      }
      console.log(list)
      this.setData({
        patientList:list
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
      patientList: []
    }, () => {
      this.setData({
        patientList: ev.detail
      })
    })
  }
})