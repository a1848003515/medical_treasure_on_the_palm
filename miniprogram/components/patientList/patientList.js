// components/removeList/removeList.js
const db = wx.cloud.database()
const app = getApp()
const _ = db.command
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    patientId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userList: {},
    tiemList:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDelMessage() {
      wx.showModal({
        title: '提示信息',
        content: '删除预约',
        confirmText: '删除',
        success: (res) => {
          if (res.confirm) {
            this.removeMessage()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    handleAddFriend() {
      wx.showModal({
        title: '提示信息',
        content: '完成预约',
        confirmText: '完成',
        success: (res) => {
          if (res.confirm) {
            this.removeMessage()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    removeMessage() {
      var that = this;
      var list=[]
      db.collection('register').where({
        doctorId: app.userInfo._id,
      }).get().then((res) => {


        for (var i = 0; i < res.data.length; i++){
          if (res.data[i].patientId){
          list = list.concat([res.data[i].patientId])
          }
        }
        
        for (var i = 0; i < res.data.length; i++) {
          var id = res.data[i]._id
          if (res.data[i].patientId == that.data.patientId && res.data[i].date == that.data.timeList.date && res.data[i].time == that.data.timeList.time) {            
            wx.cloud.callFunction({
              name: 'remove',
              data: {
                collection: 'register',
                where: {
                  _id:id
                }
              }
            })
            list = list.filter((val, i) => {
              return val != that.data.patientId
            });

            break;
          }
        }
      }).then((res) => {
        this.triggerEvent('myevent',list);
      })
    },
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
        db.collection('users').doc(this.data.patientId).field({
          userPhoto: true,
          nickName: true
        }).get().then((res) => {
          this.setData({
            userList: res.data
          })
        })

        db.collection('register').where({
          patientId: this.data.patientId
        }).field({
          date: true,
          time: true
        }).get().then((res) => {
          this.setData({
            timeList: res.data[0]
          })
        })
        this.setData({
          logged:true
        })
      
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.setData({
        logged: false
      })
    },
  },
})
