// miniprogram/pages/near/near.js

const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: './user-unlogin.png',
    nickName: "",
    identity:"",
    userInfo: {},
    logged: false,
    disable: true,
    listData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        logged: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          logged: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            logged: true
          });
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.cloud.callFunction({
        name : 'login',
        data:{}
      }).then((res)=>{

        db.collection('users').where({
          _openid : res.result.openid
        }).get().then((res)=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo, res.data[0]);
            this.setData({
              userPhoto: app.userInfo.userPhoto,
              nickName: app.userInfo.nickName,
              identity:app.userInfo.identity,
              logged: true,
            });
            this.getMessage();
          }
          else{
            this.setData({
              disabled:false
            })
          }
          
        });
        
      });
      db.collection('users').get().then((res)=>{
          // console.log(res.data)
        this.setData({
          listData : res.data
        })
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto:app.userInfo.userPhoto,
      nickName:app.userInfo.nickName
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
  bindGetUserInfo(ev){
    let userInfo=ev.detail.userInfo;
    if(!this.data.logged && userInfo){
      db.collection('users').add({
        data : {
          userPhoto:userInfo.avatarUrl,
          nickName:userInfo.nickName,
          identity:'user',
          signature:'',
          phoneNumber:'',
          weixinNumber:'',
          address:"",
          occupation:"",
          occupationNumber:"",
          times:new Date(),
          friendList:[],
          registerTime:{
            start:'',
            end:''
          },
          registerDate:[]
        }
      }).then((res)=>{
          db.collection('users').doc(res._id).get().then((res)=>{
            console.log(res.data);
            app.userInfo = Object.assign(app.userInfo,res.data);
            this.setData({
              userPhoto : app.userInfo.userPhoto,
              nickName :app.userInfo.nickName,
              logged:true
            });
          });
      });
    }
  },
  handleP(e){
    console.log(e.target.dataset.id);

    wx.showLoading({
      title: '审核中',
    });
    wx.cloud.callFunction({
      name:'funcupdate',
      data:{
        collection:'users',
        doc: e.target.dataset.id,
        data: {
          identity: 'doctor'
        }
      }
      
    }).then((res)=>{
      wx.hideLoading();
      wx.showToast({
        title: '完成操作',
      });
    })

  },
  handleNP(e){
    console.log(e);
    wx.showLoading({
      title: '审核中',
    });
    wx.cloud.callFunction({
      name: 'funcupdate',
      data: {
        collection: 'users',
        doc: e.target.dataset.id,
        data: {
          identity: 'user'
        }
      }
    }).then((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '完成操作',
      });
    })


  },
  getMessage(){
    db.collection('message').where({
      userId:app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
        console.log(snapshot.docChanges)
        if (snapshot.docChanges.length){
          let list = snapshot.docChanges[0].doc.list;
          if(list.length){
            wx.showTabBarRedDot({
              index: 1,
            });
            app.userMessage =list;
          }else{
            wx.hideTabBarRedDot({
              index: 1,
            })
            app.userMessage = [];
          }
        }
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  // getRegister(){
  //   db.collection('register').where({
  //     doctorId: app.userInfo._id
  //   }).watch({
  //     onChange: function (snapshot) {
  //       console.log(snapshot)
  //       var k=0;
  //       for(var i=0;i<snapshot.docChanges.length;i++){
  //         if (snapshot.docChanges[i].doc.patientId){
  //           k++;
  //         }
  //       }
  //       if(k==0){
  //         wx.hideTabBarRedDot({
  //           index: 1,
  //         })
  //         app.registerNumber = []
  //       }
  //       else{
  //         wx.showTabBarRedDot({
  //           index: 1,
  //         })
  //         app.registerNumber = [k]
  //       }
  //     },
  //     onError: function (err) {
  //       console.error('the watch closed because of error', err)
  //     }
  //   })
  // },
  handleCallPhone(){
    wx.makePhoneCall({
      phoneNumber: '1233211234567'
    })
  }
})