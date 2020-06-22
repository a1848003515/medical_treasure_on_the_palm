// miniprogram/pages/editUserInfo/identity/identity.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    address:'',
    occupation:'',
    occupationNumber:''
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
    this.setData({
      nickName: app.userInfo.nickName,
      address: app.userInfo.address,
      occupation: app.userInfo.occupation,
      occupationNumber: app.userInfo.occupationNumber
    })
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
  handleText1(ev) {
    let value = ev.detail.value;
    this.setData({
      nickName: value,
    });
  },
  handleText2(ev) {
    let value = ev.detail.value;
    this.setData({
      address: value,
    });
  },
  handleText3(ev) {
    let value = ev.detail.value;
    this.setData({
      occupation: value,
    });
  },
  handleText4(ev) {
    let value = ev.detail.value;
    this.setData({
      occupationNumber: value,
    });
  },
  handleBtn() {
    this.upDateSignature();
  },
  upDateSignature() {
    wx.showLoading({
      title: '更新中',
    });
    db.collection('users').doc(app.userInfo._id).update({
      data: {
        nickName: this.data.nickName,
        address: this.data.address,
        occupation: this.data.occupation,
        occupationNumber: this.data.occupationNumber,
      }
      
    }).then((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '更新成功',
      });
      app.userInfo.nickName = this.data.nickName;
      app.userInfo.address = this.data.address;
      app.userInfo.occupation = this.data.occupation;
      app.userInfo.occupationNumber = this.data.occupationNumber;
    });
  },
  
})