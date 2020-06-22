// miniprogram/pages/message/chatroom/chatroom.js
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: './user-unlogin.png',
    userInfo: null,
    logged: false,
    requestResult: '',
    // chatRoomEnvId: 'zsjyb-ghost',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: '',
    chatRoomGroupName: '',
    onGetUserInfo: null,
    getOpenID: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let userId1 = options.userId + app.userInfo._id
    let userId2 = app.userInfo._id + options.userId
    this.setData({
      chatRoomGroupId: userId1,
      chatRoomGroupName: options.userName
    })
    db.collection('chatroom').field({
      groupId: true
    }).get().then((res) => {
      console.log(res)
      for (var i = 0; i < res.data.length; i++) {

        if (userId1 == res.data[i].groupId || userId2 == res.data[i].groupId) {
          this.setData({
            chatRoomGroupId: res.data[i].groupId,
            chatRoomGroupName: options.userName
          })
        } else {
          this.setData({
            chatRoomGroupId: userId1,
            chatRoomGroupName: options.userName
          })
        }

      }
    })

    // 获取用户信息
    db.collection('users').doc(app.userInfo._id).get().then((res)=>{
      console.log(res.data)
      this.setData({
        userPhoto: res.data.userPhoto,
        userInfo: res.data
      })
    })
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             userPhoto: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    this.setData({
      onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const {
            top,
            bottom
          } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
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
  getOpenID: async function() {
    if (this.openid) {
      return this.openid
    }

    const {
      result
    } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
  },

  onGetUserInfo: function(e) {
    console.log(1)
    console.log(e)
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userPhoto: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  
})