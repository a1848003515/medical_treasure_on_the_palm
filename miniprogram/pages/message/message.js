
const app=getApp();
const db=wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto:'../user/user-unlogin.png',
    _id:'',
    nickName:'',
    current: 0,
    logged:false,
    friendList:[],
    isMsg:false
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
    // db.collection('users').where({
    //   friendList: app.userInfo._id
    // }).field({
    //   userPhoto: true,
    //   nickName: true
    // }).get().then((res) => {
    //   console.log(res.data)
    //   this.setData({
    //     friendList: res.data
    //   })
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.userInfo._id){
      wx.cloud.callFunction({
        name: 'login',
        data: {}
      }).then((res) => {
        db.collection('users').where({
          _openid: res.result.openid
        }).get().then((res) => {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            _id:app.userInfo._id,
            logged: true,
          });
        });

      });
    }
    else{
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user',
            })
          }, 2000)
        }
      })
    }
    db.collection('users').where({
      friendList: app.userInfo._id
    }).field({
      userPhoto: true,
      nickName: true,
      signature:true
    }).get().then((res) => {
      this.setData({
        friendList: res.data
      })
    })

    db.collection('message').where({userId:app.userInfo._id}).field({list:true}).get().then((res)=>{
      console.log(res)
      if(res.data.length>0&&res.data[0].list.length>0){
        this.setData({
          isMsg:true
        })
      }
      else{
        this.setData({
          isMsg:false
        })
      }
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
  bindchange: function (e) {
    const that = this;
    that.setData({
      current: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

    if (that.data.current === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        current: e.target.dataset.current
      })
    }
  },
  handleToNav(){
    wx.navigateTo({
      url: './userMessage/userMessage',
    })
  },
  handleToRegister(){
    wx.navigateTo({
      url: './patientList/patientList',
    })
  }
})