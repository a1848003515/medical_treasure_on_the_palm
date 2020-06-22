// miniprogram/pages/detail/detail.js
const db = wx.cloud.database()
const app = getApp()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isFriend: false,
    isHidden:true,
    userId:'',
    registerDate:[],
    registerTime:{},
    index:0,
    time:'00:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userId = options.userId;
    this.setData({
      userId : options.userId
    })
    db.collection('users').doc(userId).get().then((res)  => {
      console.log(res.data)
      this.setData({
        detail: res.data,
        registerDate:res.data.registerDate,
        registerTime:res.data.registerTime,
        time: res.data.registerTime.start,
      });
      let friendList = res.data.friendList;
      if(friendList.includes(app.userInfo._id)){
        this.setData({
          isFriend:true
        })
      }
      else{
        this.setData({
          isFriend:false
        },()=>{
          if(userId==app.userInfo._id){
            this.setData({
              isHidden:false
            })
          }
        })
      }
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
  handleAddFriend() {

    if (app.userInfo._id) {
      db.collection('message').where({
        userId: this.data.detail._id
      }).get().then((res) => {
        console.log(res.data)
        if (res.data.length>0) { //更新
          if (res.data[0].list.includes(app.userInfo._id)) {
            wx.showToast({
              title: '已申请过！',
              icon: 'none'
            })
          } else {
            wx.cloud.callFunction({
              name: 'funcupdate',
              data: {
                collection: 'message',
                where: {
                  userId: this.data.detail._id
                },
                data: `{list:_.push('${app.userInfo._id}')}`
              }
            }).then((res) => {
              wx.showToast({
                title: '申请成功~'
              })
            })
          }

        } 
        else { //添加
          db.collection('message').add({
            data: {
              userId: this.data.detail._id,
              list: [app.userInfo._id]
            }
          }).then((res) => {
            wx.showToast({
              title: '申请成功',
            })
          })
        }
      })
    } else {
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
  },
  handleDel() {
    wx.showModal({
      title: '提示信息',
      content: '删除好友',
      confirmText: '删除',
      success: (res) => {
        if (res.confirm) {
          this.remove()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  remove() {
    var that=this
    db.collection('users').where({
      _id: app.userInfo._id
    }).get().then((res) => {
      let list = res.data[0].friendList;
      list = list.filter((val, i) => {
        return val != that.data.userId
      });
      wx.cloud.callFunction({
        name: 'funcupdate',
        data: {
          collection: 'users',
          where: {
            _id: app.userInfo._id
          },
          data: {
            friendList:list
          }
        }
      }).then((res) =>{
        console.log('删除成功')
      })
    });


    db.collection('users').where({
      _id: that.data.userId
    }).get().then((res) => {
      let list = res.data[0].friendList;
      list = list.filter((val, i) => {
        return val != app.userInfo._id
      });
      wx.cloud.callFunction({
        name: 'funcupdate',
        data: {
          collection: 'users',
          where: {
            _id: that.data.userId
          },
          data: {
            friendList: list
          }
        }
      }).then((res) => {
        console.log('删除成功')
      })
    });
  },
  handleMsg(){
    wx.navigateTo({
      url: '/pages/message/chatroom/chatroom?userId=' + this.data.userId + '&userName=' + this.data.detail.nickName,
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerTime(e){
    this.setData({
      time: e.detail.value
    })
  },


  handleRegister(){
    var that=this
    var shijian=new Date()
    if(app.userInfo._id){
    db.collection('register').where({
      doctorId:that.data.userId
    }).get().then((res)=>{
      if (res.data.length) { //更新
        console.log(res.data)
          var j=0;
          for(var i=0;i<res.data.length;i++){
            if(res.data[i].patientId == app.userInfo._id && (res.data[i].registerTime-shijian)<36000000){
              j=1;
              break;

              
            }
          }
          if(j==1){
            wx.showToast({
              title: '今天已预约该医生',
              icon: "none"
            })
          }
            else{
              db.collection('register').add({
                data: {
                  doctorId: that.data.userId,
                  patientId: app.userInfo._id,
                  date: that.data.registerDate[that.data.index],
                  time: that.data.time,
                  name:app.userInfo.nickName,
                  registerTime: new Date()
                }
              })
            }
      } else { //添加
        console.log(3)
        db.collection('register').add({
          data: {
            doctorId: that.data.userId,           
            patientId: app.userInfo._id,
            date: that.data.registerDate[that.data.index],
            time: that.data.time,
            registerTime: new Date()
          }
        })
      }
    })
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
  }

})