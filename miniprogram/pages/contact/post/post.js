// miniprogram/pages/contact/post/post.js
const app=getApp()
const db=wx.cloud.database()
const untils=require('../../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1:'',
    value2:'',
    value3:'',
    value4:''
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
  handleGet1(e){
    if(e.detail.value){
      this.setData({
        value1:e.detail.value
      })
    }
    else{
      wx.showToast({
        title: '标题不能为空',
        icon:'none'
      })
    }
  },
  handleGet2(e) {
    if (e.detail.value) {
      this.setData({
        value2: e.detail.value
      })
    } else {
      wx.showToast({
        title: '分类不能为空',
        icon: 'none'
      })
    }
  },
  handleGet3(e) {
      this.setData({
        value3: e.detail.value
      })
  },
  handleGet4(e) {
    if (e.detail.value) {
      this.setData({
        value4: e.detail.value
      })
    } else {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
    }
  },
  handlePost(){
    if (this.data.value1 && this.data.value2 && this.data.value4){
      db.collection('contact').add({
        data:{
          time: untils.formatTime(new Date()),
          title:this.data.value1,
          tname:this.data.value2,
          author:this.data.value3,
          content:this.data.value4
        }
      }).then((res)=>{
        wx.showToast({
          title: '发表成功',
        })
        wx.navigateTo({
          url: '../contact',
        })
      })
    }
  }
})