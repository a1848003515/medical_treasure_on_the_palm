// components/medication/medication.js

const db = wx.cloud.database()
const app = getApp()
const _ = db.command
const tmplId = "UBaK8Dp8SqY6AVNwY3bjwlofBMMdeWClCQDyx3JIk0s"


Component({
      /**
       * 组件的属性列表
       */
      properties: {
        medicationId: String
      },

      /**
       * 组件的初始数据
       */
      data: {
        list: [],
        time: '00:00',
        days: [{
          value: '星期一',
          checked: ''
        }, {
          value: '星期二',
          checked: ''
        }, {
          value: '星期三',
          checked: ''
        }, {
          value: '星期四',
          checked: ''
        }, {
          value: '星期五',
          checked: ''
        }, {
          value: '星期六',
          checked: ''
        }, {
          value: '星期日',
          checked: ''
        }, {
          value: '不重复',
          checked: ''
        }, ],
        Date: [],
        title: '',
        content: '',
        week: [],
        logged:true
      },

      /**
       * 组件的方法列表
       */
      methods: {

        checkboxChange: function(e) {
          this.setData({
            Date: e.detail.value
          })
          console.log(this.data.Date)
        },
        bindPickerTime(e) {
          this.setData({
            time: e.detail.value
          })
        },
        handleTitle(e) {
          this.setData({
            title: e.detail.value
          })
        },
        handleContent(e) {
          this.setData({
            content: e.detail.value
          })
        },

        handleAdopt() {
          var that = this
          if (this.data.Date==0||!this.data.Date) {
            wx.showToast({
              title: '请设置时间',
              icon: 'none'
            })
          } else {
            if (this.data.Date.includes("不重复") && this.data.Date.length > 1) {
              wx.showToast({
                title: '选择不重复，无法选择其他时间',
                icon: 'none'
              })
            } else {
              if(!that.data.title||!that.data.content){
                wx.showToast({
                  title: '名称或内容为空',
                  icon:'none'
                })
              }else{
                wx.requestSubscribeMessage({
                  tmplIds: [tmplId],
                  success(res) {
                    if (res.errMsg === 'requestSubscribeMessage:ok') {
                      db.collection('medication').where({ touser: app.userInfo._openid }).field({ _id: true }).get().then((res) => {
                        if (res.data.length < 5) {
                          db.collection('medication').add({
                            data: {
                              data: {
                                thing1: {
                                  value: that.data.content
                                },
                                thing2: {
                                  value: that.data.title
                                }
                              },
                              setDate: that.data.Date,
                              setTime: that.data.time,
                              touser: app.userInfo._openid,
                              templateId:tmplId,
                              page: 'index',
                              done: 'false'
                            }
                          }).then((res) => {
                            wx.showToast({
                              title: '设置成功',
                            }).then((res)=>{
                              setTimeout(() => {
                                wx.switchTab({
                                  url: '../../pages/user/user',
                                })
                              }, 1000)
                              
                            })
                          })
                        } else {
                          wx.showToast({
                            title: '最多可设置5种方案',
                            icon: 'none'
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          }
        },

    handleDelet() {
      wx.showModal({
        title: '提示信息',
        content: '删除方案',
        confirmText: '删除',
        success: (res) => {
          if (res.confirm) {
            this.setData({
              logged:false
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },


  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行

    },
  }
})